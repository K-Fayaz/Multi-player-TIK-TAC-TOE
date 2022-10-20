const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
// const

// set up static files
app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});

let waitingClients = [] , pairedClients = [];
let first , second , emittedUser;

io.on("connection", async (socket)=>{
  console.log('A user got connected To socket network! ',socket.handshake.auth);

  // user trying to find opponent
  socket.on('find-opponent',async(data)=>{

    // find the other users who are trying to find the opponent
    console.log(data);

    waitingClients.push(data);

    while(waitingClients.length >= 2)
    {
      first = waitingClients[0];
      second = waitingClients[1];

      // Now send first client second as Opponent and Vice Versa
      io.to(first.id).emit("opponent-found",{
        opponent: second,
        tossWon: first
      });

      io.to(second.id).emit("opponent-found",{
        opponent: first,
        tossWon: first,
      });

      pairedClients.push({
        playerOne: first.id,
        playerTwo: second.id
      })

      console.log(pairedClients);

      // Now remove first two Clients from waiting Array list
      emittedUser = waitingClients.shift();
      console.log(`Message recieved to ${emittedUser.user}`);

      emittedUser = waitingClients.shift();
      console.log(`Message recieved to ${emittedUser.user}`);
    }

  });


  socket.on('your-insert',(data)=>{
    io.to(data.to).emit('my-insert',data.blockId);
  });


  socket.on("your-move",(data)=>{
    io.to(data.to).emit('my-move',{
      curBlock: data.curBlock,
      updatingBlock: data.updatingBlock
    })
  })

  socket.on("win",(data)=>{
    io.to(data.to).emit("won");
  })

  socket.on("disconnect",()=>{
    let id;
    let i = 0;
    for(let pair of pairedClients)
    {
      if(pair.playerOne === socket.id)
      {
        id = pair.playerTwo;
        break;
      }else if(pair.playerTwo === socket.id)
      {
        id = pair.playerOne;
        break;
      }
      i++;
    }

    if(id)
    {
      console.log("Message sending to Opponent!");
      io.to(id).emit('opponent-left');

      // remove the pair from the pairedClients array
      pairedClients.splice(i,1);
      console.log(pairedClients);
    }

    i = 0;
    let found = false;
    // Check if the user who got disconnected is present in waitingClients array
    for(let client of waitingClients)
    {
      if(client.id === socket.id)
      {
        found = true;
        break;
      }
      i++;
    }
    if(found)
      waitingClients.splice(i,1);
  });
})


const PORT = 8080;
server.listen(PORT,()=>{
  console.log(`Listening to the PORT ${PORT}`);
})

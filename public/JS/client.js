let name;
let startBtn = document.getElementById("start-btn");
name = sessionStorage.getItem("user");
let opponent = null;
let gameOver = false;

console.log(name);

if(!name)
{
  console.log("I am NULL");
  do{
    name = prompt(`Login with Your Name

  1: Name must be atleast three charecters`);

    if(name && name.trim().length > 3)
    {
      // enter into DOM
      document.getElementById("user-name").innerText = `HI ${name}`;
      sessionStorage.setItem('user',name);
    }

  }while(name.trim().length < 3);
}else{
  document.getElementById("user-name").innerText = `HI ${name}`;
}

let socket = io({
  auth:{
    user: name,
    opponent: ''
  }
});

let playerTurn;
let myDiceSymbol,opponentDiceSymbol;
let myInsertCount = 0;
let playerTwoCount = 0;

let winMatrix = [
  ['one','two','three'],
  ['four','five','six'],
  ['seven','eight','nine'],
  ['one','four','seven'],
  ['two','five','eight'],
  ['three','six','nine'],
  ['one','five','nine'],
  ['three','five','seven']
];

let showConfetti = ()=>{
  const script=document.createElement("script");
  script.onload=(e)=>{
    startConfetti();

  }
  script.src="https://www.cssscript.com/demo/confetti-falling-animation/confetti.js";
  document.body.append(script);
};

function findOpponent()
{
  document.getElementById('buffer-container').style.display = "grid";
  document.getElementById("btn-click").play();

  let payload = {
    id: socket.id,
    user: socket.auth.user,
    // paired: socket.auth.paired,
  }

  socket.emit('find-opponent',payload);
};


function newBoard()
{
  for(let row of winMatrix)
  {
    console.log(row);
    document.getElementById(`${row[0]}-content`).innerText = "";
    document.getElementById(`${row[1]}-content`).innerText = "";
    document.getElementById(`${row[2]}-content`).innerText = "";
  }
}

function restart_opponent()
{
  opponent = null;
  gameOver = false;
  myDiceSymbol = '';
  opponentDiceSymbol = '';
  myInsertCount = 0;

  document.getElementById("btnContainer").style.display = "grid";
  // document.getElementById("buffer-container").style.display = "grid";
  document.getElementById("game-over").style.display = "none";
  document.getElementById('parent').style.display = "none";

}

function resetGame()
{
  // remove event listener and remove the reset button from the DOM
  document.getElementById("reset-game").removeEventListener("click",resetGame);
  document.getElementById("reset-game").style.display = "none";


  // 1 Stop the confetti
  stopConfetti();
  opponent = null;
  gameOver = false;
  myDiceSymbol = '';
  opponentDiceSymbol = '';
  myInsertCount = 0;

  newBoard();

  document.getElementById('parent').style.display = "none";
  document.getElementById("game-over").style.display = "none";

  findOpponent();
}

function playAgain()
{
  setTimeout(()=>{
    document.getElementById("reset-game").style.display = "grid";
    document.getElementById("reset-game").addEventListener("click",resetGame);
  },5000);
}

function didAnyBodyWin()
{
  let row;
  for(let i = 0; i < winMatrix.length ; i++)
  {
    row = winMatrix[i];
    let first = document.getElementById(`${row[0]}-content`);
    let second = document.getElementById(`${row[1]}-content`);
    let third = document.getElementById(`${row[2]}-content`);


    if(first.innerText)
    {
      if(first.innerText == second.innerText && second.innerText == third.innerText)
      {
        gameOver = true;
        showConfetti();
        if(first.innerText === myDiceSymbol)
        {
          document.getElementById("game-winning-sound").play();
          setTimeout(()=>{
            playAgain();
            document.getElementById("game-over").style.display = "grid";
            document.getElementById("game-over-text").innerText = "Congratultions, YOU WON";
          },500);
          socket.emit("win",{
            to:opponent.id,
          });
        }
      }
    }
  }
}

function insert(id)
{
  let div = document.getElementById(`${id}-content`);

  if(socket.id === playerTurn && !gameOver)
  {
    // It is Your turn
    // 1. Now insert your symbol
    // 2. Broadcast it to opponent that You have inserted to a certain block

    // 1.
    if(!div.innerText && myInsertCount < 3)
    {
      div.innerText = myDiceSymbol;
      document.getElementById("player-2").style.boxShadow = '2px 1px 100px 18px indigo';
      document.getElementById("player-1").style.boxShadow = 'none';
      myInsertCount += 1;

      playerTurn = opponent.id;

      // 2
      socket.emit('your-insert',{
        to: opponent.id,
        blockId:id,
      });

      didAnyBodyWin();
    }
  }else{
    // do nothing - it means it is not your turn now is the time of Opponent
  }

  /*if(currentPlayer === 1){
    if(!div.innerText && playerOneCount < 3){
      document.getElementById("player-2").style.boxShadow = '2px 1px 100px 18px indigo';
      document.getElementById("player-1").style.boxShadow = 'none';
      div.innerText = 'X';
      currentPlayer = 2;
      playerOneCount += 1;
      didAnyBodyWin();
    }
  }else{
    if(!div.innerText && playerTwoCount < 3){
      div.innerText = 'O';
      document.getElementById("player-1").style.boxShadow = '2px 1px 100px 18px indigo';
      document.getElementById("player-2").style.boxShadow = 'none';
      currentPlayer = 1;
      playerTwoCount += 1;
      didAnyBodyWin();
    }
  }*/
}

function moveDice(blockId,id)
{
  let nextBlock = document.getElementById(`${id}-content`);
  let currBlock = document.getElementById(`${blockId}-content`);

  // check if the Turn is mine or the Opponents ?
  if(currBlock.innerText && !gameOver)
  {
    if(socket.id === playerTurn && currBlock.innerText === myDiceSymbol)
    {
      currBlock.innerText = '';
      nextBlock.innerText = myDiceSymbol;

      document.getElementById("player-2").style.boxShadow = '2px 1px 100px 18px indigo';
      document.getElementById("player-1").style.boxShadow = 'none';

      // Now You need to Broadcast to the opponent That I Have Moved My dice
      //and it is His turn

      playerTurn = opponent.id;

      socket.emit('your-move',{
        // The payload should have current block,next Block Id and the Id of the opposite socket
        to: opponent.id,
        curBlock: blockId,
        updatingBlock:id
      })

      //
      didAnyBodyWin();
    }
  }



  /*if(currBlock.innerText)
  {
    if(currBlock.innerText === "X" && currentPlayer === 1)
    {
      if(!nextBlock.innerText)
      {
        currBlock.innerText = '';
        nextBlock.innerText = 'X';
        currentPlayer = 2;

        document.getElementById("player-2").style.boxShadow = '2px 1px 100px 18px indigo';
        document.getElementById("player-1").style.boxShadow = 'none';
      }
      didAnyBodyWin();
    }
    else if(currBlock.innerText === "O" && currentPlayer === 2)
    {
      if(!nextBlock.innerText)
      {
        currBlock.innerText = '';
        nextBlock.innerText = 'O';
        currentPlayer = 1;

        document.getElementById("player-1").style.boxShadow = '2px 1px 100px 18px indigo';
        document.getElementById("player-2").style.boxShadow = 'none';
      }
      didAnyBodyWin();
    }
  }*/
}

function startGame()
{
  // alert("HI");

  document.getElementById("start-game-counter").play();

  // first remove the button and buffer from the DOM
  document.getElementById("btnContainer").style.display = "none";
  document.getElementById("buffer-container").style.display = "none";

  // display Grid the timer container
  document.getElementById("timer-container").style.display = "grid";

  // Assign symbols to The players
  document.getElementById("player-1-symbol").innerText = myDiceSymbol;
  document.getElementById("player-2-symbol").innerText = opponentDiceSymbol;

  // Now reduce the time from 5 to 0

  document.getElementById("timer").innerText = 5;

  let timerId = setInterval(()=>{
    console.log("HI");
    document.getElementById("timer").innerText = Number(document.getElementById("timer").innerText) - 1;
  },1000);

  setTimeout(()=>{
    clearInterval(timerId);
    document.getElementById("timer-container").style.display = "none";

    // show the Game board
    document.getElementById("parent").style.display = "flex";
    document.getElementById("player-1-name").innerText = name;
    document.getElementById("player-2-name").innerText = opponent.user;

  },5000);

}

startBtn.addEventListener('click',()=>{
  document.getElementById("btnContainer").style.display = "none";
  findOpponent();
});


socket.on('opponent-found',(data)=>{
  // alert('HI')
  document.getElementById("client-message").innerText = "Opponent-found";
  opponent = data.opponent;

  socket.auth.opponent = data.opponent.id;
  console.log(socket.auth);
  console.log(opponent);

  playerTurn = data.tossWon.id;

  if(socket.id === playerTurn)
  {
    myDiceSymbol = 'X';
    opponentDiceSymbol = "O";

    document.getElementById("player-1").style.boxShadow = '2px 1px 100px 18px indigo';
    document.getElementById("player-2").style.boxShadow = 'none';
  }else{
    myDiceSymbol = "O";
    opponentDiceSymbol = "X";

    document.getElementById("player-2").style.boxShadow = '2px 1px 100px 18px indigo';
    document.getElementById("player-1").style.boxShadow = 'none';
  }

  // when opponet is found then begin the game
  startGame();
})

socket.on('my-insert',(data)=>{
  playerTurn = socket.id;
  document.getElementById(`${data}-content`).innerText = opponentDiceSymbol;

  document.getElementById("player-1").style.boxShadow = '2px 1px 100px 18px indigo';
  document.getElementById("player-2").style.boxShadow = 'none';

})

socket.on('my-move',(data)=>{
  playerTurn = socket.id;
  document.getElementById("player-1").style.boxShadow = '2px 1px 100px 18px indigo';
  document.getElementById("player-2").style.boxShadow = 'none';

  document.getElementById(`${data.curBlock}-content`).innerText = '';
  document.getElementById(`${data.updatingBlock}-content`).innerText = opponentDiceSymbol;

})

socket.on("won",()=>{
  gameOver = true;
  showConfetti();
  document.getElementById("game-over").style.display = "grid";
  document.getElementById("game-over-text").innerText = "You Lose!";
  document.getElementById("lose-game").play();
  playAgain();

});


socket.on("opponent-left",()=>{
  if(!gameOver)
  {
    document.getElementById("game-over").style.display = "grid";
    document.getElementById("opponent-left").play();
    document.getElementById("game-over-text").innerText = "Your Opponent left the game!";

    setTimeout(()=>{
      restart_opponent();
    },3000)

  }
  gameOver = true;
})

// let name;
// let startBtn = document.getElementById("start-btn");
// name = sessionStorage.getItem("user");
// let opponent = null;
// let gameOver = false;

// showConfetti

// console.log(name);
//
// const script=document.createElement("script");
//
// script.src="https://www.cssscript.com/demo/confetti-falling-animation/confetti.js";
// document.body.append(script);

// if(!name)
// {
//   console.log("I am NULL");
//   do{
//     name = prompt(`Login with Your Name
//
//   1: Name must be atleast three charecters`);
//
//     if(name && name.trim().length > 3)
//     {
//       // enter into DOM
//       document.getElementById("user-name").innerText = `HI ${name}`;
//       sessionStorage.setItem('user',name);
//     }
//
//   }while(name.trim().length < 3);
// }else{
//   document.getElementById("user-name").innerText = `HI ${name}`;
// }



//
let playerTurn;
let myDiceSymbol,opponentDiceSymbol;
let myInsertCount = 0;
let playerTwoCount = 0;


// Winning Matrix
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


//

function playAgain()
{
  setTimeout(()=>{
    document.getElementById("reset-game").style.display = "grid";

    document.getElementById("reset-game").addEventListener("click",resetGame);
  },5000);
}


function startGame()
{
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

  document.getElementById("start-game-counter").play();

  let timerId = setInterval(()=>{
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
  document.getElementById("btn-click").play();
  findOpponent();
});

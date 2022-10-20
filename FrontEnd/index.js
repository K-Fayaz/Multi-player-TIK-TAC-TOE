let currentPlayer = 1;
let playerOneCount = 0;
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


function didAnyBodyWin()
{
  let row;
  for(let i = 0; i < winMatrix.length ; i++)
  {
    row = winMatrix[i];
    let first = document.getElementById(`${row[0]}-content`);
    let second = document.getElementById(`${row[1]}-content`);
    let third = document.getElementById(`${row[2]}-content`);

    console.log(first.innerText);
    console.log(second.innerText);
    console.log(third.innerText);

    if(first.innerText)
    {
      if(first.innerText == second.innerText && second.innerText == third.innerText)
      {
        setInterval(()=>{
          if(first.innerText == "X"){
            alert("Genius,Billionaire,Playboy,Philantropist won the match !");
          }else{
            alert("Hey Banner, Smash!!!");
          }
        },1000)
      }
    }
  }

}

function insert(id)
{
  let div = document.getElementById(`${id}-content`);

  if(currentPlayer === 1){
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
  }
}

function moveDice(blockId,id)
{
  let nextBlock = document.getElementById(`${id}-content`);
  let currBlock = document.getElementById(`${blockId}-content`);
  if(currBlock.innerText)
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
  }
}

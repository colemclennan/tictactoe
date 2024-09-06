// Create a GameBoard object that instatiates itself
// Create a GameController obejct that instatiates itself
// Create two player objects in an array
// Create an active player variable
// Create a game state variable
// Create a function for taking a turn.
// Create a function that checks for win conditions
// Create a function that checks for draw conditions
// Create a function that resets the game

const GameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  // loop over all of the board buttons and render the symbol inside the .textContent
  // const render = () => {}

  // When a player makes a selection we need to update the board with their symbol if allowed.
  const selection = (square, symbol, gameState) => {
    if (gameState != 'finished' && board[square] == '') {
      board[square] = symbol;
      return true;
    }
    // console.log("can't go there");
    return false;
  }

  return { board, selection }
})();

const Players = (() => {
  const player1 = {
    name: 'player1',
    symbol: 'X',
    currentSquares: [],
  };

  const player2 = {
    name: 'player2',
    symbol: 'O',
    currentSquares: [],
  };

  let activePlayer = player1;

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    DisplayController.toggleActivePlayer;
  }

  const addPlayerSquare = (square) => activePlayer.currentSquares.push(square);

  const getActivePlayer = () => activePlayer;

  return { getActivePlayer, switchPlayer, addPlayerSquare } 
})();

const GameController = (() => {
  // Set gameState variable ('start', 'active', 'finished')
  let gameState = 'start';

  // Player turn function
  const playTurn = (square) => {
    let turnValid = GameBoard.selection(square, Players.getActivePlayer().symbol, gameState);
    if (turnValid == true) {
      DisplayController.render();
      Players.addPlayerSquare(square);
      if (Players.getActivePlayer().currentSquares.length >= 3) {
        checkForWin(Players.getActivePlayer().currentSquares);
      }
      checkForDraw();
      Players.switchPlayer();
      console.log(GameBoard.board);
    }
  }

  //Win conditions
  const winConditions = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];
  
  const checkForWin = (arr) => {
    let win = winConditions.some(condition => 
      condition.every((value) => arr.includes(value))
    );

    if (win == true) {
      // Winner
      console.log("congrats, you win");
    }
  }

  const checkForDraw = () => {
    if (GameBoard.board.every(square => square != '')) {
      // Draw
      console.log("draw");
    }
  }

  return { playTurn, checkForWin, checkForDraw }
})();

const DisplayController = (() => {
  const boardEl = document.querySelector('.board');

  const render = () => {
    while (boardEl.hasChildNodes()) {
      boardEl.removeChild(boardEl.firstChild);
    }
    GameBoard.board.forEach((square, index) => {
      let squareEl = document.createElement('button');
      squareEl.textContent = square;
      squareEl.classList.add('cell');
      squareEl.dataset.data_cell = index;
      if (square == 'X') {
        squareEl.classList.add('x');
      }
      else if (square == 'O') {
        squareEl.classList.add('o');
      }
      boardEl.appendChild(squareEl);
    });
  };
  render();

  const toggleActivePlayerClass = () => {
    boardEl.classList.contains('playerOne') ? boardEl.classList.remove('playerOne') : boardEl.classList.add('playerOne');
  }
  
  return { render, toggleActivePlayerClass };
})();

// const game = GameController();

// Todo:
// Add event listener to each square
// Add event listener to reset button
// Add player name forms
// Add player name display
// Add win/draw display
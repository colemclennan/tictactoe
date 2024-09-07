const GameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  // When a player makes a selection we need to update the board with their symbol if allowed.
  const selection = (square, symbol, gameState) => {
    if (gameState != 'finished' && board[square] == '') {
      board[square] = symbol;
      return true;
    }
    if (gameState != 'finished') {
      DisplayController.gameLogUpdate("Whoops! Can't go there!");
    }
    return false;
  }

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  }

  return { getBoard, selection, resetBoard }
})();

const Players = (() => {
  const player1 = {
    name: 'player1',
    symbol: 'X',
    currentSquares: [],
    score: 0,
  };

  const player2 = {
    name: 'player2',
    symbol: 'O',
    currentSquares: [],
    score: 0,
  };

  let activePlayer = player1;

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    DisplayController.toggleActivePlayerClass();
  }

  const addPlayerSquare = (square) => activePlayer.currentSquares.push(square);

  const getActivePlayer = () => activePlayer;

  const getPlayer = (player) => {
    if (player == 'player1') {
      return player1;
    }
    else if (player == 'player2') {
      return player2;
    }
  }

  const resetPlayers = () => {
    activePlayer = player1;
    player1.currentSquares = [];
    player2.currentSquares = [];
  }

  const playerForm = document.querySelector('#playerNames');
  const playerInfo = document.querySelector('.playerInfo');
  playerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    player1.name = e.target.player1.value || 'Player 1';
    player2.name = e.target.player2.value || 'Player 2';
    playerForm.reset();
    playerForm.classList.toggle('hide');
    DisplayController.renderPlayerNames();
    playerInfo.classList.toggle('show');
  });

  return { getActivePlayer, switchPlayer, addPlayerSquare, resetPlayers, getPlayer } 
})();

const GameController = (() => {
  // Set gameState variable ('start', 'active', 'finished')
  let gameState = 'start';
  const resetGameState = () => gameState = 'start';

  let ties = 0;
  const getTies = () => ties;

  // Player turn function
  const playTurn = (square) => {
    let turnValid = GameBoard.selection(square, Players.getActivePlayer().symbol, gameState);
    if (turnValid == true) {
      DisplayController.gameLogUpdate('');
      DisplayController.render();
      Players.addPlayerSquare(square);
      if (Players.getActivePlayer().currentSquares.length >= 3) {
        checkForWin(Players.getActivePlayer().currentSquares);
      }
      Players.switchPlayer();
      console.log(GameBoard.getBoard());
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
    let win = winConditions.some((condition) => {
      return condition.every((value) => arr.includes(value));
    });

    if (win == true) {
      // Winner
      DisplayController.gameLogUpdate(`Congratulations ${Players.getActivePlayer().name}, you win!!`);
      Players.getActivePlayer().score++;
      DisplayController.renderScoreUpdate();
      gameState = 'finished';
    }
    else if (win == false && GameBoard.getBoard().every(square => square != '')) {
      // Draw
      DisplayController.gameLogUpdate("The game was a draw.");
      ties++;
      DisplayController.renderScoreUpdate();
      gameState = 'finished';
    }
  }

  const resetGame = () => {
    GameBoard.resetBoard();
    Players.resetPlayers();
    resetGameState();
    DisplayController.resetGameDisplay();
  }

  return { playTurn, resetGame, getTies }
})();

const DisplayController = (() => {
  const boardEl = document.querySelector('.board');
  const boardLog = document.querySelector('.game-log');
  const playerInfo = document.querySelector('.playerInfo');
  const player1Name = playerInfo.querySelector('.player-one-name');
  const player2Name = playerInfo.querySelector('.player-two-name');
  const player1Score = playerInfo.querySelector('.player-one-score');
  const player2Score = playerInfo.querySelector('.player-two-score');
  const tiesScore = playerInfo.querySelector('.tie-score');

  const render = () => {
    while (boardEl.hasChildNodes()) {
      boardEl.removeChild(boardEl.firstChild);
    }
    GameBoard.getBoard().forEach((square, index) => {
      let squareEl = document.createElement('button');
      squareEl.textContent = square;
      squareEl.classList.add('cell');
      squareEl.dataset.cell = index;
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
    boardEl.classList.toggle('playerTwo');
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cell')) {
      GameController.playTurn(Number(e.target.dataset.cell));
    }
    if (e.target.classList.contains('reset')) {
      GameController.resetGame();
    }
  });

  const gameLogUpdate = (message) => {
    boardLog.textContent = '';
    boardLog.textContent = message;
  }

  const resetGameDisplay = () => {
    boardEl.classList.remove('playerTwo');
    gameLogUpdate('');
    render();
  }

  const renderPlayerNames = () => {
    player1Name.textContent = Players.getPlayer('player1').name;
    player2Name.textContent = Players.getPlayer('player2').name;
  }

  const renderScoreUpdate = () => {
    player1Score.textContent = Players.getPlayer('player1').score;
    player2Score.textContent = Players.getPlayer('player2').score
    tiesScore.textContent = GameController.getTies();
  }
  
  return { render, toggleActivePlayerClass, gameLogUpdate, resetGameDisplay, renderPlayerNames, renderScoreUpdate };
})();
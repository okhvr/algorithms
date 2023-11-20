import readline from 'readline'

// Create interface for reading from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const emptyCell = ' '
const tie = 'tie'
const playerX = 'X'
const playerO = 'O'
const score = {
  [tie]: 0,
  [playerX]: 1,
  [playerO]: -1
}

// Function to initialize the game board
function initializeBoard () {
  return [
    [emptyCell, emptyCell, emptyCell],
    [emptyCell, emptyCell, emptyCell],
    [emptyCell, emptyCell, emptyCell]
  ]
}

// Function identifying players
function identifyPlayers () {
  return new Promise((resolve) => {
    rl.question(`Do you want to be ${playerX}, or ${playerO}? \n`, (enteredValue) => {
      if (enteredValue === playerX) {
        resolve({ ai: playerO, opponent: playerX })
      } else if (enteredValue === playerO) {
        resolve({ ai: playerX, opponent: playerO })
      } else {
        console.log(`Invalid input. Please enter ${playerX}, or ${playerO}.`)
        resolve(identifyPlayers())
      }
    })
  })
}

// Function to find a winner or tie if it exist
function findWinnerOrTie (board) {
  for (let i = 0; i < 3; i++) {
    // Check rows
    if (stringEquals(board[i][0], board[i][1], board[i][2])) {
      return board[i][0]
    }
    // Check columns
    if (stringEquals(board[0][i], board[1][i], board[2][i])) {
      return board[0][i]
    }
  }

  // Check diagonals
  if (stringEquals(board[0][0], board[1][1], board[2][2])) {
    return board[0][0]
  }
  if (stringEquals(board[0][2], board[1][1], board[2][0])) {
    return board[0][2]
  }
  if (isBoardFull(board)) {
    return tie
  }

  return null
}

// Function to checks that all passed strings are equal and not empty
function stringEquals (...strings) {
  const first = strings[0]

  return !!first && first !== emptyCell && strings.every(str => str === first)
}

// Function to check if the board is full
function isBoardFull (board) {
  for (const row of board) {
    for (const cell of row) {
      if (cell === emptyCell) {
        return false
      }
    }
  }
  return true
}

// Function to display the current state of the board
function displayBoard (board) {
  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    console.log(' ' + (row).join(' | ') + ' ')
    if (i < board.length - 1) {
      console.log('-----------')
    }
  }
}

// Function to get a player's move
async function getPlayerMove (player) {
  const rowIndex = await getEnteredByUserIndex(player, 'row')
  const colIndex = await getEnteredByUserIndex(player, 'column')
  return { row: rowIndex, col: colIndex }
}

// Function to receive a valid index input from the player
function getEnteredByUserIndex (player, rowOrColumn) {
  return new Promise((resolve) => {
    rl.question(`Player ${player}, enter ${rowOrColumn} (1-3): `, (enteredValue) => {
      const index = parseInt(enteredValue) - 1
      if (isMoveIndexValid(index)) {
        resolve(index)
      } else {
        console.log(`Invalid input. Please enter valid ${rowOrColumn} number.`)
        resolve(getEnteredByUserIndex(player, rowOrColumn))
      }
    })
  })
}

// Function to validate teh index
function isMoveIndexValid (index) {
  return !isNaN(index) && index >= 0 && index < 3
}

// Function to determine the best move for the computer using the "Minimax" algorithm
function findBestMove (board, aiPlayer) {
  const isMaximizing = aiPlayer === playerX
  let bestScore = isMaximizing ? -Infinity : Infinity
  let bestMove
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === emptyCell) {
        board[i][j] = aiPlayer
        const opponent = aiPlayer === playerX ? playerO : playerX
        const score = minimax(board, !isMaximizing, opponent)
        board[i][j] = emptyCell
        if ((isMaximizing && score > bestScore) || (!isMaximizing && score < bestScore)) {
          bestScore = score
          bestMove = { row: i, col: j }
        }
      }
    }
  }
  return bestMove
}

// Function to determine the optimal move for the computer
function minimax (board, isMaximizing, player) {
  const winnerOrTie = findWinnerOrTie(board)
  if (winnerOrTie !== null) {
    return score[winnerOrTie]
  }
  const opponent = player === playerX ? playerO : playerX

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === emptyCell) {
          board[i][j] = player
          const score = minimax(board, false, opponent)
          board[i][j] = emptyCell
          bestScore = Math.max(score, bestScore)
        }
      }
    }
    return bestScore
  }
  let bestScore = Infinity
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === emptyCell) {
        board[i][j] = player
        const score = minimax(board, true, opponent)
        board[i][j] = emptyCell
        bestScore = Math.min(score, bestScore)
      }
    }
  }
  return bestScore
}

// Function to play the Tic-Tac-Toe game
async function playTicTacToeGame () {
  const board = initializeBoard()
  const { opponent, ai } = await identifyPlayers()
  let currentPlayer = playerX

  playTurn()

  // Function to check possible moves and make it
  function makeMove (move) {
    const { row, col } = move

    if (board[row][col] === emptyCell) {
      board[row][col] = currentPlayer

      const winnerOrTie = findWinnerOrTie(board)
      if (winnerOrTie) {
        displayBoard(board)
        console.log(winnerOrTie === tie
          ? 'It\'s a tie!'
          : `Player ${winnerOrTie} wins!`)
        rl.close()
      } else {
        currentPlayer = currentPlayer === playerX ? playerO : playerX
        playTurn()
      }
    } else {
      console.log('Cell already occupied. Choose a different one.')
      playTurn()
    }
  }

  // Function to play turn
  async function playTurn () {
    displayBoard(board)
    const move = currentPlayer === ai
      ? findBestMove(board, ai)
      : await getPlayerMove(opponent)
    makeMove(move)
  }
}

// Start the game
playTicTacToeGame()

const crypto = require('crypto')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function generateKey() {
  return crypto.randomBytes(32)
}

function createHMAC(key, move) {
  return crypto.createHmac('sha256', key).update(move).digest('hex')
}

function determineWinner(moves, playerMoveIndex, computerMoveIndex) {
  const numMoves = moves.length
  const half = Math.floor(numMoves / 2)
  if (playerMoveIndex === computerMoveIndex) {
    return 'Draw'
  } else if (
    (playerMoveIndex + half) % numMoves > computerMoveIndex &&
    (playerMoveIndex - half) % numMoves < computerMoveIndex
  ) {
    return 'Player wins'
  } else {
    return 'Computer wins'
  }
}

function printHelpTable(moves) {
  let helpTable =
    '    ' +
    moves.map((move, index) => `${index + 1}-${move}`).join('    ') +
    '\n'

  moves.forEach((move, i) => {
    let row = `${i + 1}-${move} `
    moves.forEach((_, j) => {
      if (i === j) {
        row += ' Draw  '
      } else {
        const result = determineWinner(moves, i, j)
        if (result === 'Player wins') {
          row += ' Win   '
        } else {
          row += ' Lose  '
        }
      }
    })
    helpTable += row + '\n'
  })

  console.log(helpTable)
}

function promptUserMove(moves, key, computerMoveIndex) {
  console.log('Available moves:')
  moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`)
  })
  console.log('0 - exit')
  console.log('? - help')

  rl.question('Enter your move: ', (answer) => {
    const playerMoveIndex = parseInt(answer) - 1

    if (answer === '0') {
      console.log('Exiting game.')
      rl.close()
    } else if (answer === '?') {
      printHelpTable(moves)
      promptUserMove(moves, key, computerMoveIndex)
    } else if (!moves[playerMoveIndex]) {
      console.log('Invalid move. Please try again.')
      promptUserMove(moves, key, computerMoveIndex)
    } else {
      console.log(`Your move: ${moves[playerMoveIndex]}`)
      console.log(`Computer move: ${moves[computerMoveIndex]}`)
      const result = determineWinner(moves, playerMoveIndex, computerMoveIndex)
      console.log(result)
      console.log(`HMAC key: ${key.toString('hex')}`)
      rl.close()
    }
  })
}

function playGame(moves) {
  if (moves.length % 2 === 0 || moves.length < 3) {
    console.error(
      'Invalid number of moves. There must be an odd number greater than 1.'
    )
    process.exit(1)
  }

  const key = generateKey()
  const computerMoveIndex = getRandomInt(0, moves.length)
  const computerMove = moves[computerMoveIndex]
  const hmac = createHMAC(key, computerMove)

  console.log('HMAC:', hmac)

  promptUserMove(moves, key, computerMoveIndex)
}

const moves = process.argv.slice(2)
playGame(moves)

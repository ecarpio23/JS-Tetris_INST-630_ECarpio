document.addEventListener('DOMContentLoaded',() => {
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay =document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
const width = 10
let nextRandom = 0
let timerId
let score = 0
const colors = [
    '#510121',
    '#FE86B6',
    '#FE4891',
    '#DE025E',
    '#A20244'
]

console.log(squares)

//The Tetrominoes
const lTetramino = [
[1, width+1, width*2+1, 2],
[width, width+1, width+2,width*2+2],
[1, width+1, width*2+1, width*2],
[width, width*2, width*2+1, width*2+2],
]

const zTetramino = [
    [width*2, width*2+1, width+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width*2+1, width+1, width+2],
    [0, width, width+1, width*2+1],
]

const tTetramino = [
    [width, 1, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width*2+1, width+2],
    [width, 1, width+1, width*2+1],
]

const oTetramino = [
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1],
]

const iTetramino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]
const theTetraminoes= [lTetramino, zTetramino, tTetramino, oTetramino, iTetramino]

let currentPosition = 4
let currentRotation = 0


//select tetromino randomly
let random = Math.floor(Math.random()*theTetraminoes.length)
let current= theTetraminoes[random][currentRotation]
 console.log(random)

//draw the tetramino
function draw() {
    current.forEach(spot => {
        squares[currentPosition + spot].classList.add('tetromino')
        squares[currentPosition + spot].style.backgroundColor = colors[random]
    })}
function undraw() {
    current.forEach(spot => {
        squares[currentPosition + spot].classList.remove('tetromino')
        squares[currentPosition + spot].style.backgroundColor = ''
    })
}
 
//make the tetromino move down every second
//timerId = setInterval(moveDown, 1000)

//assign functions to keyCodes
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
        &&(timerId)
    } else if (e.keyCode === 38) {
        rotate()
        &&(timerId)
    } else if (e.keyCode === 39) {
        moveRight()
        &&(timerId)
    } else if (e.keyCode === 40) {
        moveDown()
        &&(timerId)
    }
}
document.addEventListener('keyup', control)

//move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

//freeze function
function freeze() {
    if(current.some(spot => squares[currentPosition + spot + width].classList.contains('taken'))) {
        current.forEach(spot => squares[currentPosition + spot].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetraminoes.length)
        current = theTetraminoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

//move tetramino left
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(spot => (currentPosition + spot) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(spot => squares[currentPosition +spot].classList.contains('taken'))) {
        currentPosition =+1
    }
draw()
}

//move right
function moveRight() {
    undraw()
    const isAtRightEdge = current.some(spot => (currentPosition + spot) % width === width -1)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(spot=> squares[currentPosition + spot].classList.contains('taken')))
    currentPosition -=1
}
draw()


//rotate the tetromino
function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = theTetraminoes[random][currentRotation]
    draw()
    
}

//move down
function moveDown() {
    if(!current.some(spot => squares[currentPosition + spot + width].classList.contains('taken'))) {
          undraw()
          currentPosition += width
          draw()
        } else {
          freeze();  
        }
      }

//show up - next tetramino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displaySpot = 0

//tetrominos without rotations
const upNext = [
   [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
   [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
   [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
   [0, 1, displayWidth, displayWidth+1], //oTetromino
   [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]
//display shape in mini grid
function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNext[nextRandom].forEach( spot => {
        displaySquares[displaySpot + spot].classList.add('tetromino')
        displaySquares[displaySpot + spot].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetraminoes.length)
        displayShape()
    }
})

//add score
function addScore() {
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(spot => squares[spot].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(spot => {
                squares[spot].classList.remove('taken')
                squares[spot].classList.remove('tetromino')
                squares[spot].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//game over
function gameOver () {
    if(current.some(spot => squares[currentPosition + spot].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}



})


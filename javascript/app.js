// All constant
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
const gameBoard = document.querySelector(".board");
const score = document.getElementById("score");
const hiScore = document.getElementById("high-score")

// All Variables
let lastPrintTime = 0;
let speed = 6;
let snakeBody = [
    {
        x: 10,
        y: 12
    },
    // {
    //     x: 11,
    //     y: 7
    // },
    // {
    //     x: 12,
    //     y: 7
    // }
];

let inputDirection = {
    x: 0,
    y: 0
};
// For dont repeat their position
let lastInputDirection = inputDirection;
let food = {
    x: 6,
    y: 4
}
let count = 0;
let highScore = localStorage.getItem("score");
highScore = JSON.parse(highScore);
hiScore.innerHTML = highScore;

// Grand Parent Function
function game(currentTime) {
    window.requestAnimationFrame(game);

    let timeSeconds = (currentTime - lastPrintTime) / 1000
    if (timeSeconds < 1 / speed) return;
    lastPrintTime = currentTime;

    // Parent Function
    draw();
    update();
}

window.requestAnimationFrame(game)

// Parent Function
function draw() {
    gameBoard.innerHTML = "";
    makeSnake();
    moveSnake()
}

// Parent Function
function update() {
    makeFood();
    eatFood();
    if (gameOver(snakeBody)) {
        count = 0;
        score.innerHTML = count;
        musicSound.pause()
        gameOverSound.play()
        inputDirection = { x: 0, y: 0 };
        snakeBody = [
            {
                x: Math.ceil(Math.random() * 17),
                y: Math.ceil(Math.random() * 17)
            }
        ]
    }

}

// Child Function
function makeSnake() {
    snakeBody.forEach((segment, index, arr) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        if (index == 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }
        gameBoard.appendChild(snakeElement)
    })
}

// Child Function
function moveSnake() {
    // if i am incrementing the x it's moving but it's showing previous box also
    // snakeBody[0].x++
    inputDirection = getInputDirection();

    // it come to it's original position because it's direction is inputDirection is {x : 0, y: 0}
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

// Child Function
function getInputDirection() {

    window.addEventListener("keydown", event => {
        musicSound.play();
        inputDirection = { x: 0, y: -1 };
        switch (event.key) {
            case "ArrowUp":
                moveSound.play()
                if (lastInputDirection.y == 1) break
                inputDirection = { x: 0, y: -1 };
                break;

            case "ArrowDown":
                moveSound.play()
                if (lastInputDirection.y == -1) break
                inputDirection = { x: 0, y: 1 };
                break;

            case "ArrowLeft":
                moveSound.play()
                if (lastInputDirection.x == 1) break
                inputDirection = { x: -1, y: 0 };
                break;

            case "ArrowRight":
                moveSound.play()
                if (lastInputDirection.x == -1) break
                inputDirection = { x: 1, y: 0 };
                break;

            default: {
                inputDirection = { x: 0, y: -1 };
            }
        }
    })
    lastInputDirection = inputDirection
    return inputDirection;
}

// Child Function
function makeFood() {
    snakeBody.forEach((segment, index, arr) => {
        let foodElement = document.createElement("div");
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add("food")
        gameBoard.appendChild(foodElement);
    })
}

// Child Function
function eatFood() {
    if (snakeBody[0].x === food.x && snakeBody[0].y === food.y) {
        count++;
        score.innerHTML = count
        if (count > highScore) {
            localStorage.setItem("score", JSON.stringify(count));
            hiScore.innerHTML = count
        }
        foodSound.play()
        snakeBody.unshift({
            x: snakeBody[0].x + inputDirection.x,
            y: snakeBody[0].y + inputDirection.y
        })
        food = {
            x: Math.ceil(Math.random() * 17),
            y: Math.ceil(Math.random() * 17),
        }
    }
}

// Child Function
function gameOver(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeBody.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x > 18 || snake[0].x < 0 || snake[0].y > 18 || snake[0].y < 0) {
        return true;
    }

    return false;

}
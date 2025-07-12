const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game variables
const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

// Initialize high score display
highScoreElement.textContent = highScore;

// Generate random food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Draw snake
    ctx.fillStyle = '#2ecc71';
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Snake head - different color
            ctx.fillStyle = '#27ae60';
        } else {
            ctx.fillStyle = '#2ecc71';
        }
        ctx.fillRect(snake[i].x, snake[i].y, gridSize - 2, gridSize - 2);
    }
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

// Update game state
function update() {
    if (!gameRunning || gamePaused) return;
    
    // Move snake head
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    
    generateFood();
    gameOverElement.style.display = 'none';
    
    startBtn.textContent = 'Running...';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    gameLoop = setInterval(() => {
        update();
        draw();
    }, 150);
}

// Pause game
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    
    if (gamePaused) {
        clearInterval(gameLoop);
    } else {
        gameLoop = setInterval(() => {
            update();
            draw();
        }, 150);
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    
    generateFood();
    draw();
    gameOverElement.style.display = 'none';
    
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    pauseBtn.disabled = true;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) {
                direction = { x: 0, y: -gridSize };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) {
                direction = { x: 0, y: gridSize };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) {
                direction = { x: -gridSize, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) {
                direction = { x: gridSize, y: 0 };
            }
            break;
    }
});

// Button event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', () => {
    resetGame();
    startGame();
});

// Initialize game
generateFood();
draw();
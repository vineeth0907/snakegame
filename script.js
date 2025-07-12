class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameLoop = null;
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.init();
    }
    
    init() {
        this.loadHighScore();
        this.generateFood();
        this.setupEventListeners();
        this.draw();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            const key = e.key.toLowerCase();
            
            // Prevent reverse direction
            switch (key) {
                case 'arrowup':
                case 'w':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'arrowdown':
                case 's':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'arrowleft':
                case 'a':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'arrowright':
                case 'd':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case ' ':
                case 'p':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        
        // Button controls
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.gameLoop = setInterval(() => this.update(), 150);
        }
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            clearInterval(this.gameLoop);
            this.pauseBtn.textContent = 'Resume';
        } else {
            this.gameLoop = setInterval(() => this.update(), 150);
            this.pauseBtn.textContent = 'Pause';
        }
    }
    
    restartGame() {
        this.resetGame();
        this.startGame();
    }
    
    resetGame() {
        clearInterval(this.gameLoop);
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.scoreElement.textContent = '0';
        this.gameOverElement.style.display = 'none';
        this.generateFood();
        this.draw();
    }
    
    update() {
        if (this.gamePaused) return;
        
        this.moveSnake();
        
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        
        if (this.checkFoodCollision()) {
            this.eatFood();
        }
        
        this.draw();
    }
    
    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);
        this.snake.pop();
    }
    
    checkCollision() {
        const head = this.snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFoodCollision() {
        const head = this.snake[0];
        return head.x === this.food.x && head.y === this.food.y;
    }
    
    eatFood() {
        this.score += 10;
        this.scoreElement.textContent = this.score;
        
        // Grow snake
        this.snake.push({ ...this.snake[this.snake.length - 1] });
        
        // Generate new food
        this.generateFood();
        
        // Increase speed slightly
        if (this.score % 50 === 0) {
            clearInterval(this.gameLoop);
            const newSpeed = Math.max(100, 150 - Math.floor(this.score / 50) * 10);
            this.gameLoop = setInterval(() => this.update(), newSpeed);
        }
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.isOnSnake(this.food));
    }
    
    isOnSnake(position) {
        return this.snake.some(segment => segment.x === position.x && segment.y === position.y);
    }
    
    gameOver() {
        clearInterval(this.gameLoop);
        this.gameRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        
        // Update high score
        const highScore = parseInt(this.highScoreElement.textContent);
        if (this.score > highScore) {
            this.highScoreElement.textContent = this.score;
            this.saveHighScore(this.score);
        }
        
        // Show game over screen
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                
                // Eyes
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 5,
                    segment.y * this.gridSize + 5,
                    3, 3
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 12,
                    segment.y * this.gridSize + 5,
                    3, 3
                );
                
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 6,
                    segment.y * this.gridSize + 6,
                    1, 1
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 13,
                    segment.y * this.gridSize + 6,
                    1, 1
                );
            } else {
                // Snake body
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });
        
        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        
        // Food highlight
        this.ctx.fillStyle = '#c0392b';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2 - 2,
            this.food.y * this.gridSize + this.gridSize / 2 - 2,
            3,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
    
    saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }
    
    loadHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || '0';
        this.highScoreElement.textContent = highScore;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
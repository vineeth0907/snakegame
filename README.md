# 🐍 Snake Game

A modern, web-based implementation of the classic Snake game built with HTML5 Canvas, CSS3, and JavaScript.

## Features

- **Smooth gameplay** with responsive controls
- **Beautiful modern UI** with gradient backgrounds and animations
- **Score tracking** with persistent high score storage
- **Progressive difficulty** - game speeds up as you score more points
- **Keyboard controls** - Arrow keys or WASD
- **Game controls** - Start, Pause/Resume, and Restart functionality
- **Mobile responsive** design
- **Visual enhancements** - Grid lines, snake eyes, and food styling

## How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" or press any arrow key to begin
3. Use the following controls to move the snake:
   - **Arrow Keys** (↑↓←→) or **WASD** to change direction
   - **Spacebar** or **P** to pause/resume
4. Eat the red food to grow your snake and increase your score
5. Avoid hitting the walls or your own tail
6. Try to beat your high score!

## Running the Game

### Option 1: Direct Browser Access
Simply open the `index.html` file in any modern web browser.

### Option 2: Local Web Server
For the best experience, run a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Game Rules

- Each food item eaten adds 10 points to your score
- The snake grows by one segment each time it eats food
- The game speed increases every 50 points
- The game ends when the snake hits a wall or itself
- Your high score is automatically saved in your browser

## Technical Details

- **HTML5 Canvas** for game rendering
- **CSS3** with modern styling and responsive design
- **Vanilla JavaScript** with ES6+ features
- **LocalStorage** for high score persistence
- **Responsive design** that works on desktop and mobile

## Browser Compatibility

This game works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS3 Flexbox and Grid
- LocalStorage

Tested on Chrome, Firefox, Safari, and Edge.

## Files Structure

```
snake-game/
├── index.html      # Main HTML file
├── style.css       # CSS styling
├── script.js       # Game logic
└── README.md       # This file
```

Enjoy playing! 🎮
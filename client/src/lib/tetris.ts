// Piece types and their colors
export const TETROMINOS = {
  0: { shape: [[0]], color: "transparent" },
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: "#00FFFF" // cyan
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    color: "#0000FF" // blue
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    color: "#FF8800" // orange
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: "#FFFF00" // yellow
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: "#00FF00" // green
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: "#FF00FF" // purple
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: "#FF0000" // red
  }
};

// Generate a random tetromino
export const randomTetromino = () => {
  const tetrominos = "IJLOSTZ";
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// Create a stage (game grid)
export const createStage = (width = 10, height = 20) => 
  Array.from(Array(height), () => 
    Array(width).fill([0, "clear"])
  );

// Check if cell collides with any obstacle
export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.shape.length; y++) {
    for (let x = 0; x < player.tetromino.shape[y].length; x++) {
      // Check if we're on an actual Tetromino cell
      if (player.tetromino.shape[y][x] !== 0) {
        if (
          // Check if our move is inside the game area height (y)
          !stage[y + player.pos.y + moveY] ||
          // Check if our move is inside the game area width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // Check if the cell we're moving to isn't set to 'clear'
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// Scoring system
export const calculateScore = (lines, level) => {
  const linePoints = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 lines
  
  // If we have cleared lines
  if (lines > 0) {
    // Original Tetris score calculation
    return (level + 1) * linePoints[lines - 1];
  }
  
  return 0;
};

// Calculate level based on lines cleared
export const calculateLevel = (lines) => Math.floor(lines / 10) + 1;

// Calculate drop time based on level (game speed increases with level)
export const calculateDropTime = (level) => 1000 / (level + 1) + 200;

// Rotate a tetromino
export const rotate = (matrix, dir) => {
  // Make the rows become columns (transpose)
  const rotatedTetro = matrix.map((_, index) => 
    matrix.map(col => col[index])
  );
  
  // Reverse each row to get a rotated matrix
  if (dir > 0) return rotatedTetro.map(row => row.reverse());
  return rotatedTetro.reverse();
};

// Initial game state
export const initialGameState = {
  score: 0,
  rows: 0,
  level: 1,
  gameOver: false,
};

export const PIECE_COLORS = {
  I: "#00FFFF", // cyan
  J: "#0000FF", // blue
  L: "#FF8800", // orange
  O: "#FFFF00", // yellow
  S: "#00FF00", // green
  T: "#FF00FF", // purple
  Z: "#FF0000"  // red
};

// Key controls
export const KEY_CODES = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',   // rotate
  SPACE: ' ',      // hard drop
  P: 'p',          // pause
  ENTER: 'Enter',  // start/restart
};

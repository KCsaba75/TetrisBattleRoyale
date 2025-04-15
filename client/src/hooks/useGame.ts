import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "firebase/auth";
import { doc, setDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

import { 
  createStage, 
  checkCollision, 
  TETROMINOS,
  randomTetromino,
  rotate,
  calculateScore,
  calculateLevel,
  calculateDropTime,
  initialGameState
} from "../lib/tetris";

export const useGame = () => {
  const [stage, setStage] = useState(createStage());
  const [nextPiece, setNextPiece] = useState(null);
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
    color: 'transparent'
  });
  
  const [gameState, setGameState] = useState(initialGameState);
  const [dropTime, setDropTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [difficulty, setDifficulty] = useState('medium');
  
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();
  
  // Audio references for sound effects
  const moveSound = useRef(null);
  const clearSound = useRef(null);
  const gameOverSound = useRef(null);
  const dropSound = useRef(null);
  const rotateSound = useRef(null);
  
  // Initialize sound effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      moveSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
      clearSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3');
      gameOverSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3');
      dropSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
      rotateSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3');
      
      // Apply volume
      [moveSound, clearSound, gameOverSound, dropSound, rotateSound].forEach(sound => {
        if (sound.current) {
          sound.current.volume = volume / 100;
        }
      });
    }
  }, []);
  
  // Apply volume changes
  useEffect(() => {
    [moveSound, clearSound, gameOverSound, dropSound, rotateSound].forEach(sound => {
      if (sound.current) {
        sound.current.volume = volume / 100;
      }
    });
  }, [volume]);
  
  // Play sound utility
  const playSound = useCallback((sound) => {
    if (soundEnabled && sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }, [soundEnabled]);
  
  // Update stage function
  const updateStage = useCallback(prevStage => {
    // First clear the stage from previous render
    const newStage = prevStage.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    );

    // Draw the tetromino
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newStage[y + player.pos.y][x + player.pos.x] = [
            value,
            `${player.collided ? 'merged' : 'clear'}`,
            player.color
          ];
        }
      });
    });

    // Check if we have collided
    if (player.collided) {
      // Check if we need to reset player
      resetPlayer();
      // Check if we have completed rows
      return sweepRows(newStage);
    }

    return newStage;
  }, [player.tetromino, player.pos.y, player.pos.x, player.collided, player.color]);

  // Sweep completed rows
  const sweepRows = useCallback(newStage => {
    let clearedRows = 0;
    const stage = newStage.reduce((acc, row) => {
      // If we don't find a 0 it means the row is full and should be cleared
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        clearedRows += 1;
        // Add an empty row at the beginning
        acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);

    if (clearedRows > 0) {
      // Play clear sound
      playSound(clearSound);
      
      // Calculate score based on lines cleared and level
      const score = gameState.score + calculateScore(clearedRows, gameState.level);
      const rows = gameState.rows + clearedRows;
      const level = calculateLevel(rows);
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        score,
        rows,
        level,
      }));
      
      // Update drop time based on level
      setDropTime(calculateDropTime(level));
    }

    return stage;
  }, [gameState.score, gameState.rows, gameState.level, playSound]);

  // Reset player
  const resetPlayer = useCallback(() => {
    if (nextPiece) {
      // Use the next piece that was shown in the preview
      setPlayer({
        pos: { x: 3, y: 0 },
        tetromino: nextPiece.shape,
        collided: false,
        color: nextPiece.color
      });
      
      // Generate new next piece
      setNextPiece(randomTetromino());
    } else {
      // This happens on initial game load
      const piece = randomTetromino();
      setPlayer({
        pos: { x: 3, y: 0 },
        tetromino: piece.shape,
        collided: false,
        color: piece.color
      });
      
      // Generate next piece
      setNextPiece(randomTetromino());
    }
  }, [nextPiece]);

  // Move player horizontally
  const movePlayer = useCallback((dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, x: prev.pos.x + dir }
      }));
      playSound(moveSound);
    }
  }, [player, stage, playSound]);

  // Handle player rotation
  const rotatePlayer = useCallback(() => {
    // Clone the player to avoid direct state mutation
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    
    // Rotate the tetromino
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, 1);
    
    // Make sure rotation is valid (no collision)
    const posX = clonedPlayer.pos.x;
    let offset = 1;
    
    // Check if rotation causes collision, try to adjust position
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      // Try to move left or right to make space for rotation
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      
      // If offset gets too large, rotation is not possible
      if (offset > clonedPlayer.tetromino[0].length) {
        // Undo rotation
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, -1);
        clonedPlayer.pos.x = posX;
        return;
      }
    }
    
    // Apply the rotation
    setPlayer(clonedPlayer);
    playSound(rotateSound);
  }, [player, stage, playSound]);

  // Drop player by one row
  const drop = useCallback(() => {
    // Increase level when rows are cleared
    if (gameState.rows > (gameState.level - 1) * 10) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1
      }));
      // Also increase speed
      setDropTime(calculateDropTime(gameState.level + 1));
    }
    
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, y: prev.pos.y + 1 }
      }));
    } else {
      // Game over if collision happens at top
      if (player.pos.y < 1) {
        setGameState(prev => ({
          ...prev,
          gameOver: true
        }));
        setDropTime(null);
        playSound(gameOverSound);
        
        // Save score to database
        saveScore();
        
        toast({
          title: "Game Over!",
          description: `Your score: ${gameState.score}`,
        });
        return;
      }
      
      // Merge the tetromino with the stage
      setPlayer(prev => ({
        ...prev,
        collided: true
      }));
      
      playSound(dropSound);
    }
  }, [player, stage, gameState.rows, gameState.level, gameState.score, playSound, toast]);

  // Save score to the database
  const saveScore = useCallback(async () => {
    const user = auth.currentUser;
    if (user && gameState.score > 0) {
      try {
        const scoreRef = doc(collection(db, "scores"));
        await setDoc(scoreRef, {
          userId: user.uid,
          username: user.displayName,
          score: gameState.score,
          level: gameState.level,
          lines: gameState.rows,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  }, [auth, db, gameState.score, gameState.level, gameState.rows]);

  // Start the game
  const startGame = useCallback(() => {
    // Reset everything
    setStage(createStage());
    setGameState(initialGameState);
    
    // Set initial drop time based on difficulty
    let initialSpeed;
    switch(difficulty) {
      case 'easy':
        initialSpeed = 1000;
        break;
      case 'hard':
        initialSpeed = 500;
        break;
      default: // medium
        initialSpeed = 750;
    }
    setDropTime(initialSpeed);
    
    resetPlayer();
    setGameStarted(true);
    setGamePaused(false);
  }, [difficulty, resetPlayer]);

  // Pause/resume the game
  const pauseGame = useCallback(() => {
    if (!gameState.gameOver && gameStarted) {
      if (gamePaused) {
        // Resume game
        setDropTime(calculateDropTime(gameState.level));
      } else {
        // Pause game
        setDropTime(null);
      }
      setGamePaused(!gamePaused);
    }
  }, [gameState.gameOver, gameState.level, gameStarted, gamePaused]);

  // Hard drop - move piece all the way down
  const hardDrop = useCallback(() => {
    let newY = player.pos.y;
    while (!checkCollision(player, stage, { x: 0, y: 1 })) {
      newY++;
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, y: newY }
      }));
    }
    
    // Once we hit bottom, force a collision
    setPlayer(prev => ({
      ...prev,
      pos: { ...prev.pos, y: newY },
      collided: true
    }));
    
    playSound(dropSound);
  }, [player, stage, playSound]);

  // Move down on keydown
  const dropPlayer = useCallback(() => {
    if (!gamePaused && !gameState.gameOver) {
      setDropTime(null);
      drop();
    }
  }, [gamePaused, gameState.gameOver, drop]);

  // Handle key presses
  const handleKeyDown = useCallback(({ keyCode, key }) => {
    if (!gameState.gameOver && gameStarted && !gamePaused) {
      // Left arrow
      if (keyCode === 37 || key === 'ArrowLeft') {
        movePlayer(-1);
      }
      // Right arrow
      else if (keyCode === 39 || key === 'ArrowRight') {
        movePlayer(1);
      }
      // Down arrow
      else if (keyCode === 40 || key === 'ArrowDown') {
        dropPlayer();
      }
      // Up arrow - rotate
      else if (keyCode === 38 || key === 'ArrowUp') {
        rotatePlayer();
      }
      // Space - hard drop
      else if (keyCode === 32 || key === ' ') {
        hardDrop();
      }
    }
    
    // P key - pause
    if ((keyCode === 80 || key === 'p') && gameStarted) {
      pauseGame();
    }
    
    // Enter - start/restart
    if ((keyCode === 13 || key === 'Enter') && (!gameStarted || gameState.gameOver)) {
      startGame();
    }
  }, [gameState.gameOver, gameStarted, gamePaused, movePlayer, dropPlayer, rotatePlayer, hardDrop, pauseGame, startGame]);
  
  // Move down automatically based on dropTime
  useEffect(() => {
    if (dropTime !== null && gameStarted && !gamePaused) {
      const timer = setInterval(() => {
        drop();
      }, dropTime);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [drop, dropTime, gameStarted, gamePaused]);
  
  // Update game state and handle keyboard controls
  useEffect(() => {
    if (gameStarted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [gameStarted, handleKeyDown]);
  
  // Update the stage after player moves
  useEffect(() => {
    if (gameStarted) {
      setStage(prev => updateStage(prev));
    }
  }, [player, updateStage, gameStarted]);
  
  // Restart drop time after moving down manually
  const keyUp = useCallback(({ keyCode, key }) => {
    if (!gameState.gameOver && gameStarted && !gamePaused) {
      if (keyCode === 40 || key === 'ArrowDown') {
        setDropTime(calculateDropTime(gameState.level));
      }
    }
  }, [gameState.gameOver, gameStarted, gamePaused, gameState.level]);
  
  // Add keyup listener for drop time reset
  useEffect(() => {
    if (gameStarted) {
      window.addEventListener('keyup', keyUp);
      return () => {
        window.removeEventListener('keyup', keyUp);
      };
    }
  }, [gameStarted, keyUp]);
  
  return {
    stage,
    nextPiece,
    gameState,
    player,
    gameStarted,
    gamePaused,
    soundEnabled,
    volume,
    difficulty,
    movePlayer,
    dropPlayer,
    rotatePlayer,
    hardDrop,
    startGame,
    pauseGame,
    setSoundEnabled,
    setVolume,
    setDifficulty
  };
};

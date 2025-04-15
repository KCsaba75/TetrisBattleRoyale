import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TETROMINOS } from "@/lib/tetris";

// Játéktábla celláját reprezentáló típus (tömb formátumban)
// [0]: érték (0 = üres, >0 = tetromino)
// [1]: státusz (pl. "clear", "merged", stb.)
// [2]: szín (CSS színkód)
type Cell = [number, string, string];

interface TetrisBoardProps {
  stage: Cell[][];
  gameOver: boolean;
  score: number;
  onRestart: () => void;
  paused: boolean;
}

const TetrisBoard = ({ stage, gameOver, score, onRestart, paused }: TetrisBoardProps) => {
  const [showGameOver, setShowGameOver] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(30);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and adjust cell size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (boardRef.current) {
        // On mobile, calculate max width based on viewport
        // Subtract some padding to ensure it fits within the screen
        const viewportWidth = window.innerWidth;
        const maxWidth = mobile ? viewportWidth - 32 : boardRef.current.clientWidth;
        
        // Calculate cell size - 10 columns in the game
        const maxCellSize = Math.floor(maxWidth / 10);
        
        // On mobile, make cells slightly smaller for better fit
        const idealCellSize = mobile ? Math.min(28, maxCellSize) : Math.min(30, maxCellSize);
        setCellSize(idealCellSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show game over dialog when game is over
  useEffect(() => {
    if (gameOver) {
      setShowGameOver(true);
    } else {
      setShowGameOver(false);
    }
  }, [gameOver]);

  return (
    <div className="relative mx-auto" ref={boardRef}>
      <div className="flex justify-center">
        <div 
          className={`bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800 ${paused ? 'opacity-70' : ''}`}
        >
          <div 
            className="grid grid-cols-10 grid-rows-20 gap-0 border border-gray-700"
            style={{
              width: `${cellSize * 10}px`,
              height: `${cellSize * 20}px`
            }}
          >
            {stage.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="border border-black/20"
                  style={{ 
                    width: `${cellSize}px`, 
                    height: `${cellSize}px`,
                    backgroundColor: cell[0] !== 0 ? cell[2] : 'rgba(0,0,0,0.2)',
                    transition: 'background-color 0.1s',
                    boxShadow: cell[0] !== 0 ? 'inset 0 0 5px rgba(255, 255, 255, 0.5)' : 'none'
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {paused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 px-8 py-4 md:px-10 md:py-5 rounded-lg backdrop-blur-md text-center">
            <h2 className="text-xl md:text-2xl font-['Orbitron'] text-cyan-400 mb-2">PAUSED</h2>
          </div>
        </div>
      )}

      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent className="bg-black/90 border-cyan-500/30 text-white max-w-xs md:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-['Orbitron'] text-cyan-400 text-center mb-2 md:mb-4">GAME OVER</DialogTitle>
            <DialogDescription className="text-lg md:text-xl text-center">
              Your Score: <span className="font-bold text-white">{score}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button 
              onClick={onRestart}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3"
            >
              PLAY AGAIN
            </Button>
            
            <p className="text-xs text-center text-gray-400 mt-2">
              {isMobile ? "Tip: Rotate your device to landscape for a better experience" : "Tip: Use arrow keys to move, up arrow to rotate, space to hard drop"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TetrisBoard;

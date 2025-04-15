import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TETROMINOS } from "@/lib/tetris";

interface Cell {
  value: number;
  status: string;
  color: string;
}

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

  // Adjust cell size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (boardRef.current) {
        const width = boardRef.current.clientWidth;
        const maxCellSize = Math.floor(width / 10); // 10 is the game width
        setCellSize(Math.min(30, maxCellSize)); // Cap at 30px
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
    <div className="relative" ref={boardRef}>
      <div className="flex justify-center">
        <div 
          className={`bg-black/50 backdrop-blur-sm p-2 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800 ${paused ? 'opacity-70' : ''}`}
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
                    backgroundColor: cell[0] !== 0 ? cell[2] : 'transparent',
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
          <div className="bg-black/80 px-10 py-5 rounded-lg backdrop-blur-md text-center">
            <h2 className="text-2xl font-orbitron text-cyan-400 mb-2">PAUSED</h2>
          </div>
        </div>
      )}

      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent className="bg-black/90 border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-orbitron text-cyan-400 text-center mb-4">GAME OVER</DialogTitle>
            <DialogDescription className="text-xl text-center">
              Your Score: <span className="font-bold text-white">{score}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={onRestart}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3"
            >
              PLAY AGAIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TetrisBoard;

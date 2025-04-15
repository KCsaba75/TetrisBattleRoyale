import { TETROMINOS } from "../lib/tetris";

interface NextPieceProps {
  tetromino: any;
}

const NextPiece = ({ tetromino }: NextPieceProps) => {
  const grid = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // Place the tetromino shape in the center of the grid
  if (tetromino) {
    const shape = tetromino.shape;
    const color = tetromino.color;
    const offsetY = Math.floor((4 - shape.length) / 2);
    const offsetX = Math.floor((4 - shape[0].length) / 2);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const gridY = y + offsetY;
          const gridX = x + offsetX;
          if (gridY >= 0 && gridY < 4 && gridX >= 0 && gridX < 4) {
            grid[gridY][gridX] = 1;
          }
        }
      }
    }
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 grid-rows-4 gap-1">
        {grid.map((row, y) => 
          row.map((cell, x) => (
            <div 
              key={`${y}-${x}`} 
              className="w-5 h-5 sm:w-6 sm:h-6 border border-gray-800"
              style={{ 
                backgroundColor: cell ? tetromino.color : 'transparent',
                boxShadow: cell ? 'inset 0 0 3px rgba(255, 255, 255, 0.5)' : 'none'
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;

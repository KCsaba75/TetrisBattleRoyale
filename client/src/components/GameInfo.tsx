import { Card, CardContent } from "@/components/ui/card";

interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  highScore: number;
}

const GameInfo = ({ score, level, lines, highScore }: GameInfoProps) => {
  return (
    <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
      <CardContent className="p-4">
        <h2 className="text-lg font-['Orbitron'] text-cyan-400 mb-4">GAME INFO</h2>
        
        <div className="mb-4">
          <p className="text-gray-400 mb-1">Score:</p>
          <p className="text-2xl font-bold text-white">{score}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 mb-1">Level:</p>
          <p className="text-xl font-bold text-white">{level}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 mb-1">Lines Cleared:</p>
          <p className="text-xl font-bold text-white">{lines}</p>
        </div>
        
        <div>
          <p className="text-gray-400 mb-2">High Score:</p>
          <p className="text-xl font-bold text-white">{highScore}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInfo;

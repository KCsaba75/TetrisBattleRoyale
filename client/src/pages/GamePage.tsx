import { useEffect, useState } from "react";
import TetrisBoard from "@/components/TetrisBoard";
import GameControls from "@/components/GameControls";
import NextPiece from "@/components/NextPiece";
import GameInfo from "@/components/GameInfo";
import GameSettings from "@/components/GameSettings";
import NavBar from "@/components/NavBar";
import { useGame } from "@/hooks/useGame";
import { getFirestore, doc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Card, CardContent } from "@/components/ui/card";

export default function GamePage() {
  const { 
    stage, 
    nextPiece, 
    gameState, 
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
  } = useGame();
  
  const [highScore, setHighScore] = useState(0);
  const db = getFirestore();
  const auth = getAuth();
  
  // Get user's high score from Firestore
  useEffect(() => {
    async function fetchHighScore() {
      if (auth.currentUser) {
        try {
          try {
            const scoresRef = collection(db, "scores");
            const q = query(
              scoresRef, 
              where("userId", "==", auth.currentUser.uid),
              orderBy("score", "desc"),
              limit(1)
            );
            
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              setHighScore(querySnapshot.docs[0].data().score);
            }
          } catch (firestoreError) {
            console.log("User scores might not exist yet:", firestoreError);
            // Inicializáljuk 0-val, mivel még nincs korábbi pontszám
          }
        } catch (error) {
          console.error("Error fetching high score:", error);
        }
      }
    }
    
    fetchHighScore();
  }, [auth.currentUser, db, gameState.gameOver]);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 bg-fixed">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        {/* Purple glow */}
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative">
        <NavBar />
        
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6">
          {/* Game Info Panel */}
          <div className="w-full lg:w-64 order-2 lg:order-1">
            <GameInfo 
              score={gameState.score} 
              level={gameState.level} 
              lines={gameState.rows}
              highScore={Math.max(highScore, gameState.score)}
            />
            
            <div className="mt-6">
              <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
                <CardContent className="p-4">
                  <h2 className="text-lg font-['Orbitron'] text-cyan-400 mb-4">NEXT PIECE</h2>
                  <NextPiece tetromino={nextPiece} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Game Board */}
          <div className="order-1 lg:order-2">
            <TetrisBoard 
              stage={stage} 
              gameOver={gameState.gameOver}
              score={gameState.score}
              onRestart={startGame}
              paused={gamePaused}
            />
            
            <GameControls 
              onStart={startGame}
              onPause={pauseGame}
              onRestart={startGame}
              onRotate={rotatePlayer}
              onMoveLeft={() => movePlayer(-1)}
              onMoveRight={() => movePlayer(1)}
              onMoveDown={dropPlayer}
              onHardDrop={hardDrop}
              isStarted={gameStarted}
              isPaused={gamePaused}
              isGameOver={gameState.gameOver}
            />
          </div>
          
          {/* Settings Panel */}
          <div className="w-full lg:w-64 order-3">
            <GameSettings 
              volume={volume}
              soundEnabled={soundEnabled}
              difficulty={difficulty}
              onVolumeChange={setVolume}
              onSoundToggle={setSoundEnabled}
              onDifficultyChange={setDifficulty}
            />
            
            <div className="mt-6">
              <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
                <CardContent className="p-4">
                  <h2 className="text-lg font-['Orbitron'] text-cyan-400 mb-4">PIECES</h2>
                  
                  <div className="grid grid-cols-7 gap-1">
                    <div className="w-4 h-4 bg-cyan-400" title="I Piece"></div>
                    <div className="w-4 h-4 bg-cyan-400" title="I Piece"></div>
                    <div className="w-4 h-4 bg-cyan-400" title="I Piece"></div>
                    <div className="w-4 h-4 bg-cyan-400" title="I Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-blue-600" title="J Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-blue-600" title="J Piece"></div>
                    <div className="w-4 h-4 bg-blue-600" title="J Piece"></div>
                    <div className="w-4 h-4 bg-blue-600" title="J Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-orange-500" title="L Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-orange-500" title="L Piece"></div>
                    <div className="w-4 h-4 bg-orange-500" title="L Piece"></div>
                    <div className="w-4 h-4 bg-orange-500" title="L Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-yellow-400" title="O Piece"></div>
                    <div className="w-4 h-4 bg-yellow-400" title="O Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-yellow-400" title="O Piece"></div>
                    <div className="w-4 h-4 bg-yellow-400" title="O Piece"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                    <div className="w-4 h-4 bg-transparent"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

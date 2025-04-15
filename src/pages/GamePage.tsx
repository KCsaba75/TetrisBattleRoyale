import { useEffect, useState } from "react";
import TetrisBoard from "@/components/TetrisBoard";
import GameControls from "@/components/GameControls";
import NextPiece from "@/components/NextPiece";
import GameInfo from "@/components/GameInfo";
import GameSettings from "@/components/GameSettings";
import NavBar from "@/components/NavBar";
import { useGame } from "@/hooks/useGame";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
  }, [gameState.gameOver]);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 bg-fixed">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        {/* Purple glow */}
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 relative">
        <NavBar />
        
        {/* Mobile Next Piece + Info Display - only visible on mobile */}
        <div className="flex justify-between items-center mb-2 md:hidden">
          <Card className="bg-black/60 backdrop-blur-sm border-cyan-500/30 w-1/2 mr-1">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-['Orbitron'] text-cyan-400">NEXT</h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">HIGH</span>
                  <span className="text-sm font-bold text-purple-400">{Math.max(highScore, gameState.score)}</span>
                </div>
              </div>
              <NextPiece tetromino={nextPiece} />
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 backdrop-blur-sm border-cyan-500/30 w-1/2 ml-1">
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">SCORE</span>
                  <span className="text-base font-bold text-cyan-400">{gameState.score}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">LEVEL</span>
                  <span className="text-base font-bold text-cyan-400">{gameState.level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">LINES</span>
                  <span className="text-base font-bold text-cyan-400">{gameState.rows}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">MODE</span>
                  <span className="text-base font-bold text-cyan-400 capitalize">{difficulty}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-3 lg:gap-6">
          {/* Game Info Panel - hidden on mobile, shown on desktop */}
          <div className="hidden md:block w-full lg:w-64 order-2 lg:order-1">
            <GameInfo 
              score={gameState.score} 
              level={gameState.level} 
              lines={gameState.rows}
              highScore={Math.max(highScore, gameState.score)}
            />
            
            <div className="mt-4 lg:mt-6">
              <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
                <CardContent className="p-4">
                  <h2 className="text-lg font-['Orbitron'] text-cyan-400 mb-4">NEXT PIECE</h2>
                  <NextPiece tetromino={nextPiece} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Game Board - centered and slightly smaller on mobile */}
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
          
          {/* Settings Panel - hidden on mobile, shown on desktop */}
          <div className="hidden md:block w-full lg:w-64 order-3">
            <GameSettings 
              volume={volume}
              soundEnabled={soundEnabled}
              difficulty={difficulty}
              onVolumeChange={setVolume}
              onSoundToggle={setSoundEnabled}
              onDifficultyChange={setDifficulty}
            />
            
            <div className="mt-4 lg:mt-6">
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
        
        {/* Mobile Settings Bar - Simplified settings for mobile */}
        <div className="md:hidden w-full mt-2">
          <Card className="bg-black/60 backdrop-blur-sm border-cyan-500/30">
            <CardContent className="p-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">SOUND</span>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${soundEnabled ? 'bg-cyan-500/70' : 'bg-gray-700/70'}`}
                  >
                    {soundEnabled ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">DIFFICULTY</span>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-gray-800/80 rounded px-2 py-1 text-sm text-white border-none outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

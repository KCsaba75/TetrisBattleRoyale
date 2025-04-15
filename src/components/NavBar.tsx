import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getAuth } from "firebase/auth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface NavBarProps {
  showLeaderboardButton?: boolean;
  showGameButton?: boolean;
}

export default function NavBar({ showLeaderboardButton = true, showGameButton = false }: NavBarProps) {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const auth = getAuth();
  const [displayName, setDisplayName] = useState("");
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || user.email || "Player");
    }
  }, [auth]);
  
  const navigateToLeaderboard = () => {
    setLocation("/leaderboard");
  };
  
  const navigateToGame = () => {
    setLocation("/game");
  };
  
  return (
    <header className="flex flex-wrap justify-between items-center mb-6">
      <div className="flex items-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-['Orbitron'] text-cyan-400 mr-4">TETRIS</h1>
        <div className="hidden sm:block bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <span className="text-gray-400 mr-2">Player:</span>
          <span className="text-white font-medium">{displayName}</span>
        </div>
      </div>
      
      <nav className="flex space-x-4">
        {showLeaderboardButton && (
          <Button 
            variant="outline"
            className="border-cyan-500/50 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm flex items-center"
            onClick={navigateToLeaderboard}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="hidden sm:inline">Leaderboard</span>
          </Button>
        )}
        
        {showGameButton && (
          <Button 
            variant="outline"
            className="border-cyan-500/50 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm flex items-center"
            onClick={navigateToGame}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Game</span>
          </Button>
        )}
        
        <Button 
          variant="outline"
          className="border-cyan-500/50 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm flex items-center"
          onClick={logout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </nav>
    </header>
  );
}

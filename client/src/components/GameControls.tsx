import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface GameControlsProps {
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
  onRotate: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onHardDrop: () => void;
  isStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

const GameControls = ({
  onStart,
  onPause,
  onRestart,
  onRotate,
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onHardDrop,
  isStarted,
  isPaused,
  isGameOver
}: GameControlsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle touch events for continuous movement while touching
  const createTouchHandler = (action: () => void) => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const handleTouchStart = () => {
      if (intervalId) clearInterval(intervalId);
      action(); // Immediate action
      intervalId = setInterval(action, 150); // Repeat action every 150ms
    };

    const handleTouchEnd = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    };
  };

  return (
    <div className="flex flex-col items-center mt-4 md:mt-6 space-y-4">
      {/* Game control buttons - adapt for mobile */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        <Button
          id="btn-start"
          className={`bg-cyan-500 hover:bg-cyan-600 text-black 
                     px-4 py-3 md:px-6 md:py-5 rounded-lg font-bold 
                     font-['Orbitron'] transition-all 
                     hover:shadow-[0_0_15px_rgba(0,255,255,0.7)]
                     text-sm md:text-base`}
          onClick={onStart}
          disabled={isStarted && !isGameOver}
        >
          {isGameOver ? 'RESTART' : 'START'}
        </Button>

        <Button
          id="btn-pause"
          className={`${isPaused ? 'bg-fuchsia-500 hover:bg-fuchsia-600' : 'bg-gray-800 hover:bg-gray-700'} 
                     text-white px-4 py-3 md:px-6 md:py-5 rounded-lg font-bold 
                     font-['Orbitron'] transition-all
                     text-sm md:text-base`}
          onClick={onPause}
          disabled={!isStarted || isGameOver}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </Button>

        <Button
          id="btn-restart"
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-black 
                   px-4 py-3 md:px-6 md:py-5 rounded-lg font-bold 
                   font-['Orbitron'] transition-all 
                   hover:shadow-[0_0_15px_rgba(255,0,255,0.7)]
                   text-sm md:text-base"
          onClick={onRestart}
          disabled={!isStarted}
        >
          RESTART
        </Button>
      </div>

      {/* Mobile touch controls */}
      <div className="md:hidden flex flex-col items-center mt-2 w-full max-w-xs">
        <div className="grid grid-cols-3 gap-3 w-full">
          <div></div>
          <Button
            className="bg-gray-800/80 p-2 rounded-lg flex justify-center items-center h-14 w-full active:bg-gray-700/80 backdrop-blur-sm shadow-lg shadow-black/20"
            {...createTouchHandler(onRotate)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Button>
          <div></div>

          <Button
            className="bg-gray-800/80 p-2 rounded-lg flex justify-center items-center h-14 w-full active:bg-gray-700/80 backdrop-blur-sm shadow-lg shadow-black/20"
            {...createTouchHandler(onMoveLeft)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>

          <Button
            className="bg-gray-800/80 p-2 rounded-lg flex justify-center items-center h-14 w-full active:bg-gray-700/80 backdrop-blur-sm shadow-lg shadow-black/20"
            {...createTouchHandler(onMoveDown)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Button>

          <Button
            className="bg-gray-800/80 p-2 rounded-lg flex justify-center items-center h-14 w-full active:bg-gray-700/80 backdrop-blur-sm shadow-lg shadow-black/20"
            {...createTouchHandler(onMoveRight)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>

        <Button
          className="bg-fuchsia-500/80 p-2 rounded-lg mt-3 w-full flex justify-center items-center h-12 active:bg-fuchsia-600/80 backdrop-blur-sm shadow-lg shadow-black/20"
          onTouchStart={onHardDrop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" transform="translate(0, 6)" />
          </svg>
          <span className="font-bold">HARD DROP</span>
        </Button>
      </div>

      {/* Keyboard controls info - hide on mobile */}
      <div className="hidden md:block text-sm text-gray-400 mt-2">
        <p className="text-center mb-1">Keyboard Controls:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-gray-800/60 backdrop-blur-sm px-2 py-1 rounded">←→: Move</span>
          <span className="bg-gray-800/60 backdrop-blur-sm px-2 py-1 rounded">↑: Rotate</span>
          <span className="bg-gray-800/60 backdrop-blur-sm px-2 py-1 rounded">↓: Soft Drop</span>
          <span className="bg-gray-800/60 backdrop-blur-sm px-2 py-1 rounded">Space: Hard Drop</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;

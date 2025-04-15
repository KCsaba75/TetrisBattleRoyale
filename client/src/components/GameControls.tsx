import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <div className="flex space-x-4">
        <Button
          id="btn-start"
          className={`bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-5 rounded-lg font-bold font-['Orbitron'] transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.7)]`}
          onClick={onStart}
          disabled={isStarted && !isGameOver}
        >
          {isGameOver ? 'RESTART' : 'START'}
        </Button>

        <Button
          id="btn-pause"
          className={`${isPaused ? 'bg-fuchsia-500 hover:bg-fuchsia-600' : 'bg-gray-800 hover:bg-gray-700'} text-white px-6 py-5 rounded-lg font-bold font-['Orbitron'] transition-all`}
          onClick={onPause}
          disabled={!isStarted || isGameOver}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </Button>

        <Button
          id="btn-restart"
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-black px-6 py-5 rounded-lg font-bold font-['Orbitron'] transition-all hover:shadow-[0_0_15px_rgba(255,0,255,0.7)]"
          onClick={onRestart}
          disabled={!isStarted}
        >
          RESTART
        </Button>
      </div>

      {/* Mobile controls */}
      <div className="md:hidden flex flex-col items-center mt-4">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button
            className="bg-gray-800 p-4 rounded-lg flex justify-center items-center h-14"
            onTouchStart={onRotate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Button>
          <div></div>

          <Button
            className="bg-gray-800 p-4 rounded-lg flex justify-center items-center h-14"
            onTouchStart={onMoveLeft}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>

          <Button
            className="bg-gray-800 p-4 rounded-lg flex justify-center items-center h-14"
            onTouchStart={onMoveDown}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Button>

          <Button
            className="bg-gray-800 p-4 rounded-lg flex justify-center items-center h-14"
            onTouchStart={onMoveRight}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>

        <Button
          className="bg-gray-800 p-4 rounded-lg mt-2 w-full flex justify-center items-center"
          onTouchStart={onHardDrop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" transform="translate(0, 6)" />
          </svg>
          <span>HARD DROP</span>
        </Button>
      </div>

      {/* Keyboard controls info */}
      <div className="hidden md:block text-sm text-gray-400 mt-4">
        <p className="text-center mb-2">Keyboard Controls:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-gray-800 px-2 py-1 rounded">←→: Move</span>
          <span className="bg-gray-800 px-2 py-1 rounded">↑: Rotate</span>
          <span className="bg-gray-800 px-2 py-1 rounded">↓: Soft Drop</span>
          <span className="bg-gray-800 px-2 py-1 rounded">Space: Hard Drop</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;

'use client'
import { useCallback } from 'react';
const MainMenu = ({ onStartGame, onPause, onResume, onShowTopScores, onQuit, onShowAbout, gameState }) => {

  const handlePauseClick = useCallback(() => {
    onPause();
    const TE = (window as any).TE;
    if (TE && typeof TE.offerWall === 'function') {
      TE.offerWall();  // show offer wall on a button click
    } else {
      console.error('TE is not defined or offerWall is not a function');
    }
  }, [onPause]);
    
  return (
  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
    {gameState === 'menu' && <button onClick={onStartGame}>Start New Game</button>}
    {gameState === 'playing' && <button onClick={handlePauseClick}>Pause</button>}
    {gameState === 'paused' && <button onClick={onResume}>Resume</button>}
    <button className="ml-2" onClick={onShowTopScores}>Top Scores</button>
    <button className="ml-2"onClick={onShowAbout}>About</button>
    <button className="ml-2" onClick={onQuit}>Quit</button>
  </div>);
}
export default MainMenu
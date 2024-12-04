'use client';
import { useState, useEffect, useCallback } from 'react';
import AboutModal from './AboutModal';
import ScorePanel from './ScorePanel'
import MainMenu from './MainMenu';
import GameTitle from './GameTitle';
import GameObject from './GameObject';


function getTelegramUserId() {
  try {
    const telegram = (window as any).Telegram;
    return telegram?.WebApp?.initDataUnsafe?.user.id;
  } catch (error) {
    console.log("🚀 ~ getTelegramUserId ~ error:", error)
    return 1000000000;
  }
}


const Game = ({ config }) => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('menu');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [environment, setEnvironment] = useState('prod');
  const [clickVerified, setClickVerified] = useState(false);
  const [isTMA, setIsTMA] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const env = urlParams.get('env') || 'prod';
    const userRole: string = urlParams.get('role') || '';
    setEnvironment(env);
    setRole(userRole);
  
    // Improved TMA detection
    const detectTMA = () => {
      const telegram = (window as any).Telegram;
      if (telegram && telegram.WebApp) {
        // Additional checks to ensure it's a real Telegram WebApp
        if (typeof telegram.WebApp.initData === 'string' && 
            telegram.WebApp.initData.length > 0 &&
            typeof telegram.WebApp.initDataUnsafe === 'object' &&
            Object.keys(telegram.WebApp.initDataUnsafe).length > 0) {
          console.log('Verified Telegram WebApp environment');
          return true;
        } else {
          console.log('Telegram WebApp object found, but seems invalid');
          return false;
        }
      }
      // Check for Telegram-specific URL parameters
      if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
        console.log('Telegram-specific URL parameters found');
        return true;
      }
      console.log('Not running in TMA environment');
      return false;
    };

    const tmaDetected = detectTMA();
    setIsTMA(tmaDetected);
    console.log('TMA detected:', tmaDetected); // Debug log

    let clickId:any = null;
    let userId = getTelegramUserId();;

    if (tmaDetected) {
      const telegram = (window as any).Telegram;
      // Attempt to get Telegram WebApp data
      if (telegram &&telegram.WebApp) {
        const initDataUnsafe =telegram.WebApp.initDataUnsafe;
        userId = initDataUnsafe.user?.id || null;
        clickId = initDataUnsafe.start_param || null;
        if (clickId && clickId.startsWith('clickid_')) {
          clickId = clickId.split('_')[1];  // Extract the actual click ID
        }
      }
      // If we couldn't get the data from WebApp, try URL parameters
      if (!userId) {
        const tgWebAppData = urlParams.get('tgWebAppData');
        if (tgWebAppData) {
          try {
            const decodedData = JSON.parse(atob(tgWebAppData));
            userId = decodedData.user?.id || null;
          } catch (error) {
            console.error('Error parsing tgWebAppData:', error);
          }
        }
      }
      if (!clickId) {
        clickId = urlParams.get('start_param') || null;
      }
    } else {
      clickId = urlParams.get('click_id') || null;
    }
    
    if (userRole) {
      verifyClick(clickId, userId, env, tmaDetected, userRole);
    } else {
      console.log('No role specified, skipping click verification');
    }
  }, []);

  const verifyClick = async (clickId, userId, env, isTMA, userRole) => {
    try {
      console.log('Verifying click:', { clickId, userId, env, userRole, isTMA }); // Debug log
      
      let apiUrl;
      const baseUrl = env === 'dev' ? 'https://click-dev.dmtp.tech' : 'https://click.dmtp.tech';
  
      if (userRole === 'publisher') {
        // Publishers use GET to retrieve click events
        apiUrl = `${baseUrl}/banners/events?`;
        if (isTMA && userId) {
          apiUrl += `wa=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D&tui=${userId}`;
        } else if (!isTMA && clickId) {
          apiUrl += `wa=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D&tui=${userId}`;
        } else {
          console.error('Invalid parameters for publisher verification');
          return;
        }
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Publisher events retrieved:', data);
          // Check if there are any items in the response
          if (data.items && data.items.length > 0) {
            const clickEvents = data.items.filter(item => item.action === "CLICK");
            if (clickEvents.length > 0) {
              console.log(`${clickEvents.length} offer wall click event(s) found, verifying click`);
              setClickVerified(true);
              const newScore = data.items.length * 10;
              setScore(newScore);
              console.log(`Set initial score to ${newScore} based on ${data.items.length} event(s)`);
            } else {
              console.log('No click events found');
            }
          } else {
            console.log('No events found in the response');
          }
        } else {
          console.log('Failed to retrieve publisher events');
        }
      } else if (userRole === 'advertiser') {
        // Advertisers use the verify endpoint
        if (isTMA) {
          if (!userId) {
            console.error('User ID is required for TMA mode verification');
            return;
          }
          apiUrl = `${baseUrl}/banners/verify?tui=${encodeURIComponent(userId)}`;
          if (clickId) {
            apiUrl += `&click_id=${encodeURIComponent(clickId)}`;
          }
        } else {
          if (!clickId) {
            console.error('Click ID is required for non-TMA mode verification');
            return;
          }
          apiUrl = `${baseUrl}/banners/verify?click_id=${encodeURIComponent(clickId)}`;
        }
  
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Advertiser click verification response:', data);
          if (data.valid) {
            setClickVerified(true);
            setScore(100); // Set initial score to 100 for verified clicks
            console.log('Click verified, set score to 100!');
          }
        } else {
          console.log('Verification failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    document.title = config.name;
  }, [config.name]);

  const moveObject = useCallback(() => {
    const maxX = window.innerWidth - 100; // Assuming object width is 100px
    const maxY = window.innerHeight - 155; // 100px for object height + 50px for ad banner
    setPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY + 155, // Add 115px to account for ad banner
    });
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(moveObject, config.moveInterval);
      return () => clearInterval(interval);
    }
  }, [gameState, moveObject, config.moveInterval]);

  const handleClick = () => {
    setScore(prevScore => prevScore + 1);
    moveObject();
  };

  const startGame = () => {
    if (!clickVerified) {
      setScore(0); // Reset score to 0 for non-verified clicks
    }
    setGameState('playing');
    moveObject();
  };

  const pauseGame = useCallback(() => {
    setGameState('paused');
    // The offer wall is now opened in the MainMenu component
  }, []);

  const resumeGame = () => setGameState('playing');
  const showTopScores = () => alert('Top Scores: Coming soon!');
  const quitGame = () => {
    setGameState('menu');
    if (!clickVerified) {
      setScore(0);
    }
  };

  const showAbout = () => setIsAboutOpen(true);
  const closeAbout = () => setIsAboutOpen(false);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${config.backgroundUrl})`,
      backgroundSize: 'cover',
      position: 'relative',
    }}>
      <GameTitle title={config.name} />
      <ScorePanel score={score} />
      <MainMenu
        onStartGame={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onShowTopScores={showTopScores}
        onShowAbout={showAbout}
        onQuit={quitGame}
        gameState={gameState}
      />
      {gameState !== 'menu' && (
        <GameObject
          position={position}
          onClick={handleClick}
          imageUrl={config.objectUrl}
        />
      )}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={closeAbout}
        gameInfo={{
          name: config.name,
          backgroundCredit: config.backgroundCredit,
          objectCredit: config.objectCredit,
        }}
        environment={environment}
        isTMA={isTMA}
        role={role}
      />
    </div>
  );
};
export default Game;

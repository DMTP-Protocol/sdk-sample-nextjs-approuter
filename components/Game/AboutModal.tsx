'use client';
import { useState, useEffect } from 'react';
const AboutModal = ({ isOpen, onClose, gameInfo, environment, isTMA, role }) => {

  const [userId, setUserId] = useState('N/A');
  
  useEffect(() => {
    const fetchTelegramUserId = () => {
      const telegram = (window as any).Telegram;
      if (telegram && telegram.WebApp) {
        const initDataUnsafe = telegram.WebApp.initDataUnsafe || {};
        
        setUserId(initDataUnsafe.user?.id || 'N/A');
        // Update the user-id element if it exists (for compatibility with index.html)
        const userIdElement = document.getElementById('user-id');
        if (userIdElement) {
          userIdElement.textContent = `Telegram user ID: ${initDataUnsafe.user?.id || 'N/A'}`;
        }
      }
    };
    fetchTelegramUserId();
  }, []);
  if (isOpen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto',
        }}>
          <h2>About {gameInfo.name}</h2>
          <h3>Background Image</h3>
          <p dangerouslySetInnerHTML={{ __html: gameInfo.backgroundCredit }} />
          <h3>Object Image</h3>
          <p dangerouslySetInnerHTML={{ __html: gameInfo.objectCredit }} />
          <h3>Apps Network Role</h3>
          <p>Current role: {role || 'Not specified'}</p>
          <h3>Telegram User Info (Debug)</h3>
          <p>User ID: {userId}</p>
          <h3>Environment</h3>
          <p>Current environment: {environment}</p>
          <h3>TMA mode</h3>
          <p>Is in TMA: {isTMA?.toString()}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  } else { 
    return ''
  }

  
};
export default AboutModal;
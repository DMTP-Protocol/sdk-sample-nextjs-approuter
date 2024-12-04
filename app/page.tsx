

'use client';
import { useEffect, useState } from 'react';
import Game from '@/components/Game/Game'; 
declare const TE;
const games = {
  cosmicClicker: {
    name: "Cosmic Clicker",
    backgroundUrl: './images/game_assets/space-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@andyjh07?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andy Holmes</a> on <a href="https://unsplash.com/photos/milky-way-during-night-time-LUpDjlJv4_c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: './images/game_assets/spaceship-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3000,
  },
  forestFriend: {
    name: "Forest Friend",
    backgroundUrl: './images/game_assets/forest-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@howardbouchevereau?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Howard Bouchevereau</a> on <a href="https://unsplash.com/photos/a-forest-of-tall-trees-nifQzholGAc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: './images/game_assets/forest_friend-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 2500,
  },
  balloonBopper: {
    name: "Balloon Bopper",
    backgroundUrl: './images/game_assets/sky-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@thomasdupon_be?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Thomas Dupon</a> on <a href="https://unsplash.com/photos/white-clouds-and-blue-sky-during-daytime-KuuHp9HgCI0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: './images/game_assets/balloon-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3500,
  },
  deepSeaClicker: {
    name: "Deep Sea Clicker",
    backgroundUrl: './images/game_assets/ocean-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@silasbaisch?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Silas Baisch</a> on <a href="https://unsplash.com/photos/blue-and-clear-body-of-water-K785Da4A_JA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: './images/game_assets/jellyfish-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3000,
  },
};

export default function Home() {
  const [gameConfig, setGameConfig] = useState({});
  const [gameType, setGameType] = useState('cosmicClicker');
  // Get the game type from the URL, default to cosmicClicker
  const getGameType = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('game') || 'cosmicClicker';
  };

  useEffect(() => {
        document.addEventListener('becLoaded', function (event : unknown) {
          console.log("🚀 ~ event:", event)
          if (typeof TE !== 'undefined' && TE.configureOfferWallStyle) {
              TE.configureOfferWallStyle({
              topBar: {
                  backgroundColor: '#2c3e50',
                  textColor: '#ecf0f1'
              },
              content: {
                  backgroundColor: '#34495e',
                  appNameColor: '#ecf0f1',
                  appDescriptionColor: '#bdc3c7'
              },
              button: {
                  backgroundColor: '#3498db',
                  textColor: '#ffffff',
                  highlightedBackgroundColor: '#2980b9',
                  highlightedTextColor: '#ffffff',
                  outlineColor: '#3498db'
              }
          });
          } else {
              console.warn('TE is not defined or configureOfferWallStyle is missing.');
          }
      });
    }, []);
    useEffect(() => {
      setGameType(getGameType());
      setGameConfig(games[gameType]);  
    },[gameType])
  return (
    <div id="game-container">
        <Game config={gameConfig} />
    </div>
  );
}

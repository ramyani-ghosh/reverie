'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import "../../../styles/game.css"; 

const PlayGame = () => {
  const searchParams = useSearchParams();
  const [gameData, setGameData] = useState<any>(null);
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<"team1" | "team2">("team1");
  const [team1TurnIndex, setTeam1TurnIndex] = useState<number>(0);
  const [team2TurnIndex, setTeam2TurnIndex] = useState<number>(0);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentConstraint, setCurrentConstraint] = useState<string | null>(null);
  const [storyImages, setStoryImages] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<any[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [storyFlipped, setStoryFlipped] = useState<boolean>(false);
  const [constraintFlipped, setConstraintFlipped] = useState<boolean>(false);

  useEffect(() => {
    const gameDataString = searchParams.get('gameData');
    if (gameDataString) {
      try {
        const parsedGameData = JSON.parse(decodeURIComponent(gameDataString));
        setGameData(parsedGameData);
        setTeam1Score(parsedGameData.team1Score);
        setTeam2Score(parsedGameData.team2Score);
        setCurrentPlayer(parsedGameData.teams.team1[0]);
      } catch (error) {
        console.error('Error parsing game data:', error);
      }
    }

    fetch('/api/story-cards')
      .then((response) => response.json())
      .then((data) => setStoryImages(data))
      .catch((error) => console.error('Error fetching story images:', error));

    fetch('/api/constraints')
      .then((response) => response.json())
      .then((data) => setConstraints(data))
      .catch((error) => console.error('Error fetching constraints:', error));
  }, [searchParams]);

  const handleReadyClick = () => {
    const randomStory = storyImages[Math.floor(Math.random() * storyImages.length)];
    const randomConstraint = constraints[Math.floor(Math.random() * constraints.length)].text;

    setCurrentStory(randomStory);
    setCurrentConstraint(randomConstraint);
    setIsReady(true);
  };

  const handleCardClick = (cardType: 'story' | 'constraint') => {
    if (cardType === 'story') {
      setStoryFlipped(true);
    } else if (cardType === 'constraint') {
      setConstraintFlipped(true);
    }
  };

  if (!gameData || !storyImages.length || !constraints.length) return <div>Loading...</div>;

  return (
    <div className="gameplay-container">
      <header className="game-header">
        <div className="teams-display flex space-x-16 player-list">
          <div className={`team ${currentTeam === "team1" ? "highlighted" : ""}`}>
            <h2>Team 1</h2>
            <ul>
              {gameData.teams.team1.map((player: string, index: number) => (
                <li key={index} className={player === currentPlayer ? "highlighted-player" : ""}>{player}</li>
              ))}
            </ul>
          </div>
          <div className={`team ${currentTeam === "team2" ? "highlighted" : ""}`}>
            <h2>Team 2</h2>
            <ul>
              {gameData.teams.team2.map((player: string, index: number) => (
                <li key={index} className={player === currentPlayer ? "highlighted-player" : ""}>{player}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="score-box">
          <h2>SCORES</h2>
          <p>Team 1: {team1Score}</p>
          <p>Team 2: {team2Score}</p>
        </div>
      </header>
      <div className="gameplay-content">
        {!isReady ? (
          <>
            <h1>Game On!</h1>
            <p>It's {currentPlayer}'s turn from {currentTeam === "team1" ? "Team 1" : "Team 2"}</p>
            <button className="ready-button" onClick={handleReadyClick}>Ready</button>
          </>
        ) : (
          <div className="storyClues">
            <div className={`flip-card ${storyFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick('story')}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-back">Story Card</div>
                </div>
                <div className="flip-card-back">
                  <img src={`/story-cards/${currentStory}`} alt="Story Card" className="story-image" />
                </div>
              </div>
            </div>
            <div className={`flip-card ${constraintFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick('constraint')}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-back">Constraint Card</div>
                </div>
                <div className="flip-card-back">
                  <div className="constraint-card">
                    <p className="constraint-text">{currentConstraint}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;

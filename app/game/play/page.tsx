'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import "../../../styles/game.css"; 

const PlayGame = () => {
  const searchParams = useSearchParams();
  const [gameData, setGameData] = useState<any>(null); // Adjust the type as needed
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

  useEffect(() => {
    const gameDataString = searchParams.get('gameData');
    if (gameDataString) {
      try {
        const parsedGameData = JSON.parse(decodeURIComponent(gameDataString));
        setGameData(parsedGameData);
        setTeam1Score(parsedGameData.team1Score);
        setTeam2Score(parsedGameData.team2Score);

        // Start with the first player from Team 1
        setCurrentPlayer(parsedGameData.teams.team1[0]);
      } catch (error) {
        console.error('Error parsing game data:', error);
      }
    }

    // Fetch story images from the API
    fetch('/api/story-cards')
      .then((response) => response.json())
      .then((data) => setStoryImages(data))
      .catch((error) => console.error('Error fetching story images:', error));

    // Fetch constraints from the API
    fetch('/api/constraints')
      .then((response) => response.json())
      .then((data) => setConstraints(data))
      .catch((error) => console.error('Error fetching constraints:', error));
  }, [searchParams]);

  const handleReadyClick = () => {
    // Randomly select a story image
    const randomStory = storyImages[Math.floor(Math.random() * storyImages.length)];

    // Randomly select a constraint
    const randomConstraint = constraints[Math.floor(Math.random() * constraints.length)].text;

    setCurrentStory(randomStory);
    setCurrentConstraint(randomConstraint);
  };

  if (!gameData) return <div>Loading...</div>;

  return (
    <div className="gameplay-container">
      <header className="game-header">
        <div className="teams-display flex space-x-16 player-list">
          <div className="team">
            <h2>Team 1</h2>
            <ul>
              {gameData.teams.team1.map((player: string, index: number) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          </div>
          <div className="team">
            <h2>Team 2</h2>
            <ul>
              {gameData.teams.team2.map((player: string, index: number) => (
                <li key={index}>{player}</li>
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
        <h1>Game On!</h1>
        <p>It's {currentPlayer}'s turn from {currentTeam === "team1" ? "Team 1" : "Team 2"}</p>
        <button className="ready-button" onClick={handleReadyClick}>Ready</button>
        {currentStory && (
          <div className="storyClues">
            <img src={`/story-cards/${currentStory}`} alt="Story Card" />
            <p>{currentConstraint}</p>
            <p>Time to think of a clue!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;

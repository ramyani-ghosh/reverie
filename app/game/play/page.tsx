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

  useEffect(() => {
    const gameDataString = searchParams.get('gameData');
    if (gameDataString) {
      try {
        const parsedGameData = JSON.parse(decodeURIComponent(gameDataString));
        setGameData(parsedGameData);
        setTeam1Score(parsedGameData.team1Score);
        setTeam2Score(parsedGameData.team2Score);

        // Randomize the current player from Team 1
        if (parsedGameData.teams.team1.length > 0) {
          const randomPlayer = parsedGameData.teams.team1[Math.floor(Math.random() * parsedGameData.teams.team1.length)];
          setCurrentPlayer(randomPlayer);
        }
      } catch (error) {
        console.error('Error parsing game data:', error);
      }
    }
  }, [searchParams]);

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
        <p>It's {currentPlayer}'s turn from Team 1</p>
        <button className="ready-button">Ready</button>
      </div>
    </div>
  );
};

export default PlayGame;

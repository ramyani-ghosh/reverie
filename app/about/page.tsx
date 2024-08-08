'use client'; // Ensure this line is present to mark the component as a Client Component

import { useState } from 'react';
import "../../styles/globals.css"; // Ensure global styles are imported

type GameMode = 'cooperative' | 'competitive';
type WinCondition = 'points' | 'rounds';

const GamePage = () => {
  const [gameMode, setGameMode] = useState<GameMode>('cooperative');
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [teams, setTeams] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });
  const [winCondition, setWinCondition] = useState<WinCondition>('points');
  const [pointsToWin, setPointsToWin] = useState<number>(10);
  const [rounds, setRounds] = useState<number>(15);

  const handleAddPlayer = () => {
    if (playerName.trim() !== '') {
      setPlayers([...players, playerName]);
      setPlayerName('');
    }
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'competitive') {
      const half = Math.ceil(players.length / 2);
      setTeams({
        team1: players.slice(0, half),
        team2: players.slice(half),
      });
    } else {
      setTeams({ team1: [], team2: [] });
    }
  };

  const handleRandomizeTeams = () => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const half = Math.ceil(shuffled.length / 2);
    setTeams({
      team1: shuffled.slice(0, half),
      team2: shuffled.slice(half),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Game Setup</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Choose Game Mode:</h2>
        <div className="flex space-x-4 mt-2">
          <button 
            className={`px-4 py-2 border rounded ${gameMode === 'cooperative' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={() => handleGameModeChange('cooperative')}
          >
            Cooperative
          </button>
          <button 
            className={`px-4 py-2 border rounded ${gameMode === 'competitive' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={() => handleGameModeChange('competitive')}
          >
            Competitive
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Player List:</h2>
        <div className="mb-2">
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)} 
            placeholder="Enter player name" 
            className="border p-2 rounded"
          />
          <button 
            className="ml-2 px-4 py-2 border rounded bg-green-500 text-white"
            onClick={handleAddPlayer}
          >
            Add Player
          </button>
        </div>
        <ul className="list-disc pl-5">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
        {gameMode === 'competitive' && players.length > 1 && (
          <>
            <button 
              className="mt-4 px-4 py-2 border rounded bg-yellow-500 text-white"
              onClick={handleRandomizeTeams}
            >
              Randomize Teams
            </button>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Team 1:</h2>
              <ul className="list-disc pl-5">
                {teams.team1.length > 0 ? (
                  teams.team1.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))
                ) : (
                  <li>No players assigned</li>
                )}
              </ul>
              <h2 className="text-xl font-semibold mt-4">Team 2:</h2>
              <ul className="list-disc pl-5">
                {teams.team2.length > 0 ? (
                  teams.team2.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))
                ) : (
                  <li>No players assigned</li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Set Win Conditions:</h2>
        <div className="mt-2">
          <label>
            <input 
              type="radio" 
              name="winCondition" 
              value="points" 
              checked={winCondition === 'points'}
              onChange={() => setWinCondition('points')} 
            />
            First to <input 
              type="number" 
              value={pointsToWin}
              onChange={(e) => setPointsToWin(Number(e.target.value))}
              disabled={winCondition !== 'points'}
              className="w-16 ml-2 border p-1 rounded"
            /> points
          </label>
          <br />
          <label>
            <input 
              type="radio" 
              name="winCondition" 
              value="rounds" 
              checked={winCondition === 'rounds'}
              onChange={() => setWinCondition('rounds')} 
            />
            Game consists of <input 
              type="number" 
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              disabled={winCondition !== 'rounds'}
              className="w-16 ml-2 border p-1 rounded"
            /> rounds
          </label>
        </div>
      </div>
      
      <button 
        className="px-4 py-2 border rounded bg-blue-500 text-white"
        onClick={() => alert('Game settings saved!')}
      >
        Start Game
      </button>
    </div>
  );
};

export default GamePage;

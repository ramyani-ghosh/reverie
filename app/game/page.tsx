// app/game/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/game.css"; 

type GameMode = 'cooperative' | 'competitive';
type WinCondition = 'points' | 'rounds';

const GamePage = () => {
  const router = useRouter();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [teams, setTeams] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [winCondition, setWinCondition] = useState<WinCondition>('points');
  const [pointsToWin, setPointsToWin] = useState<number>(10);
  const [rounds, setRounds] = useState<number>(10);
  const [currentStep, setCurrentStep] = useState<number>(1);

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

  const handleStartGame = () => {
    const gameData = {
      gameMode,
      players,
      teams,
      team1Score,
      team2Score,
      winCondition,
      pointsToWin,
      rounds,
    };
    
    // Convert gameData to query string
    const queryString = new URLSearchParams({ gameData: JSON.stringify(gameData) }).toString();

    router.push(`/game/play?${queryString}`);  // Navigate to the game play page with query string
  };

  return (
    <div className="page-gamesetup">
      <header className="header">
        <a href="/" ><img src="/images/Reverie-Logo-Mixed.png" alt="Game Logo" width="180" height="100" /></a>  
      </header>

      <div className="gamesetup"> 
        {currentStep === 1 && (
          <>
            <h1>New Game Setup</h1>
            <br /><br />
            <div className="mb-6">
              <h2>Choose Game Mode:</h2>
              <div className="gamemode">
                <button 
                  className={`gamemode-button ${gameMode === 'cooperative' ? 'selected-button text-white' : ''}`} 
                  onClick={() => handleGameModeChange('cooperative')}
                >
                  Cooperative
                </button>
                <button 
                  className={`gamemode-button ${gameMode === 'competitive' ? 'selected-button text-white' : ''}`} 
                  onClick={() => handleGameModeChange('competitive')}
                >
                  Competitive
                </button>
              </div>
            </div>
            
            {gameMode && (
              <div className="mb-6">
                <h2>Add Players</h2>
                <div className="mb-2">
                  <input 
                    type="text" 
                    value={playerName} 
                    onChange={(e) => setPlayerName(e.target.value)} 
                    placeholder="Enter player name" 
                    className="border p-2 name-input"
                  />
                  <button 
                    className="add-button"
                    onClick={handleAddPlayer}
                  >
                   + Add
                  </button>
                </div>
                <p className="player-list">
                  {players.join(', ')}
                </p>

                {gameMode === 'competitive' && players.length >= 4 && (
                  <button 
                    className="gamemode-button"
                    onClick={() => {
                      handleRandomizeTeams();
                      setCurrentStep(2);
                    }}
                  >
                   Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex space-x-24 player-list">
              <div>
                <h2>Team 1</h2> <br />
                <ul className="list-disc pl-5">
                  {teams.team1.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))}
                </ul>
              </div>
              <div>
              <h2>Team 2</h2> <br />
                <ul className="list-disc pl-5">
                  {teams.team2.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              className="gamemode-button"
              onClick={handleRandomizeTeams}
            >
              Shuffle Teams
            </button>
            <br /><br /><br /><br />
            <h2>Select Winning Criteria</h2>
            <div className="mt-2 win-conditions">
              <label className="radio-label">
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
              <br /><br />
              <label className="radio-label">
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
            <br />
            <button 
              className="gamemode-button"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </>
        )}
      </div> 
    </div>
  );
};

export default GamePage;

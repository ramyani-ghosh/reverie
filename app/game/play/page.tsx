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
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [guessingCards, setGuessingCards] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
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
        setCurrentPlayer(parsedGameData.teams.team1[0]); // Start with first player of team1
        setCurrentTeam("team1"); // Starting team
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

  // Handle the Ready button click to move to the story phase
  const handleReadyClick = () => {
    if (storyImages.length && constraints.length) {
      const randomStory = storyImages[Math.floor(Math.random() * storyImages.length)];
      const randomConstraint = constraints[Math.floor(Math.random() * constraints.length)].text;

      setCurrentStory(randomStory);
      setCurrentConstraint(randomConstraint);
      setIsReady(true); // Move to story phase
      setStoryFlipped(false); // Reset the story card to unflipped
      setConstraintFlipped(false); // Reset the constraint card to unflipped
    }
  };

  // Handle the Ready with clue button click to move to the guessing phase
  const handleReadyGuessing = () => {
    if (currentStory && storyImages.length) {
      // Prepare guessing cards
      const shuffledImages = [...storyImages].sort(() => 0.5 - Math.random()).slice(0, 4);
      const cards = [...shuffledImages, currentStory].sort(() => 0.5 - Math.random());

      setGuessingCards(cards);
      setIsGuessing(true); // Move to guessing phase
      setStoryFlipped(false); // Ensure story card is unflipped for the next phase
    }
  };

  // Handle card selection in the guessing phase
  const handleGuessSubmission = (card: string) => {
    if (card === currentStory) {
      alert("Correct!");
      if (currentTeam === "team1") {
        setTeam1Score(prevScore => prevScore + 1);
      } else {
        setTeam2Score(prevScore => prevScore + 1);
      }
    } else {
      alert("Wrong!");
    }

    // Move to the next turn
    if (currentTeam === "team1") {
      setCurrentTeam("team2");
      setCurrentPlayer(gameData.teams.team2[team2TurnIndex % gameData.teams.team2.length]);
      setTeam2TurnIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentTeam("team1");
      setCurrentPlayer(gameData.teams.team1[team1TurnIndex % gameData.teams.team1.length]);
      setTeam1TurnIndex(prevIndex => prevIndex + 1);
    }

    // Reset for the next round
    setIsReady(false);
    setIsGuessing(false);
    setCurrentStory(null);
    setCurrentConstraint(null);
    setStoryFlipped(false);
    setConstraintFlipped(false);
  };

  // Handle card flip on click
  const handleCardClick = (cardType: "story" | "constraint") => {
    if (cardType === "story") {
      setStoryFlipped(prev => !prev);
    } else if (cardType === "constraint") {
      setConstraintFlipped(prev => !prev);
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
        ) : isGuessing ? (
          <div className="guessing-section">
            <h2>{currentTeam}, it's time to guess!</h2>
            <div className="guessing-cards">
              {guessingCards.map((card, index) => (
                <div
                  key={index}
                  className="guessing-card"
                  onClick={() => handleGuessSubmission(card)}
                >
                  <img src={`/story-cards/${card}`} alt={`Card ${index}`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="storyClues">
              <div className={`flip-card ${storyFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick('story')}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-back">Story Card</div>
                  </div>
                  <div className="flip-card-back">
                    {currentStory && <img src={`/story-cards/${currentStory}`} alt="Story Card" className="story-image" />}
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
            <button className="ready-button" onClick={handleReadyGuessing}>Ready with clue</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;

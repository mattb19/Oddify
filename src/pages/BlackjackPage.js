import React, { useState, useEffect } from 'react';
import BlackjackTable from '../components/BlackjackTable';
import BetControls from '../components/BetControls';
import GameStatus from '../components/GameStatus';
import { saveGameResult, calculateHandValue, startGame, hit, stand } from '../services/gameApi';

function BlackjackPage() {
  const [deckId, setDeckId] = useState('');
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameResult, setGameResult] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      const { deckId, playerHand, dealerHand } = await startGame();
      setDeckId(deckId);
      setPlayerHand(playerHand);
      setDealerHand(dealerHand);
    };

    initializeGame();
  }, []);

  const handleHit = async () => {
    const newCard = await hit(deckId);
    setPlayerHand(prevHand => [...prevHand, newCard]);
    if (calculateHandValue([...playerHand, newCard]) > 21) {
      setGameResult('Lose');
      setGameOver(true);
    }
  };

  const handleStand = async () => {
    const { dealerHand, dealerTotal } = await stand(deckId);
    setDealerHand(dealerHand);
    const playerTotal = calculateHandValue(playerHand);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      setGameResult('Win');
    } else if (playerTotal < dealerTotal) {
      setGameResult('Lose');
    } else {
      setGameResult('Draw');
    }

    setGameOver(true);
  };

  const handleSaveGameResult = async () => {
    const result = calculateHandValue(playerHand) > 21 ? 'Lose' : gameResult;
    await saveGameResult(playerHand, dealerHand, result);
    alert('Game result saved!');
  };

  return (
    <div className="blackjack-page">
      <h1>Blackjack</h1>
      <BlackjackTable playerHand={playerHand} dealerHand={dealerHand} gameOver={gameOver} />
      {!gameOver && (
        <BetControls 
          onHit={handleHit} 
          onStand={handleStand} 
          onSave={handleSaveGameResult} 
          playerHand={playerHand} 
          dealerHand={dealerHand} 
        />
      )}
      <GameStatus result={gameResult} />
    </div>
  );
}

export default BlackjackPage;

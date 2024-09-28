import React, { useState, useEffect } from 'react';
import { startGame, hit, stand, calculateHandValue } from '../services/gameApi';
import BetControls from './BetControls';

function BlackjackTable() {
  const [deckId, setDeckId] = useState('');
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  
  // State variables for tallying results
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);

  // Start a new game when the component loads
  useEffect(() => {
    const initGame = async () => {
      const { deckId, playerHand, dealerHand } = await startGame();
      setDeckId(deckId);
      setPlayerHand(playerHand);
      setDealerHand(dealerHand);
      setPlayerTotal(calculateHandValue(playerHand));
      setDealerTotal(calculateHandValue([dealerHand[0]])); // Hide dealer's second card
    };

    initGame();
  }, []);

  // Handle player's "Hit" action
  const handleHit = async () => {
    const newCard = await hit(deckId);
    const updatedPlayerHand = [...playerHand, newCard];
    setPlayerHand(updatedPlayerHand);
    
    const newTotal = calculateHandValue(updatedPlayerHand);
    setPlayerTotal(newTotal);

    // Check if player busts
    if (newTotal > 21) {
      setGameResult('Player busts! Dealer wins.');
      setGameOver(true);
    }
  };

  // Handle player's "Stand" action
  const handleStand = async () => {
    let updatedDealerHand = dealerHand;
    let updatedDealerTotal = calculateHandValue(dealerHand);

    // Dealer hits until they reach 17 or higher
    while (updatedDealerTotal < 17) {
      const { dealerHand, dealerTotal } = await stand(deckId);
      updatedDealerHand = [...updatedDealerHand, dealerHand[dealerHand.length - 1]];
      updatedDealerTotal = dealerTotal;
    }

    setDealerHand(updatedDealerHand);
    setDealerTotal(updatedDealerTotal);

    // Determine the result of the game
    if (updatedDealerTotal > 21) {
      setGameResult('Dealer busts! Player wins.');
      setWins(wins + 1); // Increment wins
    } else if (updatedDealerTotal === playerTotal) {
      setGameResult('It’s a tie!');
      setTies(ties + 1); // Increment ties
    } else if (updatedDealerTotal > playerTotal) {
      setGameResult('Dealer wins.');
      setLosses(losses + 1); // Increment losses
    } else {
      setGameResult('Player wins!');
      setWins(wins + 1); // Increment wins
    }

    setGameOver(true);
    // Call the save function when the game ends
    handleSaveGameResult(updatedDealerHand);
  };

  // Function to save the game results
  const handleSaveGameResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerHand, dealerHand, result: gameResult }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Game result saved:', data); // Handle the response as needed
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  return (
    <div className="blackjack-container">
      <div className="blackjack-table">
        <div className="dealer-hand">
          <h2>Dealer's Hand ({gameOver ? dealerTotal : dealerTotal > 0 ? `${dealerTotal} + hidden` : 0})</h2>
          {dealerHand.map((card, index) => (
            <p key={index}>{card.value} of {card.suit}</p>
          ))}
        </div>
        <div className="player-hand">
          <h2>Your Hand ({playerTotal})</h2>
          {playerHand.map((card, index) => (
            <p key={index}>{card.value} of {card.suit}</p>
          ))}
        </div>
        {!gameOver && (
          <BetControls onHit={handleHit} onStand={handleStand} onSave={handleSaveGameResult} playerHand={playerHand} dealerHand={dealerHand} />
        )}
        {gameOver && <h3>{gameResult}</h3>}
        {/* Display tally of results */}
        <div className="tally">
          <h3>Game Tally:</h3>
          <p>Wins: {wins}</p>
          <p>Losses: {losses}</p>
          <p>Ties: {ties}</p>
        </div>
      </div>
    </div>
  );
}

export default BlackjackTable;

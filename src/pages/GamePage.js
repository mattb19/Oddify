import React, { useState, useEffect } from 'react';
import { startGame, hit, stand, calculateHandValue } from '../services/gameApi';
import BlackjackPage from './BlackjackPage';

const GamePage = () => {
  const [deckId, setDeckId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [gameStatus, setGameStatus] = useState('');
  const [isBusted, setIsBusted] = useState(false);
  const [isDealerTurn, setIsDealerTurn] = useState(false);
  const [dealerVisibleCard, setDealerVisibleCard] = useState(null); // For displaying the dealer's visible card

  useEffect(() => {
    const initializeGame = async () => {
      const { deckId, playerHand, dealerHand } = await startGame();
      setDeckId(deckId);
      setPlayerHand(playerHand);
      setDealerHand(dealerHand);
      setPlayerTotal(calculateHandValue(playerHand));
      setDealerVisibleCard(dealerHand[0]); // Store the dealer's visible card
    };
    initializeGame();
  }, []);

  const handleHit = async () => {
    if (playerTotal >= 21 || isDealerTurn) return;

    const newCard = await hit(deckId);
    const updatedHand = [...playerHand, newCard];
    const newTotal = calculateHandValue(updatedHand);
    
    setPlayerHand(updatedHand);
    setPlayerTotal(newTotal);

    if (newTotal > 21) {
      setIsBusted(true);
      setGameStatus('You bust! Dealer wins.');
      setIsDealerTurn(true); // End player turn if they bust
      determineOutcome(dealerTotal); // Evaluate outcome
    }
  };

  const handleStand = async () => {
    setIsDealerTurn(true);
    const { dealerHand, dealerTotal } = await stand(deckId);
    setDealerHand(dealerHand);
    setDealerTotal(dealerTotal);
    determineOutcome(dealerTotal);
  };

  const determineOutcome = (dealerTotal) => {
    if (playerTotal > 21) {
      setGameStatus('You bust! Dealer wins.');
    } else if (dealerTotal > 21) {
      setGameStatus('Dealer busts! You win!');
    } else if (playerTotal > dealerTotal) {
      setGameStatus('You win!');
    } else if (playerTotal < dealerTotal) {
      setGameStatus('Dealer wins.');
    } else {
      setGameStatus('It\'s a tie!');
    }
  };

  return (
    <div className="game-page">
      <BlackjackPage 
        playerHand={playerHand} 
        dealerHand={dealerHand} 
        playerTotal={playerTotal} 
        dealerTotal={dealerTotal} 
        gameStatus={gameStatus}
        onHit={handleHit}
        onStand={handleStand}
        isBusted={isBusted}
        dealerVisibleCard={dealerVisibleCard} // Pass the dealer's visible card
      />
    </div>
  );
};

export default GamePage;

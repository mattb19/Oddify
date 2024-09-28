const BASE_URL = 'https://deckofcardsapi.com/api/deck';
const GAME_URL = 'http://localhost:5000/api/games'; // Your MySQL API endpoint

// Shuffle a new deck and get the deck_id
export const startGame = async () => {
  const response = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);
  const data = await response.json();

  const deckId = data.deck_id;

  // Draw two cards for the player and two for the dealer
  const drawResponse = await fetch(`${BASE_URL}/${deckId}/draw/?count=4`);
  const cardsData = await drawResponse.json();

  const playerHand = [cardsData.cards[0], cardsData.cards[2]]; // First and third card for player
  const dealerHand = [cardsData.cards[1], cardsData.cards[3]]; // Second and fourth card for dealer

  return { deckId, playerHand, dealerHand };
};

// Draw a card for the player (Hit action)
export const hit = async (deckId) => {
  const response = await fetch(`${BASE_URL}/${deckId}/draw/?count=1`);
  const data = await response.json();

  return data.cards[0]; // Return the new card
};

// Stand: Simulate the dealer's turn
export const stand = async (deckId) => {
  let dealerHand = [];
  let dealerTotal = 0;

  while (dealerTotal < 17) {
    const response = await fetch(`${BASE_URL}/${deckId}/draw/?count=1`);
    const data = await response.json();
    const newCard = data.cards[0];
    dealerHand.push(newCard);
    dealerTotal = calculateHandValue(dealerHand); // Ensure this is correctly defined in scope
  }

  return { dealerHand, dealerTotal };
};

// Save game result
export const saveGameResult = async (playerHand, dealerHand, result) => {
  const response = await fetch(GAME_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerHand, dealerHand, result }),
  });

  return await response.json();
};

// Get all game results
export const getGameResults = async () => {
  const response = await fetch(GAME_URL);
  return await response.json();
};

// Utility function to calculate hand value, accounting for aces (1 or 11)
export const calculateHandValue = (hand) => {
  let value = 0;
  let aceCount = 0;

  hand.forEach(card => {
    if (card.value === 'ACE') {
      aceCount++;
      value += 11; // Assume ace is 11 initially
    } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
      value += 10; // Face cards are worth 10
    } else {
      value += parseInt(card.value); // Number cards have their face value
    }
  });

  // Adjust for aces: if the total is over 21 and you have aces, count some as 1 instead of 11
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
};

// Check if the player's hand is bust (over 21)
export const isBust = (hand) => {
  return calculateHandValue(hand) > 21;
};

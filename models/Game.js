// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerId: String,
  hand: Array,
  dealerHand: Array,
  bets: Number,
  result: String,
  // Add other relevant fields as necessary
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;

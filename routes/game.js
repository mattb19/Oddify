// routes/games.js
const express = require('express');
const Game = require('../models/Game');

const router = express.Router();

// Save a new game
router.post('/', async (req, res) => {
  const game = new Game(req.body);
  try {
    await game.save();
    res.status(201).send(game);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.send(games);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

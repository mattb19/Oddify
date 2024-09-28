const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON requests

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'simonkeane11@gmail.com', // Change this to your MySQL username
    password: 'Spmk@61201', // Change this to your MySQL password
    database: 'blackjack'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL connected');
});

// API route to shuffle a new deck
app.get('/api/deck/new/shuffle', async (req, res) => {
    try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error connecting to the Deck of Cards API' });
    }
});

// API route to draw cards
app.get('/api/deck/:deckId/draw', async (req, res) => {
    const { deckId } = req.params;
    try {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error connecting to the Deck of Cards API' });
    }
});

// API route to save game results
app.post('/api/games', (req, res) => {
    const { playerHand, dealerHand, result } = req.body;
    const sql = 'INSERT INTO games (player_hand, dealer_hand, result) VALUES (?, ?, ?)';
    connection.query(sql, [JSON.stringify(playerHand), JSON.stringify(dealerHand), result], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: results.insertId });
    });
});

// API route to get all game results
app.get('/api/games', (req, res) => {
    connection.query('SELECT * FROM games', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

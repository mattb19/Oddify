const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const { name } = require('ejs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // Your database host
    user: 'root', // Your database username
    password: '34$Hg5!7aD', // Your database password
    database: 'pov_poker' // Your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

// This function initializes a game object
async function initializeGame() {
    return new Promise((resolve, reject) => {
        exec('python3 initializeGame.py', (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${stderr}`);
            }
            resolve(JSON.parse(stdout));
            console.log("Initialized!")
        });
    });
}

// This function handles the python script which adds a player move to the game
function handleBet(inputGame, inputBet) {
    return new Promise((resolve, reject) => {
        const process = exec(`python handleBet.py "${inputBet}"`, { shell: true });
      
        let output = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            output += data;
        });

        process.stderr.on('data', (data) => {
            errorOutput += data; // Accumulate error data
            console.error(`Error Output: ${data}`); // Log immediately
        });

        process.on('close', (code) => {
            if (code !== 0) {
                console.error(`Process exited with code: ${code}\nError Output: ${errorOutput}`);
                return reject(new Error(`Error in Python script: ${errorOutput}`));
            }
            try {
                resolve(JSON.parse(output));
            } catch (error) {
                reject(`Failed to parse output: ${error}\nError Output: ${errorOutput}`);
            }
        });

        // Send the input JSON object to the Python script
        process.stdin.write(JSON.stringify(inputGame));
        process.stdin.end();
    });
}

// This function gets the output from the handleBet script
async function bet(betAmount) {
    try {
        const updatedJson = await handleBet(game, betAmount);
        return updatedJson;
    } catch (error) {
        console.error(error);
    }
}

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const username = req.body.username;
    req.session.username = username; // Store username in session
    res.redirect('/poker'); // Redirect to home (poker table)
    console.log(`${username} has logged in!`);
});

// Rendering poker table with ejs template
app.get('/poker', (req, res) => {
    const gameId = req.query.gameId || '0'; // Set a default game ID if needed
    res.render('table', { username: req.session.username || 'mcmattman', gameId  });
});

// Handle socket connections
io.on('connection', (socket) => {

    // Getting gameID they joined
    socket.on('joinGame', (gameId, username) => {
        // Making the user leave any previous rooms they were in
        if (socket.gameId) {
            socket.leave(socket.gameId);
            console.log(`${username} left room: ${socket.gameId}`);
        }

        // Joining the new game room
        socket.join(gameId);
        socket.gameId = gameId;
        console.log(`${username} joined room: ${gameId}`);
        const playerData = {
            socketId: socket.id,
            gameId: gameId,
            username: username
        };
        db.query(`
            INSERT INTO player (socketId, gameId, username) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                socketId = VALUES(socketId), 
                gameId = VALUES(gameId)
        `, 
        [playerData.socketId, playerData.gameId, playerData.username], 
        (error, results) => {
            if (error) {
                console.error('Error inserting/updating player:', error);
            }
        });
        
        // Here we add the playerId to the player in the game object (to be replace with sql later)
        const nameList = global.game.players.map(player => player.user);
        const userIndex = nameList.indexOf(username);
        global.game.players[userIndex].playerId = socket.id;
        
        socket.emit('updateInfo', modifyGame(global.game, socket.id)); // This specifically targets the socket
    });

    // Handle action button event, used to be on('call')
    socket.on('action', async (data, gameId) => {
        const id = gameId.gameID;
        const action = data.dataString;

        console.log(`Data received: ${action}`);
        try {
            const updatedGame = await bet(action);
            global.game = updatedGame;
            
            // Getting a list of all players in the game (to be replaced with SQL)
            db.query('SELECT * FROM PLAYER WHERE gameId = ?', [id], (error, results) => {
                if (error) {
                    console.error('Error fetching players:', error);
                    return;
                }
                results.forEach(player => {
                    const userGame = modifyGame(updatedGame, player.socketId);
                    io.to(player.socketId).emit('updateInfo', userGame);
                });
            });

            // Planning on handling round timer here. (NEED TO MAKE NEW GAME TABLE, ADD LAST MODIFIED ATTRIBUTE)
            // If the round == 4, we will call a newRound() function after 10 seconds (newRound needs to be made)
            // Action action is declared above, we need to check and make sure bets cant get through while 10
            // second timeout is active. We can use if round == 4 and current_time - game.lastModified < 10 seconds
            // simply return if those conditions are met so we cant double stack the function
            // SIMILAR LOGIC CAN BE APPLIED TO BOMB POT
        } catch (error) {
            console.error('Error handling bet:', error);
            socket.emit('error', 'Could not process bet.'); // Optional: Send error to client
        }
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected from room: ${socket.gameId}`);
        // delete players[socket.id]; // to be replaced with sql later
    });
});

// Initialize game and start the server
(async () => {
    try {
        global.game = await initializeGame(); // Initialize game globally

        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing game:', error);
    }
})();

// Modifying the game to only include what is needed to the client
function modifyTableCards(game) {
    let updatedGame = JSON.parse(JSON.stringify(game));

    let flop1 = updatedGame.flop1;
    let flop2 = updatedGame.flop2;
    let flop3 = updatedGame.flop3;
    let turn = updatedGame.turn;
    let river = updatedGame.river;

    // Helper function to reset card properties
    function resetCard(card) {
        card._suit = 'None';
        card._num = 'None';
        card._value = null;
    }

    // Reset flop, turn, and river depending on the round
    if (updatedGame.round == 0) {
        // Reset all cards for round 0
        resetCard(flop1);
        resetCard(flop2);
        resetCard(flop3);
        resetCard(turn);
        resetCard(river);
    } else if (updatedGame.round == 1) {
        // Reset flop cards for round 1 (flop)
        resetCard(turn);
        resetCard(river);
    } else if (updatedGame.round == 2) {
        // Reset turn card for round 2 (turn)
        resetCard(river);
    }
    // Return the modified copy of the game
    return updatedGame;
}

// Modify the game by specific player, only sending them their own cards
function modifyGame(game, playerId) {
    const updatedGame = modifyTableCards(game);

    function resetCard(card) {
        card._suit = 'None';
        card._num = 'None';
        card._value = null;
    }

    for (const i of updatedGame.players) {
        if (i.playerId !== playerId) {
            resetCard(i.card1);
            resetCard(i.card2);
        }
    }
    return updatedGame;
}


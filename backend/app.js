const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const { name } = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '34$Hg5!7aD',
    database: 'pov_poker' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
});

// Middleware for CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true 
}));

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true, // Prevent JavaScript access to cookies
    },
}));

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

// This function initializes a game object
async function initializeGame(id, buyin, blind, playerNames) {
    return new Promise((resolve, reject) => {
        // Join playerNames into a single string (if it's an array)
        const playerNamesStr = Array.isArray(playerNames) ? playerNames.join(',') : playerNames;

        // Create the command string with all arguments
        const command = `python3 initializeGame.py ${id} ${buyin} ${blind} "${playerNamesStr}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${stderr}`);
            }
            resolve(JSON.parse(stdout));
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
async function bet(betAmount, gameObject) {
    try {
        const updatedJson = await handleBet(gameObject, betAmount);
        return updatedJson;
    } catch (error) {
        console.error(error);
    }
}

// Handle login
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = username; // Store username in session
        console.log(`${username} has logged in!`);
        return res.json({ success: true, username }); // Respond with success
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.get('/api/auth/status', (req, res) => {
    if (req.session.username) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Rendering poker table with ejs template
app.get('/poker', async (req, res) => {
    const gameId = req.query.gameId || '0';

    try {
        res.render('table', { username: req.session.username || 'mcmattman', gameId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing game');
    }
});

app.get('/create', async (req, res) => {
    try {
        res.render('create', { username: req.session.username || 'mcmattman' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing game');
    }
});

app.post('/create', async (req, res) => {
    const { sessionName, buyin, blind, gametype } = req.body;

    try {
        const gameId = await newGameId();
        const gameObject = await initializeGame(gameId, buyin, blind, [sessionName]);


        const query = 'INSERT INTO GAME (gameId, gameObject) VALUES (?, ?)';
        const values = [gameId, JSON.stringify(gameObject)];

        db.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Error executing query', error: error.message });
            }
            // Respond with a success message
            res.redirect(`/poker?gameId=${gameId}`);
        });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ message: 'Error creating game', error: error.message });
    }
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
        
        db.query('SELECT gameObject FROM GAME WHERE gameId = ?', [gameId], (error, results) => {
            if (error) {
                console.error('Error retrieving gameObject:', error);
                return;
            }
            if (results.length > 0) {
                const gameObject = JSON.parse(results[0].gameObject); // Assign the retrieved value to the constant
                const nameList = gameObject.players.map(player => player.user);
                const userIndex = nameList.indexOf(username);
                if (userIndex !== -1) {
                    gameObject.players[userIndex].playerId = socket.id;
                    socket.emit('updateInfo', modifyGame(gameObject, socket.id));
                } else {
                    socket.emit('updateInfo', modifyGame(gameObject, socket.id)); 
                }
                db.query('UPDATE GAME SET gameObject = ? WHERE gameId = ?', 
                    [JSON.stringify(gameObject), gameId], (error, results) => {
                    if (error) {
                        console.error('Error updating game object:', error);
                        return;
                    }
                });
            } else {
                console.log(`No game found with the given gameId (${gameId}). Redirecting to create table`);
                io.to(socket.id).emit('redirect', { url: '/create' });
            }
        });
    });

    socket.on('action', async (data, gameId) => {
        const id = gameId.gameId;
        const action = data.dataString;

        console.log(`Data received: ${action}`);
        const gameObject = await new Promise((resolve, reject) => {
            db.query('SELECT gameObject FROM GAME WHERE gameId = ?', [id], (error, results) => {
                if (error) {
                    console.error('Error fetching game object:', error);
                    return reject(error);
                }
                resolve(results);
            });
        });
        tgame = JSON.parse(gameObject[0].gameObject);
        if (tgame.round == 4) {
            console.log("Unable to place bet at end of hand")
            return;
        }

        try {
            // Getting game object from database
            const gameObject = await new Promise((resolve, reject) => {
                db.query('SELECT gameObject FROM GAME WHERE gameId = ?', [id], (error, results) => {
                    if (error) {
                        console.error('Error fetching game object:', error);
                        return reject(error);
                    }
                    resolve(results);
                });
            });
            game = JSON.parse(gameObject[0].gameObject);

            const updatedGame = await bet(action, game);
            
            // Sending all players the updated game info
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

            db.query('UPDATE GAME SET gameObject = ? WHERE gameId = ?', 
                [JSON.stringify(updatedGame), id], (error, results) => {
                if (error) {
                    console.error('Error updating game object:', error);
                    return;
                }
            });

            // If its the end of hand, we give a 10 second delay then call newRound for UI purposes
            if (updatedGame.round == 4) {
                await wait(5000);
                const newRound = await bet("NEW_ROUND", game);

                // Sending all players the game with a new round
                db.query('SELECT * FROM PLAYER WHERE gameId = ?', [id], (error, results) => {
                    if (error) {
                        console.error('Error fetching players:', error);
                        return;
                    }
                    results.forEach(player => {
                        const userGame = modifyGame(newRound, player.socketId);
                        io.to(player.socketId).emit('updateInfo', userGame);
                    });
                    db.query('UPDATE GAME SET gameObject = ? WHERE gameId = ?', 
                        [JSON.stringify(newRound), id], (error, results) => {
                        if (error) {
                            console.error('Error updating game object:', error);
                            return;
                        }
                    });
                });
            }
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
        if (socket.gameId){
            console.log(`A user disconnected from room: ${socket.gameId}`);
        }
        // delete players[socket.id]; // to be replaced with sql later
    });
});

// Initialize game and start the server
(async () => {
    try {
        const PORT = process.env.PORT || 4000;
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
    // return updatedGame; // To see all players hands for debug purposes

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

// Generates a new 4-digit base36 code that doesnt exist in database and returns it
async function newGameId() {
    const generateId = () => {
        return Math.random().toString(36).substring(2, 6).toUpperCase();
    };

    let gameId;
    let exists;

    do {
        gameId = generateId();

        // Check if the gameId exists in the database
        const [rows] = await db.promise().query('SELECT COUNT(*) AS count FROM GAME WHERE gameId = ?', [gameId]);
        exists = parseInt(rows[0].count) > 0;

    } while (exists);

    return gameId;
}

// Timer function (mainly for UI purposes)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
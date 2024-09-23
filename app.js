const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

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
        exec('python initializeGame.py', (error, stdout, stderr) => {
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
    res.render('table', { username: req.session.username || 'Guest' });
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.emit('updateInfo', modifyGame(game));

    // Handle action button event, used to be on('call')
    socket.on('action', async (data) => {
        const action = data.dataString;
        console.log(`Data received: ${action}`);
        try {
            const updatedGame = await bet(action);
            global.game = updatedGame;
            io.emit('updateInfo', modifyGame(updatedGame)); // Emit the updated game state
        } catch (error) {
            console.error('Error handling bet:', error);
            socket.emit('error', 'Could not process bet.'); // Optional: Send error to client
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
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
function modifyGame(game) {
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


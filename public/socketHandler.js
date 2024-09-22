function showBetSlider() {
    const slider = document.querySelector('.custom-slider-container');
    const cbets = document.querySelector('.customBetContainer');
    slider.style.animation = 'sliderfade 0.5s forwards'
    cbets.style.animation = 'customFade 0.5s forwards'
}

function moveBetVal() {
    const button = document.querySelector('.slider-value-button');
    const slider = document.querySelector('.custom-slider-container');
    button.textContent = slider.value; // Set button text to slider value
}

///////////////////// Handle web socket Dynamic Updating /////////////////////
const socket = io();

// Emit username when connecting
socket.emit('register', { username: '<%= username %>' });

// Listen for updates to pot and current bet
socket.on('updateInfo', (game) => {
    if (typeof game === 'string') {
        // Replace single quotes with double quotes
        game = game.replace(/'/g, '"');

        // Replace True and False with true and false
        game = game.replace(/\bTrue\b/g, 'true');
        game = game.replace(/\bFalse\b/g, 'false');
        
        try {
            game = JSON.parse(game); // Attempt to parse
        } catch (error) {
            console.error('Error parsing game JSON:', error);
            console.error('Invalid JSON string:', game); // Log the invalid string
            return; // Exit if parsing fails
        }
    }

    const username = 'Ryan';
    // use window.uname to get current username

    console.log('Received game object: ', game);

    const potElement = document.getElementById('potAmount');
    const currentBetElement = document.getElementById('currentBetAmount');
    const blindButton = document.getElementById('cVal0');
    const dblindButton = document.getElementById('cVal1');
    const potButton = document.getElementById('cVal2');
    const allInButton = document.getElementById('cVal3');

    potElement.innerText = game.pot;
    currentBetElement.innerText = `Current Bet: ${game.currentBet}`;

    userButtons = document.getElementById('mainButtonContainer');

    const currentPlayerName = game.players[game.currentPlayer].user;

    // Hide all player slots and profilePicActive divs
    const totalPlayers = game.players.length;
    const nameList = game.players.map(player => player.user);
    const userIndex = nameList.indexOf(username);
    let rotatePlayers;
    if (userIndex === -1) {
        const temp = 1;
        // Here we will handle what happens if a spectator joins
    } else {
        rotatePlayers = game.players.slice(userIndex).concat(game.players.slice(0, userIndex));
    }
    const newNameList = rotatePlayers.map(player => player.user);
    const currentPlayer = newNameList.indexOf(currentPlayerName)
    const userPlayer = rot
    if (username == currentPlayerName && game.currentBet == ) {}

    for (let i = 0; i < 9; i++) {
        const playerSlot = document.getElementById(`player${i}`);
        if (playerSlot) {
            if (i < totalPlayers) {
                // Show active players, set name and chipCount
                playerSlot.style.display = 'flex'; // or whatever display you are using
                const playerName = document.getElementById(`player${i}Name`);
                playerName.innerText = rotatePlayers[i].user;
                const playerChips = document.getElementById(`player${i}ChipCount`);
                playerChips.innerText = `${rotatePlayers[i].chipCount} chips`

                if (i === currentPlayer) {
                    playerSlot.style.backgroundColor = "rgba(21, 255, 0, 0.849)";
                    playerSlot.style.animation = "expandButtons 2s infinite";
                } else {
                    playerSlot.style.backgroundColor = "rgba(0, 0, 0, 0.849)";
                    playerSlot.style.animation = "None";
                }



            } else {
                playerSlot.style.display = 'none'; // Hide unused player slots
            }
        }
    }
});

/**
 * Emit the "call" event to the server when the button is clicked. Used to be named call
 * @param {string} buttonId - The ID of the button that was clicked.
 */
function action(data) {
    const dataString = data;
    console.log(`Sending bet: ${dataString}`);
    // Emit the "action" (used to be "call") event to the server when the button is clicked
    socket.emit('action', { dataString });
}
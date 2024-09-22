function showBetSlider() {
    console.log("Click!");
    const slider = document.querySelector('.custom-slider-container');
    const cbets = document.querySelector('.customBetContainer');
    slider.style.animation = 'sliderfade 0.5s forwards'
    cbets.style.animation = 'customFade 0.5s forwards'
}

function moveBetVal() {
    const button = document.querySelector('.slider-value-button');
    const slider = document.querySelector('.custom-slider-container');
    console.log(slider.value);
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

    console.log('Received game object: ', game);

    const potElement = document.getElementById('potAmount');
    const currentBetElement = document.getElementById('currentBetAmount');

    potElement.innerText = game.pot;
    currentBetElement.innerText = `Current Bet: ${game.currentBet}`;

    // Hide all player slots and profilePicActive divs
    const totalPlayers = game.players.length;
    for (let i = 0; i < 8; i++) {
        console.log("Hello")
        const playerSlot = document.getElementById(`player${i + 1}`);
        if (playerSlot) {
            if (i < totalPlayers) {
                playerSlot.style.display = 'flex'; // or whatever display you are using
                const playerName = document.getElementById(`player${i + 1}Name`);
                playerName.innerText = game.players[i].user;
                const playerChips = document.getElementById(`player${i + 1}ChipCount`);
                playerChips.innerText = `${game.players[i].chipCount} chips`

                const profilePicActive = playerSlot.querySelector('.profilePicActive');
                if (i === game.currentPlayer) {
                    profilePicActive.style.display = 'block'; // Show active indicator
                } else {
                    profilePicActive.style.display = 'none'; // Hide if not active
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
    console.log(data);
    // Emit the "action" (used to be "call") event to the server when the button is clicked
    socket.emit('action', { data });
}
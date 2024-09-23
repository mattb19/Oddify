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
    const currentPlayer = newNameList.indexOf(currentPlayerName);
    const userPlayer = rotatePlayers[newNameList.indexOf(username)];

    // Making users cards visible
    const card1Element = document.getElementById('userCard1');
    const card2Element = document.getElementById('userCard2');
    const card1 = userPlayer.card1;
    const card2 = userPlayer.card2;
    const card1SRC = `images/poker cards/${card1._num}_of_${card1._suit.toLowerCase()}.png`;
    const card2SRC = `images/poker cards/${card2._num}_of_${card2._suit.toLowerCase()}.png`;
    console.log (card1SRC);
    card1Element.src = card1SRC;
    card2Element.src = card2SRC;

    // Changing check/call button as needed for user
    if (game.currentBet == userPlayer.currentBet) {
        document.getElementById('checkCall').innerText = 'CHECK';
    }
    else if (game.currentBet > userPlayer.currentBet) {
        document.getElementById('checkCall').innerText = 'CALL';
    }

    // Setting active marker on betting buttons if its users turn
    betButtonElement = document.getElementById('player00');
    if (currentPlayer == newNameList.indexOf(username)) {
        betButtonElement.style.backgroundColor = "rgba(21, 255, 0, 0.849)";
        betButtonElement.style.animation = "expandButtons 2s infinite";
    } else {
        betButtonElement.style.backgroundColor = "rgba(0, 0, 0, 0.849)";
        betButtonElement.style.animation = "None";
    }

    // Handling update info for all other players
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

                // Set each players cards
                if (game.round == 4 && rotatePlayers[i].currentBet !== null){
                    const card1Element = document.getElementById(`p${i}c1`);
                    const card2Element = document.getElementById(`p${i}c2`);
                    const card1 = rotatePlayers[i].card1;
                    const card2 = rotatePlayers[i].card2;
                    const card1SRC = `images/poker cards/${card1._num}_of_${card1._suit.toLowerCase()}.png`;
                    const card2SRC = `images/poker cards/${card2._num}_of_${card2._suit.toLowerCase()}.png`;
                    card1Element.src = card1SRC;
                    card2Element.src = card2SRC;
                }
                
                // Setting turn indicator for whoevers turn it is
                if (i === currentPlayer) {
                    playerSlot.style.backgroundColor = "rgba(21, 255, 0, 0.849)";
                    playerSlot.style.animation = "expandButtons 2s infinite";
                } else {
                    playerSlot.style.backgroundColor = "rgba(0, 0, 0, 0.849)";
                    playerSlot.style.animation = "None";
                }
                
                // Removing folded players cards
                if (rotatePlayers[i].currentBet == null) {
                    const card1Element = document.getElementById(`p${i}c1`);
                    const card2Element = document.getElementById(`p${i}c2`);
                    card1Element.style.animation = "fold1 0.5s forwards ease"
                    card2Element.style.animation = "fold2 0.5s forwards ease"
                }



            } else {
                playerSlot.style.display = 'none'; // Hide unused player slots
            }
        }
    }

    // Setting table cards
    


    // Changing users name to "YOU"
    document.getElementById('player0Name').innerText = 'YOU'
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
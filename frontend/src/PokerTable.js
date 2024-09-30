// PokerTable.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './PokerTable.css';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthContext';

const socket = io('http://localhost:4000');

const PokerTable = () => {
    const [gameId, setGameId] = useState('');
    const [game, setGame] = useState({});
    const [rotatedPlayers, setRotatedPlayers] = useState([]);
    const [userPlayer, setUserPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        // Check for gameId in the URL hash
        const fragment = window.location.hash.substring(1);
        if (fragment) {
            // Redirect to the same path with gameId as a query parameter
            navigate(`/poker?gameId=${fragment}`); // Redirect using React Router
        } else {
            // If there's no fragment, get the gameId from the URL
            const id = new URLSearchParams(window.location.search).get('gameId');
            if (id) {
                setGameId(id);
            }
        }
    }, [navigate]);

    useEffect(() => {
        if (gameId) {
            socket.emit('joinGame', gameId, user);

            socket.on('updateInfo', (gameData) => {
                if (typeof gameData === 'string') {
                    gameData = JSON.parse(gameData.replace(/'/g, '"').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false'));
                }
                setGame(gameData);
                console.log("Received updated game object:", gameData);
            });

            socket.on('redirect', (data) => {
                if (data && data.url) {
                    window.location.href = window.location.origin + data.url; // Redirect to the new page
                } else {
                    console.error('Redirect path is undefined:', data);
                }
            });

            return () => {
                socket.off('updateInfo');
            };
        }
    }, [gameId, user]);

    useEffect(() => {
        // On game change, we need to make sure players are rotated around the table properly
        if (game.round >= 0) {
            const currentPlayerName = game.players[game.currentPlayer].user;
            const nameList = game.players.map(player => player.user);
            const userIndex = nameList.indexOf(user);
            setRotatedPlayers(game.players.slice(userIndex).concat(game.players.slice(0, userIndex)));
            const newNameList = rotatedPlayers.map(player => player.user);
            setCurrentPlayer(newNameList.indexOf(currentPlayerName));
            const uPlayer = rotatedPlayers[newNameList.indexOf(user)];
            setUserPlayer(uPlayer);
        }
    }, [game]);

    const action = (data) => {
        socket.emit('action', { dataString: data }, { gameId });
    };

    return (
        <div>
            <div className="startGame"></div>
            <div className="tableContainer">
                <div className="circle"></div>
                <div className="hole"></div>
                <div className="table"></div>
            </div>
            <div className='sessionId'>
                Welcome to the Poker Table, {user || 'Guest'}!
                {user && <button onClick={logout}>Logout</button>}
                {/* Poker table contents */}
            </div>
            <UserCards user={userPlayer} />
            <TableInfo pot={game.pot} players={rotatedPlayers} />
            <BetSlider />
            <ActionContainer pot={game.pot} user={user} game={game} action={action} />
            <PlayerSlots players={rotatedPlayers} currentPlayer={currentPlayer} user = {user} />
            <TableCards cards={game} />
            <ButtonGrid pot={game.pot} blind={game.bigBlind} user={user} game={game} />
            <CurrentBets/>
            <BlindChips players={rotatedPlayers}/>

        </div>
    );
};

const UserCards = ({ user }) => {
    return (
        <div className="userCardContainer">
            {user && (
                <>
                    <img className="userCard2" id="userCard2" alt="User Card 2" 
                    src={`/images/poker cards/${user.card2._num}_of_${user.card2._suit.toLowerCase()}.png`} />
                    <img className="userCard1" id="userCard1" alt="User Card 1"
                    src={`/images/poker cards/${user.card1._num}_of_${user.card1._suit.toLowerCase()}.png`} />
                </>
            )}
        </div>
    );
};

const TableInfo = ({ pot }) => (
    <div className="tableInfoContainer">
        <div className="pot" id="potAmount">Pot: {pot}</div>
    </div>
);

const CurrentBets = ({ players = [] }) => {
    return (
        <div className="betsContainer">
            {Array.from({ length: 9 }, (_, index) => {
                const player = players[index]; // Get the player at this index
                return (
                    <div className='playerCurrentBet' id={`playerBet${index}`} key={index}>
                        <img src='/images/general/chipWhite.png' alt={`Player ${index} chip`} className='pokerChip'/>
                        <span className='betAmount'>200</span>
                    </div>
                );
            })}
        </div>
    );
};

const BetSlider = () => {
    const [sliderValue, setSliderValue] = useState(50);

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    return (
        <div className="custom-slider-container">
            <input
                type="range"
                min="0"
                max="1000"
                value={sliderValue}
                onChange={handleSliderChange}
                className="custom-slider"
                id="rV"
            />
            <button className="actionButton" id="customBets" onClick={() => {/* handle custom bet */}}>
                <span><p id="rangeValue">{sliderValue}</p></span>
            </button>
        </div>
    );
};

const ButtonGrid = ({ pot, blind, user, game }) => {
    const buttons = [
        { id: "blind", label: blind },
        { id: "2blind", label: blind*2.5 },
        { id: "pot", label: blind*5 },
        { id: "allin", label: "ALL-IN"},
    ];

    function isUserTurn() {
        if (user === game.players[game.currentPlayer].user) {
            return {
                animation: "expandButtons 2s infinite",
            };
        } else {
            return {
                animation: "None",
            };
        }
    }

    return (
        pot && (
            <div className="valueButtons" style={isUserTurn()}>
                {buttons.map(button => (
                    <button 
                        key={button.id} 
                        className="valueButton"
                    >
                        <span>{button.label}</span>
                    </button>
                ))}
            </div>
        )
    );
};

const ActionContainer = ({ user, game, action }) => {

    function isUserTurn() {
        console.log(game);
        if (game.players && user === game.players[game.currentPlayer].user) {
            return {
                animation: "expandButtons 2s infinite",
            };
        } else {
            return {
                animation: "None",
            };
        }
    }

    return (
        <div className="actionContainer">
            <div className="buttonContainer" id="player00" style={isUserTurn()}>
                <button className="actionButton" onClick={() => action('FOLD')}><span>FOLD</span></button>
                <button className="actionButton" onClick={() => action('CALL')}><span id="checkCall">CALL</span></button>
            </div>
        </div>
    );
};

const PlayerSlots = ({ players, currentPlayer, user }) => {
    function isActive(index) {
        if (index === currentPlayer) {
            return {
                backgroundColor: "rgba(255, 255, 255, 1)",
                animation: "expandButtons 2s infinite",
                color: "black",
            };
        } else {
            return {
                backgroundColor: "rgba(0, 0, 0, 1)",
                animation: "none",
                color: "white",
            };
        }
    }

    function isUser(player) {
        if (player !== user) {
            return true;
        } else {
            return false;
        }
    }

    return (
    <div className="playerContainer">
        {players && players.map((player, index) => (
            <div className="playerSlot" id={`player${index}`} key={index} style={isActive(index)}>
                <div className="playerName" id={`player${index}Name`}>{player.user}</div>
                <img src="/images/general/yuhfar.png" className="profilePicture" alt="Profile" />
                <div className="playerChipCount" id={`player${index}ChipCount`}>{player.chipCount} chips</div>
                {player.card1 && player.card2 && isUser(player.user) && (
                    <div className="playerCardContainer" style={{ top: '3vh', left: '5vw' }}>
                        <img src={`/images/poker cards/${player.card1._num}_of_${player.card1._suit}.png`} 
                        className={index < 5 ? "playerCard1L" : "playerCard1R"} id={`p${index}c1`} alt=""/>
                        <img src={`/images/poker cards/${player.card2._num}_of_${player.card2._suit}.png`} 
                        className={index < 5 ? "playerCard2L" : "playerCard2R"} id={`p${index}c2`} alt=""/>
                    </div>
                )}
            </div>
        ))}
    </div>
    );
}

const TableCards = ({ cards }) => (
    <div className="tableCardsContainer">
        {cards.flop1 && <img src={`/images/poker cards/${cards.flop1._num}_of_${cards.flop1._suit}.png`} 
        className="tableCard" id="flop1" alt=""/>}
        {cards.flop2 && <img src={`/images/poker cards/${cards.flop2._num}_of_${cards.flop2._suit}.png`} 
        className="tableCard" id="flop2" alt=""/>}
        {cards.flop3 && <img src={`/images/poker cards/${cards.flop3._num}_of_${cards.flop3._suit}.png`} 
        className="tableCard" id="flop3" alt=""/>}
        {cards.turn && <img src={`/images/poker cards/${cards.turn._num}_of_${cards.turn._suit}.png`} 
        className="tableCard" id="turn" alt=""/>}
        {cards.river && <img src={`/images/poker cards/${cards.river._num}_of_${cards.river._suit}.png`} 
        className="tableCard" id="river" alt=""/>}
    </div>
);

const BlindChips = ({ players }) => {
    return (
        <div className="betsContainer">
            {Array.from({ length: 9 }, (_, index) => {
                // Determine the correct image based on player.blind value or dealer index
                let chipImage = '';

                if (players[index]?.blind === 2) {
                    chipImage = '/images/general/bigBlind.png';
                } else if (players[index]?.blind === 1) {
                    chipImage = '/images/general/smallBlind.png';
                } else {
                    chipImage = '/images/general/smallBlind.png'; // Default image
                }

                return (
                    <div className='blindContainer' id={`blind${index}`} key={index}>
                        {chipImage && <img src={chipImage} className='blind'/>}
                    </div>
                );
            })}
        </div>
    );
};


export default PokerTable;

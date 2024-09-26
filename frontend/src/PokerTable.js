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
                console.log(gameId);
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
                console.log(gameData);
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
            <UserCards user={game.players && game.players[0]} />
            <TableInfo pot={game.pot} currentBet={game.currentBet} />
            <BetSlider />
            <ActionContainer action={action} />
            <PlayerSlots players={game.players} currentPlayer={game.currentPlayer} />
            <TableCards cards={game} />
        </div>
    );
};

const UserCards = ({ user }) => (
    <div className="userCardContainer">
        {user && (
            <>
                <img src={`../images/poker cards/${user.card1._num}_of_${user.card1._suit.toLowerCase()}.png`} alt="User Card 1" />
                <img src={`../images/poker cards/${user.card2._num}_of_${user.card2._suit.toLowerCase()}.png`} alt="User Card 2" />
            </>
        )}
    </div>
);

const TableInfo = ({ pot, currentBet }) => (
    <div className="tableInfoContainer">
        <div className="pot" id="potAmount">{pot}</div>
        <div className="currentBet" id="currentBetAmount">Current Bet: {currentBet}</div>
    </div>
);

const BetSlider = () => (
    <div className="custom-slider-container">
        <input type="range" min="0" max="1000" defaultValue="50" id="rV" />
        <button className="actionButton" onClick={() => {/* handle custom bet */}}>
            <span><p id="rangeValue">50</p></span>
        </button>
    </div>
);

const ActionContainer = ({ action }) => (
    <div className="actionContainer">
        <div className="buttonContainer" id="player00">
            <button className="actionButton" onClick={() => action('FOLD')}><span>FOLD</span></button>
            <button className="actionButton" onClick={() => action('CALL')}><span id="checkCall">CALL</span></button>
            <button className="actionButton" onClick={() => {/* showBetSlider */}}><span>BET</span></button>
        </div>
    </div>
);

const PlayerSlots = ({ players, currentPlayer }) => (
    <div className="playerContainer">
        {players && players.map((player, index) => (
            <div className="playerSlot" id={`player${index}`} key={index}>
                <div className="playerName" id={`player${index}Name`}>{player.user}</div>
                <img src="images/general/yuhfar.png" className="profilePicture" alt="Profile" />
                <div className="playerChipCount" id={`player${index}ChipCount`}>{player.chipCount} chips</div>
                {player.card1 && player.card2 && (
                    <div className="playerCardContainer" style={{ top: '3vh', left: '5vw' }}>
                        <img src={`./images/poker cards/${player.card1._num}_of_${player.card1._suit}.png`} 
                        className="playerCard1" id={`p${index}c1`} alt=""/>
                        <img src={`./images/poker cards/${player.card2._num}_of_${player.card2._suit}.png`} 
                        className="playerCard2" id={`p${index}c2`} alt=""/>
                    </div>
                )}
            </div>
        ))}
    </div>
);

const TableCards = ({ cards }) => (
    <div className="tableCardsContainer">
        {cards.flop1 && <img src={`../images/poker cards/${cards.flop1._num}_of_${cards.flop1._suit}.png`} 
        className="tableCard" id="flop1" alt=""/>}
        {cards.flop2 && <img src={`../images/poker cards/${cards.flop2._num}_of_${cards.flop2._suit}.png`} 
        className="tableCard" id="flop2" alt=""/>}
        {cards.flop3 && <img src={`../images/poker cards/${cards.flop3._num}_of_${cards.flop3._suit}.png`} 
        className="tableCard" id="flop3" alt=""/>}
        {cards.turn && <img src={`../images/poker cards/${cards.turn._num}_of_${cards.turn._suit}.png`} 
        className="tableCard" id="turn" alt=""/>}
        {cards.river && <img src={`../images/poker cards/${cards.river._num}_of_${cards.river._suit}.png`} 
        className="tableCard" id="river" alt=""/>}
    </div>
);

export default PokerTable;

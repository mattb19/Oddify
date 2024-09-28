import React, { useState } from 'react';

function GameStatus() {
  const [status, setStatus] = useState('');

  return (
    <div className="game-status">
      <h2>Game Status: {status}</h2>
    </div>
  );
}

export default GameStatus;

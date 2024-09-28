import React from 'react';

const BetControls = ({ onHit, onStand, onSave, gameOver }) => {
  return (
    <div className="bet-controls">
      {!gameOver && (
        <>
          <button onClick={onHit}>Hit</button>
          <button onClick={onStand}>Stand</button>
        </>
      )}
      {gameOver && (
        <button onClick={onSave}>Save Game Result</button>
      )}
    </div>
  );
};

export default BetControls;

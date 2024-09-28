import React from 'react';

function Card({ card }) {
  return (
    <div className="card">
      <p>{card.rank} of {card.suit}</p>
    </div>
  );
}

export default Card;

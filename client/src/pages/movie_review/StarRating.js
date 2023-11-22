import React from 'react';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating }) {
  const starComponents = [];

  for (let i = 0; i < 10; i++) {
    starComponents.push(
      <FaStar
        key={i}
        className={i < rating ? 'filled' : ''}
      />
    );
  }

  return (
    <div className="star-rating">
      {starComponents.slice(0, rating)}
    </div>
  );
}

export default StarRating;

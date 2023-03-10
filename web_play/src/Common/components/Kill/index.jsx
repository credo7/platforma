import React from 'react';

import './index.scss';

function Kill({ placeNumber, forStyle, font }) {
  
  return (
    <div className='NotPrizePlace' style={forStyle}>
      <span className="PlaceNumber">{placeNumber}</span>
      <span className={font || 'Text-9px-400'}>kills</span>
    </div>
  );
}

export default Kill;

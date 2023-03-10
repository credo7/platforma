import React from "react";

import "./index.scss";

function Place({ placeNumber, forStyle, font }) {
  const prizeOrNot = (placeNumber) => {
    if (placeNumber === 1 || placeNumber === "1") {
      return "FirstPlace";
    }
    if (placeNumber === 2 || placeNumber === "2") {
      return "SecondPlace";
    }
    if (placeNumber === 3 || placeNumber === "3") {
      return "ThirdPlace";
    }
    return "NotPrizePlace";
  };

  return (
    <div className={prizeOrNot(placeNumber)} style={forStyle}>
      <span className="PlaceNumber">{placeNumber}</span>
      <span className={font || "Text-9px-400"}>Место</span>
    </div>
  );
}

export default Place;

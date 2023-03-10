import React, { useState, useEffect } from "react";

import "./index.scss";

function UserRatingCard({ data, imgSrc }) {
  const [yArr, setYArr] = useState([]);

  const yRange = 60;
  const xRange = 55 + 13.75

  const max = Math.max(...data);

  let firstMax = 1;
  let firstMin = 1;

  const ratingCalculation = (data, yRange, max) => {
    if (!data) {
      return;
    }
    const arr = [];

    data.map((item) => {
      if (item === max) {
        arr.push(0);
      } else {
        arr.push(yRange - ((item * 100 / max) * yRange / 100).toFixed(0));
      };
    });
    setYArr(arr);
  };

  useEffect(() => {
    ratingCalculation(data, yRange, max);
  }, [data, max])


  return (
    <div className="UserRatingCard">
      <div className="Swiper__imgWrapper">
        <img
          className="img-width100"
          src={imgSrc}
          alt=""
        />
      </div>
      <div className="UserRatingCard__svgWrapper">
        <p className="Text-12px-400">
          Рейтинг
        </p>
        <svg className="UserRatingCard__svg">
          <g className="UserRatingCard__storke">
            {yArr.map((y, index) => {
              if (index === yArr.length - 1) {
                return;
              }
              return (
                <line
                  key={index + Math.random}
                  x1={index * xRange}
                  x2={(index + 1) * xRange}
                  y1={y}
                  y2={yArr[index + 1]}
                ></line>
              )
            })}
          </g>
          <g className="UserRatingCard__points">
            {yArr.map((y, index) => {
              if (y === Math.max(...yArr)) {
                return (
                  <circle
                    className={"UserRatingCard__point--red" + firstMin++}
                    key={index + Math.random}
                    cx={index * xRange}
                    cy={y}
                    r="3.5"
                  ></circle>
                );
              } else if (y === 0) {
                return (
                  <circle
                    className={"UserRatingCard__point--green" + firstMax++}
                    key={index + Math.random}
                    cx={index * xRange}
                    cy={y}
                    r="3.5"
                  ></circle>
                );
              } else {
                return (
                  <circle
                    key={index + Math.random}
                    cx={index * xRange}
                    cy={y}
                    r="3.5"
                  ></circle>
                );
              }
            })}
          </g>
          <g className="UserRatingCard__text">
            {yArr.map((y, index) =>
              <text
                key={index + Math.random}
                x={index * xRange}
                y={y - 7}
              >
                {data[index]}
              </text>
            )}
          </g>
        </svg>
      </div>
    </div >
  );
};

export default UserRatingCard;

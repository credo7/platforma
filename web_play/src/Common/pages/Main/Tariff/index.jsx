import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

function Tariff({ src, tariffName, cost }) {

  const tariffWords = tariffName.split(" ");
  const part1 = tariffWords[0];
  const part2 = tariffWords[1];

  return (
    <div className="Tariff">
      <div className="Wrapper">
        <div className="Announc__imgWrapper--flexAndMargin">
          <img
            className="img-width100"
            src={src}
            alt={`Игра ${tariffName}`}
          />
          <p className="Tariff__tariffName">
            <span className="Text-16px-700">
              {part1}
            </span>
            <br />
            <span className="Text-16px-700">
              {part2}
            </span>
          </p>
        </div>

        <section className="Tariff__cost">
          <p className="Text-16px-700">
            {cost} <span className="Text-16px-400-Ruble">i</span>
          </p>
          <p className="Text-9px-400">
            12 октября
          </p>
        </section>

        <Link
          // to={}
          className="commonBtn"
        >
          ПОДКЛЮЧИТЬ
        </Link>
      </div>
    </div>
  );
};

export default Tariff;

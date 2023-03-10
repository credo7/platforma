import "./index.scss";

import React from "react";
import { Link } from "react-router-dom";

const RatingTabs = ({ tabName, children }) => {
  return (
    <div className="Rating">
      <ul className="Rating__tabs">
        <Link to="/rating/players">
          <li
            id="players"
            className={`Rating__tab${
              tabName === "players" ? "--selected" : ""
            }`}
          >
            <div className="RoundCornerWrapperBL">
              <div className="RoundCornerBL" />
            </div>
            Игроки
            <div className="RoundCornerWrapperBR">
              <div className="RoundCornerBR" />
            </div>
          </li>
        </Link>
        <Link to="/rating/teams">
          <li
            id="teams"
            className={`Rating__tab${tabName === "teams" ? "--selected" : ""}`}
          >
            <div className="RoundCornerWrapperBL">
              <div className="RoundCornerBL"></div>
            </div>
            Команды
            <div className="RoundCornerWrapperBR">
              <div className="RoundCornerBR"></div>
            </div>
          </li>
        </Link>
      </ul>

      <div className="Rating__content">{children}</div>
    </div>
  );
};

export default RatingTabs;

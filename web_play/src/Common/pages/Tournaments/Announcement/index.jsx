import "./index.scss";

import React from "react";
import { Link, useHistory } from "react-router-dom";

import moment from "Common/services/moment";

import { storage } from "Common/services/functions";

const Announcement = ({ gameByGameId, id, name, prize, liveStartAt }) => {
  const history = useHistory();

  const goToTournament = () => {
    history.push(`/tournament/${id}`);
  };
  return (
    <div className="Announc" onClick={goToTournament}>
      <div className="Announc__imgWrapper">
        <img
          className="img-width100"
          src={storage(gameByGameId.image)}
          alt={`картинка игры`}
        />
      </div>

      <h3 className="Text-16px-700 Announcement__nameTournamentInCard">
        {name}
      </h3>

      <section className="Announc__prize">
        <p className="Text-16px-700">
          {prize}
          <span className="Text-16px-400-Ruble">i</span>
        </p>
        <p className="Text-9px-400">Призовой фонд</p>
      </section>

      <section className="Announc__time">
        <p className="Text-9px-400">
          {moment(new Date(liveStartAt)).format("D MMMM")}
        </p>
        <p className="Text-9px-400">
          {moment(new Date(liveStartAt)).format("HH:mm")}
        </p>
      </section>

      <Link to={`/tournament/${id}`} className="commonBtn">
        ПОДРОБНЕЕ
      </Link>
    </div>
  );
};

export default Announcement;

import "./index.scss";

import React from "react";
import { Link, useHistory } from "react-router-dom";

import moment from "Common/services/moment";
import { storage } from "Common/services/functions";

import { useStore } from "Common/hooks/store";

import Place from "Common/components/Place";

function GameHistoryCard({
  players,
  id,
  name,
  place,
  teamSize,
  prize,
  slots,
  isAdmin,
  liveStartAt,
  participants,
  status,
  format,
  // game,
}) {
  const { store } = useStore();

  const { game } = store;
  const history = useHistory();

  const goToTournament = () => {
    history.push(`/tournament/${id}`);
  };

  return (
    <div className="GameHistoryCard" onClick={goToTournament}>
      <div className="GameHistoryCard__info">
        <div className="gameIconAndTextWrap">
          {
            <img
              className="GameHistoryCard__info_gameIcon"
              src={storage(game.image)}
              alt=""
            />
          }
          <h2 className="GameHistoryCard__info_text">
            {name}
            {isAdmin && (
              <div className="GameHistoryCard__info__edit">
                <img
                  className="img-width100"
                  src={require("Common/assets/svg/Admin/Edit.svg")}
                  alt="Редактировать"
                />
              </div>
            )}
          </h2>
        </div>
        <div className="GameHistoryCard__infoBlock">
          {place && <Place placeNumber={place} />}
          {format === "TEAM" ? (
            <p className="GameHistoryCard__infoBlock__teamFormat">
              {teamSize === 1 && "Solo"}
              {teamSize === 2 && "Duo"}
              {teamSize === 3 && "Trio"}
              {teamSize === 4 && "Squad"}
            </p>
          ) : (
            <p className="GameHistoryCard__infoBlock__teamFormat">Solo</p>
          )}
          <div className="GameHistoryCard__infoBlock__prize">
            <p className="Text-16px-700">
              {prize}
              <span className="Text-16px-400-Ruble"> i</span>
            </p>
            <p className="Text-9px-400">Призовой фонд</p>
          </div>
          <div className="GameHistoryCard__infoBlock__party">
            <p className="Text-16px-700">
              {players?.totalCount ? `${players.totalCount} /` : ""}{" "}
              {slots === 9999 ? "" : `${slots}`}
            </p>
            <p className="Text-9px-400">Участников</p>
          </div>
        </div>
      </div>

      <div className="GameHistoryCard__dateAndBtn">
        <div className="dateAndBtnWrap">
          <div className="dateAndBtn_data">
            {moment(liveStartAt).format("D MMMM")}
          </div>
          <div className="dateAndBtn_time">
            {moment(liveStartAt).format("HH:mm")}
          </div>
        </div>
        <div className={`GameHistoryCard__Status status${status}`}></div>
        <Link className="commonBtn comBtnTournament" to={`/tournament/${id}`}>
          ПОДРОБНЕЕ
        </Link>
      </div>
    </div>
  );
}

export default GameHistoryCard;

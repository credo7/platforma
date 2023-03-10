import "./index.scss";

import React from "react";
import { useHistory } from "react-router-dom";

import Place from "Common/components/Place";

import moment from "Common/services/moment";

function TournamentInfo({ tournament }) {
  const history = useHistory();
  const prizes = tournament?.prizes?.nodes || [];
  const description = tournament?.description;
  const rules = tournament.rules ? tournament?.rules[0] : null;

  return (
    <div className="TournamentInfo">
      {tournament.format === "TEAM" && (
        <div className="TournamentInfo__reglament">
          <h2 className="Text-14px-700">Регламент турнира</h2>
          <div
            className="btnReglament"
            onClick={() =>
              history.push({
                pathname: "/reglament/team",
                state: { tournamentId: tournament.id },
              })
            }
          >
            Ознакомиться с регламентом
          </div>
        </div>
      )}
      <div className="TournamentDetails__dates">
        <h2 className="Text-14px-700">Дата и время проведения</h2>
        <span className="TournamentDetails__registration Text-12px-500 red">
          <span>Регистрация: </span>
          <span>
            {moment(tournament.registrationStartAt).format("D MMMM HH:mm")}
          </span>
        </span>
        <span className="TournamentDetails__confirmation Text-12px-500">
          <span>Вход в лобби: </span>
          <span>
            {moment(tournament.confirmationStartAt).format("D MMMM HH:mm")}
          </span>
        </span>
        <span className="TournamentDetails__live Text-12px-500">
          <span>Старт: </span>
          <span>{moment(tournament.liveStartAt).format("D MMMM HH:mm")}</span>
        </span>
      </div>

      <div className="TournamentInfo__prizes">
        <h2 className="Text-14px-700">Призы</h2>
        <div className="TournamentInfo__prizesWrapper">
          {prizes.map((prize, idx) => {
            return (
              <div className="TournamentInfo__prizeCard" key={idx}>
                <Place placeNumber={prize.place} />
                <figure className="TournamentDetails__addition__prize">
                  <div className="TournamentDetails__addition__prizeImg">
                    <img
                      className="img-width100"
                      src={
                        require("Common/assets/svg/Tournament_details/Rub.svg")
                          .default
                      }
                      alt="Rub"
                    />
                  </div>
                  <span className="Text-18px-700">{prize.amount}</span>
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      {description && (
        <div className="TournamentDetails__about">
          <h2 className="Text-14px-700">О турнире</h2>
          <div className="TournamentDetails__textDiv Text-12px-500">
            {description}
          </div>
        </div>
      )}
      {rules && (
        <div className="TournamentDetails__ruls">
          <h2 className="Text-14px-700">Правила турнира</h2>
          <div className="TournamentDetails__textDiv Text-12px-500">
            {rules?.text}
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentInfo;

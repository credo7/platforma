import "./index.scss";

import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import GameHistoryCard from "Common/components/GameHistoryCard";

import { GET_TOURNAMENTS } from "Common/graphql/Tournaments";
import { useStore } from "Common/hooks/store";
import Anonce from "Common/pages/Tournaments/Anonce";

const TournamentsPage = () => {
  const { store } = useStore();

  const { gameId, isAdmin } = store;

  const { tabName = "anonce" } = useParams();

  const [getTournaments, { data: dataTournaments }] =
    useLazyQuery(GET_TOURNAMENTS);

  const tournaments = useMemo(
    () => dataTournaments?.tournaments?.nodes,
    [dataTournaments]
  );
  useEffect(() => {
    if (gameId && tabName && tabName !== "anonce") {
      const status =
        tabName === "upcoming"
          ? ["UPCOMING", "REGISTRATION", "CONFIRMATION"]
          : [tabName.toUpperCase()];

      getTournaments({ variables: { gameId, status } });
    }
  }, [gameId, tabName, getTournaments]);

  return (
    <>
      <div className="Tournaments">
        <header className="Tournaments__header">
          <ul className="Tournaments__tabs">
            <div className="Tournaments__search" style={{ display: "none" }}>
              <div className="Tournaments__search__imgWrapper">
                <img
                  className="img-width100"
                  src={
                    require("Common/assets/svg/General/Search_white.svg")
                      .default
                  }
                  alt="Поиск по туринрам"
                />
              </div>
              <span className="Text-10px-600">поиск</span>
            </div>

            {[
              { name: "anonce", text: "Анонс" },
              { name: "upcoming", text: "Будут" },
              { name: "live", text: "Сейчас" },
              { name: "finished", text: "Прошли" },
            ].map((tab, index) => (
              <div key={index}>
                <Link to={`/tournaments/${tab.name}`}>
                  <li
                    id={tab.name}
                    className={`Tournaments__tab${
                      tabName === tab.name ? "--selected" : ""
                    }`}
                  >
                    <div className="RoundCornerWrapperBL">
                      <div className="RoundCornerBL" />
                    </div>
                    {tab.text}
                    <div className="RoundCornerWrapperBR">
                      <div className="RoundCornerBR" />
                    </div>
                  </li>
                </Link>
              </div>
            ))}
          </ul>
        </header>

        <main className="Tournaments__container">
          <div className="Tournaments__filters">
            {/* <span className="Tournaments__filter--selected">1X1</span>
             <span className="Tournaments__filter">2X2</span>
            <span className="Tournaments__filter">3X3</span>
            <span className="Tournaments__filter">4X4</span> */}
          </div>

          {isAdmin && (
            <Link className="Team__btn" to="/admin/tournament">
              <span className="Text-16px-700">Создать турнир</span>
            </Link>
          )}

          {tabName === "anonce" ? (
            <Anonce />
          ) : (
            <div className="Tournaments__cardsWrapper">
              {tournaments?.map((tournament, index) => (
                <GameHistoryCard key={index} {...tournament} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default TournamentsPage;

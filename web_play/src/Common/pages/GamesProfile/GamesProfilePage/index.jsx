import "./index.scss";

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import GameHistoryCard from "Common/components/GameHistoryCard";

import { GET_GAME_HISTORY, GET_GAMES_PUBLISHED } from "Common/graphql/Games";
import { useQuery } from "@apollo/client";
import { useStore } from "Common/hooks/store";

const GamesProfilePage = () => {
  const { store } = useStore();

  const { gameId } = useParams();

  const { isAuth, user } = store;

  const { data: tournamentsData } = useQuery(GET_GAME_HISTORY, {
    variables: { name: gameId },
  });
  const { data: dataGames } = useQuery(GET_GAMES_PUBLISHED);

  const [tournaments, setTournaments] = useState([]);
  const [game, setGame] = useState(null);
  const [userGame, setUserGame] = useState(null);

  const games = dataGames?.games?.nodes;

  useEffect(() => {
    if (tournamentsData) {
      let tournaments = tournamentsData?.game?.tournaments.nodes;

      tournaments = tournaments?.map((item) => ({
        ...item,
        game: tournamentsData?.game,
        participants: item.players?.totalCount,
      }));

      setTournaments(tournaments);
    }
  }, [tournamentsData]);

  const handleGameChange = (e) => {
    e.preventDefault();
    // setActivePlayer
  };

  useEffect(() => {
    if (games) {
      setGame(games?.find((a) => a.id === gameId));
    }
  }, [games, gameId]);

  useEffect(() => {
    if (game) {
      // gameChange
      // fetchTournaments

      if (isAuth && user) {
        const linkedGame = user?.players?.find(
          (player) => player.gameId === game.id
        );
        setUserGame(linkedGame || null);
      }
    }
  }, [game, user, gameId, isAuth]);

  return (
    <div className="GameProfile">
      <header className="Profile__header">
        <div className="Profile__user">
          <div className="Profile__imgWrapper">
            <img
              className="ProfileIcon__img"
              src={game?.image}
              alt="Картинка игры"
            />
          </div>
        </div>

        <div className="Profile__contactAndGameStat">
          <div className="GameProfile__btnAndStat">
            <Link
              className={`commonBtn ${
                userGame?.active ? "commonBtn--disable" : ""
              }`}
              to={
                !isAuth
                  ? "/auth/login"
                  : isAuth && !userGame
                  ? "/settings/games"
                  : ""
              }
              onClick={(e) =>
                isAuth && userGame && !userGame?.active
                  ? handleGameChange(e)
                  : isAuth && userGame
                  ? e.preventDefault()
                  : null
              }
            >
              ИГРАТЬ
            </Link>
          </div>
        </div>
      </header>

      <main className="GameProfile__main">
        <div className="GameProfile__main__header">
          <ul className="GameProfile__main__tabs">
            <li className="GameProfile__main__tab--selected" id="finished">
              История
              <div className="RoundCornerWrapperBR">
                <div className="RoundCornerBR" />
              </div>
            </li>
          </ul>

          <div
            className="GameProfile__main__userMedia"
            style={{ display: "none" }}
          >
            <div className="Profile__main__imgWrapper">
              <img
                className="img-width100"
                src={require("Common/assets/svg/Social_media_icon/vk.svg")}
                alt="Страница Вконтакте пользователя"
              />
            </div>
            <div className="Profile__main__imgWrapper">
              <img
                className="img-width100"
                src={require("Common/assets/svg/Social_media_icon/facebook.svg")}
                alt="Страница фейсбук пользователя"
              />
            </div>
            <div className="Profile__main__imgWrapper">
              <img
                className="img-width100"
                src={require("Common/assets/svg/Social_media_icon/instagram.svg")}
                alt="Инстаграм пользователя"
              />
            </div>
          </div>
        </div>

        <div className="GameProfile__main__content">
          {tournaments?.map((tournament, index) => (
            <GameHistoryCard key={index} {...tournament} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GamesProfilePage;

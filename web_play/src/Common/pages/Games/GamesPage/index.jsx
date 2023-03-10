import "./index.scss";

import React from "react";

import { GET_GAMES_PUBLISHED } from "Common/graphql/Games";
import { GET_USER, UPDATE_USER_GAMEID } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";

import { storage } from "Common/services/functions";

const Games = () => {
  const history = useHistory();
  const { store } = useStore();

  const { userId, gameId } = store;

  const { data: dataGames } = useQuery(GET_GAMES_PUBLISHED);
  const games = dataGames?.games?.nodes;

  const [updateUserGameId] = useMutation(UPDATE_USER_GAMEID, {
    refetchQueries: [{ query: GET_USER, variables: { userId } }],
  });

  const handlerGame = (id) => {
    updateUserGameId({ variables: { userId, gameId: id } });
    history.push("/");
  };

  return (
    <div className="GamesPage">
      <div className="GamesPage__title">Выберите игру:</div>
      <div className="GamesCatalog">
        {games?.map((game, index) => (
          <div
            key={index}
            className={`GamesCatalog__imgWrapper ${
              game.id === gameId ? "current" : ""
            }`}
            to={`/games/${game.id}`}
            onClick={() => handlerGame(game.id)}
          >
            <img
              className={`img-width100 `}
              src={storage(game.image)}
              alt={`${game.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;

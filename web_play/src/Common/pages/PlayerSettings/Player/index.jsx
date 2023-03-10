import "./index.scss";

import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "Common/components/Toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  GET_PLAYER,
  CREATE_PLAYER,
  UPDATE_PLAYER_USERNAME,
} from "Common/graphql/Players";
import { CREATE_USERS_RATINGS } from "Common/graphql/PlayersRatings";

import { useStore } from "Common/hooks/store";
import { GET_USER } from "Common/graphql/Users";

const initialValues = {
  username: "",
};

// yup
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Впишите ник")
    .min(3, "Введите не менее 3 символов")
    .max(20, "Введите не более 20 символов"),
});

const PlayerTab = () => {
  const { store } = useStore();

  const history = useHistory();

  const { gameId, userId } = store;

  const [getPlayer, { data: dataPlayer }] = useLazyQuery(GET_PLAYER);
  const player = useMemo(
    () => dataPlayer?.playerByGameIdAndUserId,
    [dataPlayer]
  );

  const refetchQueries = [
    { query: GET_PLAYER, variables: { gameId, userId } },
    { query: GET_USER, variables: { userId } },
  ];

  const [updatePlayer, { error: errorUpdatePlayer }] = useMutation(
    UPDATE_PLAYER_USERNAME,
    { refetchQueries }
  );

  const [createPlayer, { data: dataCreatePlayer }] = useMutation(
    CREATE_PLAYER,
    { refetchQueries }
  );
  const newPlayerId = useMemo(
    () => dataCreatePlayer?.createPlayer?.player?.id,
    [dataCreatePlayer]
  );

  const [createPlayersRatings] = useMutation(CREATE_USERS_RATINGS);

  // --------------------------------------------------------------------------
  const onSubmit = () => {
    if (player) {
      updatePlayer({
        variables: {
          gameId,
          userId,
          username: values.username,
          tag: values.username,
        },
      });

      toast("Сохранено");
    } else {
      createPlayer({
        variables: {
          gameId,
          userId,
          username: values.username,
          tag: values.username,
        },
      });
    }
  };

  const { handleSubmit, handleChange, values, errors, setValues } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (gameId && userId) {
      getPlayer({ variables: { gameId, userId } });
    }
  }, [gameId, userId, getPlayer]);

  useEffect(() => {
    if (player) {
      setValues((prev) => ({ ...prev, ...player }));
    }
  }, [player, setValues]);

  useEffect(() => {
    if (dataCreatePlayer && newPlayerId && gameId) {
      createPlayersRatings({
        variables: { gameId, playerId: newPlayerId, elo: 1000 },
      });

      toast("Сохранено");

      setTimeout(() => {
        const pathFrom = history.location.state?.from;

        if (values.username !== "" && pathFrom) {
          history.push(pathFrom);
        }
      }, 2000);
    }
  }, [
    gameId,
    dataCreatePlayer,
    newPlayerId,
    createPlayersRatings,
    history,
    values.username,
  ]);

  /* проверка уникальности username в players */
  useEffect(() => {
    if (
      errorUpdatePlayer &&
      errorUpdatePlayer.message?.indexOf("players_username") !== -1
    ) {
      toast("такой ник уже существует");
    }
  }, [errorUpdatePlayer]);

  // --------------------------------------------------------------------------
  return (
    <>
      <form className="Settings__gamesTab" onSubmit={handleSubmit}>
        <p className="Settings__gameSign">Профиль игрока</p>
        <div className="Settings__gameSign Settings__gameSign_text">
          (укажите НИК, который используете в игре)
        </div>

        {errors?.username && (
          <div className="Settings__error">{errors.username}</div>
        )}
        <div className="Settings__idInputWrapper">
          <input
            name="username"
            type="text"
            className="Settings__input"
            placeholder="игровой ник"
            value={values.username}
            onChange={handleChange}
          />
        </div>

        <button className="Settings__button" type="submit">
          Сохранить изменения
        </button>
      </form>
    </>
  );
};

export default PlayerTab;

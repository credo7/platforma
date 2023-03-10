import "./index.scss";

import React, { createRef, useEffect, useState } from "react";
import moment from "moment";
import { useFormik } from "formik";
import { BsCloudUpload } from "react-icons/bs";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "Common/components/Toastify";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import DropSelect from "Common/assets/svg/General/Drop_select.svg";

import ProfileIcon from "Common/components/ProfileIcon";

import { GET_GAMES_PUBLISHED } from "Common/graphql/Games";
import {
  CREATE_TOURNAMENT,
  DELETE_TOURNAMENT,
  GET_TOURNAMENT,
  UPDATE_TOURNAMENT,
} from "Common/graphql/Tournaments";

import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

import TournamentPrizes from "../TournamentPrizes";

const formatDate = (date, format = "") => {
  return moment(date, format).format("YYYY-MM-DDTHH:mm");
};

const stringDate = (date) => {
  return new Date(date).toISOString();
};

const initialValues = {
  name: "CUP#",
  image: null,
  format: "SOLO",
  gameId: "pubg_mobile",
  prize: "1000",
  prizeCurrency: "RUB",
  description: "",
  rulesDescription: "Правила турнира будут описаны позже",
  viewSlots: true,
  currency: "paid",
  cost: 0,
  teamSize: 1,
  registrationStartAt: formatDate("12:00", "HH:mm"),
  confirmationStartAt: formatDate("18:45", "HH:mm"),
  liveStartAt: formatDate("19:00", "HH:mm"),
  slots: 8,
  premium: false,
  isPaidTournament: false,
};

const AdminTournamentPage = () => {
  const { store } = useStore();

  const history = useHistory();
  const { tournamentId: tId } = useParams();

  const tournamentId = tId;

  const { gameId } = store;

  const [getTournament, { data: dataTournament }] =
    useLazyQuery(GET_TOURNAMENT);

  const [tournament, setTournament] = useState();

  const [createTournament, { data: dataCreateTournament }] =
    useMutation(CREATE_TOURNAMENT);

  const [updateTournament, { data: dataUpdateTournament }] =
    useMutation(UPDATE_TOURNAMENT);

  const [deleteTournament] = useMutation(DELETE_TOURNAMENT);

  const { data: dataGames } = useQuery(GET_GAMES_PUBLISHED);

  const games = dataGames?.games?.nodes;

  const inputImage = createRef();

  useEffect(() => {
    if (tournamentId && gameId)
      getTournament({
        variables: { tournamentId, gameId },
      });
  }, [tournamentId, gameId, getTournament]);

  const onSubmit = (data) => {
    let cup = {
      gameId: data.gameId,
      name: data.name,
      status: tournament?.status || "UPCOMING",
      slots: parseInt(data.slots, 10),
      registrationStartAt: stringDate(data.registrationStartAt),
      confirmationStartAt: stringDate(data.confirmationStartAt),
      confirmationEndAt: stringDate(data.liveStartAt),
      liveStartAt: stringDate(data.liveStartAt),
      liveEndAt: stringDate(data.liveStartAt),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cost: parseInt(data.cost, 10),
      format: data.format,
      description: data.description,
      paid: data.currency === "paid",
      premium: data.premium,
      prize: data.prize,
      prizeCurrency: data.prizeCurrency,
      registrationOpen: false,
      seedCreated: false,
      teamSize: parseInt(data.teamSize, 10),
      viewSlots: data.viewSlots,
      vpaid: data.currency === "vpaid",
    };

    if (data.image instanceof File) {
      cup = { ...cup, image: data.image };
    }

    if (!tournament) {
      createTournament({
        variables: { input: { tournament: cup } },
        context: { hasUpload: true },
      });
    } else {
      updateTournament({
        variables: {
          input: { id: tournamentId, tournamentPatch: cup },
        },
        context: { hasUpload: true },
      });
    }
  };

  const { handleSubmit, handleChange, values, setValues } = useFormik({
    initialValues,
    onSubmit,
  });

  const onImageChange = (e) => {
    inputImage.current.click();
  };

  const onFileInputChange = (event) => {
    let file = event.target.files[0];

    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
    }
  };

  const handleDelete = () => {
    let isDel = window.confirm("Вы уверены?");
    if (isDel) {
      deleteTournament({ variables: { id: tournament.id } });
      history.push("/tournaments");
    }
  };

  useEffect(() => {
    if (dataTournament) {
      let cup = dataTournament.tournamentById;
      if (cup) {
        cup = {
          ...initialValues,
          ...cup,
          isPaidTournament: !!cup.cost,
        };

        setValues(cup);
        setTournament(cup);
      }
    }
  }, [dataTournament, setValues, setTournament]);

  useEffect(() => {
    if (dataCreateTournament) {
      const newTId = dataCreateTournament.createTournament.tournament.id;
      if (newTId) {
        toast("Турнир создан");
        history.push(`/admin/tournament/${newTId}#prizes`);
      }
    }
  }, [dataCreateTournament, history]);

  useEffect(() => {
    if (dataUpdateTournament) {
      toast("Турнир обновлён");
    }
  }, [dataUpdateTournament]);

  return (
    <div className="CreateTournament">
      <div className="CreateTournament__wrapper">
        <h3 align="center">Создать турнир</h3>
        <form
          id="tournament"
          className="CreateTournament__form"
          onSubmit={handleSubmit}
        >
          <div className="IconEdit__wrapper">
            <div className="IconEdit">
              <div>Картинка Анонс</div>

              <div className="IconEdit__icon1">
                <ProfileIcon
                  src={
                    tournament?.image
                      ? storage(tournament?.image, "m")
                      : values.image
                  }
                  width={200}
                  height={100}
                />
                <div className="IconEdit__buttons">
                  <BsCloudUpload size="2em" onClick={onImageChange} />
                </div>
              </div>
            </div>

            <input
              name="image"
              className="IconEdit__input"
              type="file"
              ref={inputImage}
              accept="image/*"
              onInput={onFileInputChange}
            />
            <div>Размер меньше 1 Мб.</div>
          </div>

          <div
            className="CreateTournament__form__group"
            style={{ width: "258px" }}
          >
            <p className="CreateTournament__topic Text-12px-700">Тип игры</p>
            <div className="CreateTournament__form__selectWrap">
              <select
                name="gameId"
                className="CreateTournament__form__select--wide"
                value={values.gameId}
                onChange={handleChange}
              >
                {games &&
                  games.map((game, index) => (
                    <option key={index} value={game.name}>
                      {game.name}
                    </option>
                  ))}
              </select>
              <div className="CreateTournament__form__selectIngWrap">
                <div className="CreateTournament__form__selectImg">
                  <img
                    className="img-width100"
                    src={DropSelect}
                    alt="Открыть список"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="CreateTournament__form__group"
            style={{ width: "258px" }}
          >
            <p className="CreateTournament__topic Text-12px-700">
              Формат турнира
            </p>
            <div className="CreateTournament__form__selectWrap">
              <select
                name="format"
                className="CreateTournament__form__select--wide"
                value={values.format}
                onChange={handleChange}
              >
                <option value="SOLO">SOLO</option>
                <option value="TEAM">TEAM</option>
              </select>
              <div className="CreateTournament__form__selectIngWrap">
                <div className="CreateTournament__form__selectImg">
                  <img
                    className="img-width100"
                    src={DropSelect}
                    alt="Открыть список"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="CreateTournament__form__group">
            <p className="CreateTournament__topic Text-12px-700">
              Название турнира (не более 20 символов)
            </p>
            <input
              name="name"
              className="Settings__input"
              placeholder="Название турнира"
              maxLength="20"
              type="text"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="CreateTournament__form__group">
            <div className="CreateTournament__form__group">
              <input
                id="premiumTournament"
                className="AuthForm__checkbox"
                name="premium"
                type="checkbox"
                checked={values.premium}
                onChange={handleChange}
              />
              <label
                className="CreateTournament__label Text-12px-400"
                htmlFor="premiumTournament"
              >
                Премиум турнир
              </label>
            </div>

            <div className="CreateTournament__form__group--marginSmall">
              <input
                id="showParticipants"
                className="AuthForm__checkbox"
                name="viewSlots"
                type="checkbox"
                checked={values.viewSlots}
                onChange={handleChange}
              />
              <label
                className="CreateTournament__label Text-12px-400"
                htmlFor="showParticipants"
              >
                Показывать участников
              </label>
            </div>

            <div className="CreateTournament__form__group--marginSmall">
              <input
                id="paidTournament"
                className="AuthForm__checkbox"
                name="isPaidTournament"
                type="checkbox"
                checked={values.isPaidTournament}
                onChange={handleChange}
              />
              <label
                className="CreateTournament__label Text-12px-400"
                htmlFor="paidTournament"
              >
                Платный турнир
              </label>
            </div>
          </div>

          {values.isPaidTournament && (
            <>
              <div
                className="CreateTournament__form__group"
                style={{ width: "99px" }}
              >
                <p
                  className="CreateTournament__topic Text-12px-700"
                  style={{ width: "200px" }}
                >
                  Валюта
                </p>
                <div className="CreateTournament__form__selectWrap">
                  <select
                    name="currency"
                    className="CreateTournament__form__select"
                    value={values.currency}
                    onChange={handleChange}
                  >
                    <option value="paid">paid</option>
                    <option value="vpaid">vpaid</option>
                  </select>
                  <div className="CreateTournament__form__selectIngWrap">
                    <div className="CreateTournament__form__selectImg">
                      <img
                        className="img-width100"
                        src={DropSelect}
                        alt="Открыть список"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="CreateTournament__form__group">
                <p className="CreateTournament__topic Text-12px-700">
                  Регистрационный взнос
                </p>
                <input
                  className="Settings__input"
                  name="cost"
                  placeholder="Название турнира"
                  type="text"
                  value={values.cost}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div
            className="CreateTournament__form__group"
            style={{ width: "99px" }}
          >
            <p
              className="CreateTournament__topic Text-12px-700"
              style={{ width: "200px" }}
            >
              Размер турнира
            </p>
            <div className="CreateTournament__form__selectWrap">
              <select
                className="CreateTournament__form__select"
                name="slots"
                value={values.slots}
                onChange={handleChange}
              >
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="25">30</option>
                <option value="32">32</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
                <option value="60">60</option>
                <option value="64">64</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="85">85</option>
                <option value="90">90</option>
                <option value="95">95</option>
                <option value="100">100</option>
                <option value="128">128</option>
                <option value="256">256</option>
              </select>
              <div className="CreateTournament__form__selectIngWrap">
                <div className="CreateTournament__form__selectImg">
                  <img
                    className="img-width100"
                    src={DropSelect}
                    alt="Открыть список"
                  />
                </div>
              </div>
            </div>
          </div>

          {values.format === "TEAM" && (
            <div
              className="CreateTournament__form__group"
              style={{ width: "99px" }}
            >
              <p
                className="CreateTournament__topic Text-12px-700"
                style={{ width: "200px" }}
              >
                Размер команды
              </p>
              <div className="CreateTournament__form__selectWrap">
                <select
                  name="teamSize"
                  className="CreateTournament__form__select"
                  value={values.teamSize}
                  onChange={handleChange}
                >
                  <option value="1">Solo</option>
                  <option value="2">Duo</option>
                  <option value="3">Trio</option>
                  <option value="4">Squad</option>
                </select>
                <div className="CreateTournament__form__selectIngWrap">
                  <div className="CreateTournament__form__selectImg">
                    <img
                      className="img-width100"
                      src={DropSelect}
                      alt="Открыть список"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="CreateTournament__form__group">
            <p className="CreateTournament__topic Text-12px-700">
              Начало регистрации
            </p>
            <input
              name="registrationStartAt"
              className="Settings__input"
              type="datetime-local"
              value={formatDate(values.registrationStartAt)}
              onChange={handleChange}
            />
          </div>

          <div className="CreateTournament__form__group">
            <p className="CreateTournament__topic Text-12px-700">
              Начало подтверждения (лобби)
            </p>
            <input
              name="confirmationStartAt"
              className="Settings__input"
              type="datetime-local"
              value={formatDate(values.confirmationStartAt)}
              onChange={handleChange}
            />
          </div>

          <div className="CreateTournament__form__group">
            <p className="CreateTournament__topic Text-12px-700">
              Старт турнира
            </p>
            <input
              name="liveStartAt"
              className="Settings__input"
              type="datetime-local"
              value={formatDate(values.liveStartAt)}
              onChange={handleChange}
            />
          </div>

          <div className="Settings__textareaWrapper">
            <p className="CreateTournament__topic Text-12px-700">
              Описание турнира
            </p>
            <textarea
              name="description"
              type="text"
              className="CreateTournament__form__textarea"
              placeholder="Информация из лобби (карта, от какого лица игра и т.д)"
              value={values.description}
              onChange={handleChange}
            />
          </div>

          {/* --- правила турнира ----- */}
          {/* <div className="Settings__textareaWrapper">
            <p className="CreateTournament__topic Text-12px-700">
              Правила турнира
            </p>
            <textarea
              name="rulesDescription"
              type="text"
              className="CreateTournament__form__textarea"
              value={values.rulesDescription}
              onChange={handleChange}
            />
          </div> */}

          <div className="CreateTournament__form__group">
            <p className="CreateTournament__topic Text-12px-700">
              Призовой фонд
            </p>
            <input
              name="prize"
              className="Settings__input"
              type="text"
              value={values.prize}
              onChange={handleChange}
            />
          </div>

          <button
            className="CreateTournament__form__btn commonBtn"
            type="submit"
          >
            {tournament ? "Обновить" : "Создать"}
          </button>

          {tournament && (
            <div
              className="CreateTournament__form__btn commonBtn"
              onClick={handleDelete}
            >
              Удалить
            </div>
          )}
        </form>
        <br />

        <div>
          <TournamentPrizes tournament={tournament} />
        </div>

        <br />
        {tournament && (
          <div className="CreateTournament__wrapperAdminAction">
            <Link
              to={`/tournament/${tournament?.id}`}
              className="TournamentDetails__adminAction commonBtn"
            >
              Перейти в турнир
            </Link>
            <br />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournamentPage;

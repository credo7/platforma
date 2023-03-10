import "./index.scss";

import React, { useEffect, createRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CountryDropdown } from "react-country-region-selector";
import { toast } from "Common/components/Toastify";

import { BsCloudUpload } from "react-icons/bs";

import ProfileIcon from "Common/components/ProfileIcon";
import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

import {
  GET_TEAM_BY_OWNER,
  UPDATE_TEAM_BY_OWNER,
  CREATE_TEAM_BY_OWNER,
} from "Common/graphql/Teams";
import { GET_TEAMS_PLAYERS } from "Common/graphql/TeamsPlayers";
import {
  CREATE_TEAMS_RATING,
  GET_RATING_TEAMS,
} from "Common/graphql/TeamsRatings";
import { GET_USER } from "Common/graphql/Users";

const TeamSettingsInfo = ({ team }) => {
  const { store } = useStore();

  const { gameId, userId } = store;
  const history = useHistory();

  const inputImage = createRef();

  const refetchQueries = gameId &&
    userId && [
      { query: GET_TEAM_BY_OWNER, variables: { gameId, ownerId: userId } },
      { query: GET_USER, variables: { userId } },
      { query: GET_RATING_TEAMS, variables: { gameId } },
    ];

  const [updateTeamByOwner, { data: dataUdate, error: errorUpdate }] =
    useMutation(UPDATE_TEAM_BY_OWNER, {
      refetchQueries,
    });
  const updatedTeam = dataUdate?.updateTeamByGameIdAndOwnerId;

  const [
    createTeamByOwner,
    { data: dataCreateTeamByOwner, error: errorCreate },
  ] = useMutation(CREATE_TEAM_BY_OWNER, { refetchQueries });

  const [createTeamsRating] = useMutation(CREATE_TEAMS_RATING);

  const [getTeamsPlayers, { data: dataTeamPlayers }] =
    useLazyQuery(GET_TEAMS_PLAYERS);
  const teamPlayers = dataTeamPlayers?.allTeamsPlayers.nodes;

  const [errors, setErrors] = useState();

  const initialValues = {
    name: "",
    // shortName: "",
    country: "",
    // description: "",
    captainId: "-",
    image: null,
  };

  // check name
  useEffect(() => {
    if (errorUpdate || errorCreate) {
      if (
        errorUpdate?.message?.indexOf("teams_name_uniq") !== -1 ||
        errorCreate?.message?.indexOf("teams_name_uniq") !== -1
      ) {
        setErrors("Такое название команды уже существует!");
      }
    }
  }, [errorUpdate, errorCreate]);

  useEffect(() => {
    if (dataUdate && updatedTeam !== null) {
      setErrors();
      toast("Команда сохранена");
      history.push("/team/settings/players");
    }
  }, [dataUdate, updatedTeam, history]);

  useEffect(() => {
    if (dataCreateTeamByOwner && !errorCreate) {
      setErrors();
      toast("Команда сохранена");
      history.push("/team/settings/players");
    }
  }, [dataCreateTeamByOwner, errorCreate, history]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Ведите название команды"),
  });

  const onSubmit = (data) => {
    const teamPatch = { ...data };
    delete teamPatch.__typename;

    if (!(teamPatch.image instanceof File)) {
      delete teamPatch.image;
    }

    if (teamPatch.captainId === "-") {
      teamPatch.captainId = null;
    }

    if (team) {
      updateTeamByOwner({
        variables: { gameId, ownerId: userId, teamPatch },
        refetchQueries,
        context: { hasUpload: true },
      });
    } else {
      const teamInput = { ...teamPatch, gameId, ownerId: userId };

      createTeamByOwner({
        variables: { team: teamInput },
        refetchQueries,
        context: { hasUpload: true },
      });
    }
  };

  const onImageChange = (e) => {
    inputImage.current.click();
  };

  const onFileInputChange = (event) => {
    let file = event.target.files[0];

    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
    }
  };

  const { handleSubmit, handleChange, values, setValues, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    if (team) {
      getTeamsPlayers({ variables: { teamId: team.id } });
    }
  }, [team, getTeamsPlayers]);

  useEffect(() => {
    if (dataCreateTeamByOwner) {
      const newTeamId = dataCreateTeamByOwner.createTeam?.team?.id;
      if (newTeamId && gameId) {
        createTeamsRating({ variables: { teamId: newTeamId, gameId } });
      }
    }
  }, [dataCreateTeamByOwner, gameId, createTeamsRating]);

  useEffect(() => {
    if (team) {
      setValues(team);
    }
  }, [team, setValues]);

  return (
    <div className="TeamSettingsInfo">
      <form id="teamForm" onSubmit={handleSubmit}>
        <center>
          <div className="IconEdit">
            <div className="IconEdit__icon1">
              <ProfileIcon
                src={
                  (values &&
                    (values.image instanceof File
                      ? values.image
                      : storage(values.image, "m"))) ||
                  require("Common/assets/png/ProfileIcon.png").default
                }
                width={100}
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
        </center>
        <hr />
        {errors && <div className="TeamSettingsInfo__errorText">{errors}</div>}
        <input
          name="name"
          type="text"
          className="Settings__input"
          placeholder="Название команды"
          onChange={handleChange}
          value={values.name}
        />

        {/* --- поуказанию эти поля убрали --- */}
        {/* <input
          name="shortName"
          type="text"
          className="Settings__input"
          placeholder="Тег"
          onChange={handleChange}
          value={values.shortName}
        />
        <input
          name="description"
          type="text"
          className="Settings__input"
          placeholder="Описание"
          onChange={handleChange}
          value={values.description}
        /> */}
        <CountryDropdown
          className="Settings__input"
          value={values.country}
          valueType="short"
          onChange={(val) => setFieldValue("country", val)}
          defaultOptionLabel="Выберете страну"
          priorityOptions={["RU"]}
          blacklist={[
            "CD",
            "SH",
            "GS",
            "KP",
            "UM",
            "TF",
          ]} /* слишком длинные названия, сильно расширяли список */
          style={{
            fontSize: "16px",
          }}
        />
        <p className="TeamSettingsInfo__text">Выбрать капитана:</p>
        {teamPlayers?.length <= 0 || !teamPlayers ? (
          <div className="TeamSettingsPlayers__discription">
            Когда в команде появятся игроки, здесь можно будет выбрать капитана.
          </div>
        ) : (
          <select
            name="captainId"
            className="Settings__input"
            value={values.captainId || userId}
            placeholder="Капитан"
            onChange={handleChange}
          >
            <option values={"-"}>-</option>
            {teamPlayers?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.player.username}
              </option>
            ))}
          </select>
        )}

        <button className="Settings__button--withMargenTop" type="submit">
          {team ? "Сохранить изменения" : "Создать команду"}
        </button>
      </form>
    </div>
  );
};

export default TeamSettingsInfo;

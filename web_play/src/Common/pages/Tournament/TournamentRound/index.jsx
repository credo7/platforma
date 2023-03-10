import "./index.scss";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLazyQuery, useMutation } from "@apollo/client";

import moment from "Common/services/moment";
import { useStore } from "Common/hooks/store";

import {
  GET_ROUND,
  CREATE_ROUND,
  UPDATE_ROUND,
} from "Common/graphql/TournamentsRounds";
import { toast } from "Common/components/Toastify";

// initialValues
const initialValues = {
  lobbyName: "",
  lobbyPassword: "",
};

// validationSchema
const validationSchema = Yup.object().shape({
  lobbyName: Yup.string().nullable().required("Впишите название"),
  lobbyPassword: Yup.string().nullable().required("Впишите пароль"),
});

const TournamentRound = ({ tournament }) => {
  const { store } = useStore();

  // get state
  const { isAdmin } = store;

  const tournamentId = tournament.id;

  // query getRound
  const [getRound, { data: dataRound }] = useLazyQuery(GET_ROUND);
  const round = dataRound?.tournamentsRoundByTournamentId;

  // mutation
  const [createRound] = useMutation(CREATE_ROUND);
  const [updateRound] = useMutation(UPDATE_ROUND);

  // save
  const onSubmit = (data) => {
    // refetchQueries
    const refetchQueries = [{ query: GET_ROUND, variables: { tournamentId } }];

    if (round) {
      const tournamentsRoundPatch = { ...data };
      delete tournamentsRoundPatch.__typename;

      updateRound({
        variables: {
          tournamentId,
          tournamentsRoundPatch,
        },
        refetchQueries,
      });
    } else {
      createRound({
        variables: { tournamentsRound: { tournamentId, ...data } },
        refetchQueries,
      });
    }
    toast("Сохранено");
  };

  // formik
  const { handleSubmit, handleChange, values, errors, setValues } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // getRound
  useEffect(() => {
    if (tournamentId) {
      getRound({ variables: { tournamentId } });
    }
  }, [tournamentId, getRound]);

  // after getRound
  useEffect(() => {
    if (dataRound && round) {
      setValues((prev) => ({ ...prev, ...round }));
    }
  }, [dataRound, round, tournamentId, setValues]);

  return (
    <div className="TournamentRound">
      {isAdmin && (
        <form id="tournamentRound" onSubmit={handleSubmit}>
          <div className="TournamentRound__round_wrap">
            <p className="TournamentRound__round">
              Название или ID лобби:
              <br />
              <input
                name="lobbyName"
                value={values.lobbyName}
                onChange={handleChange}
              />
              <br />
              <sub>{errors.lobbyName}</sub>
            </p>
            <p className="TournamentRound__round">
              Пароль лобби:
              <br />
              <input
                name="lobbyPassword"
                value={values.lobbyPassword}
                onChange={handleChange}
              />
              <br />
              <sub>{errors.lobbyPassword}</sub>
            </p>
            <p className="TournamentRound__round">
              <button
                className={"TournamentRound__round__btn commonBtn "}
                type="submit"
              >
                Сохранить
              </button>
            </p>
          </div>
        </form>
      )}

      {isAdmin || tournament.status === "CONFIRMATION" ? (
        <div className="TournamentRound__round_wrap2">
          <div className="TournamentRound__round">
            Название или ID лобби
            <div className="TournamentRound__round_text">
              {round?.lobbyName}
            </div>
          </div>

          <div className="TournamentRound__round">
            Пароль лобби
            <div className="TournamentRound__round_text">
              {round?.lobbyPassword}
            </div>
          </div>
        </div>
      ) : (
        <div className="TournamentRound__round_wrap2">
          <div className="TournamentRound__round">
            ID и пароль появяться
            <div className="TournamentRound__round_text">
              {moment(tournament.confirmationStartAt).format("D MMMM HH:mm")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentRound;

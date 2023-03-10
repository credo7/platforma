import "./index.scss";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { useStore } from "Common/hooks/store";

const TournamentSearch = ({
  tournament,
  tournamentParty,
  tournamentSearch,
  setTournamentSearch,
}) => {
  // const {store} = useStore();

  const onSubmit = ({ nick }) => {
    if (tournament.format === "TEAM") {
      const party = tournamentParty?.filter(({ team }) =>
        team.players.nodes.find(({ user }) =>
          user.players.nodes.find(
            ({ username }) =>
              username.toLowerCase().indexOf(nick.toLowerCase()) !== -1
          )
        )
      );

      setTournamentSearch(party);
    }

    if (tournament.format === "SOLO") {
      const party = tournamentParty.filter(
        (item) => item.name.toLowerCase().indexOf(nick.toLowerCase()) !== -1
      );

      setTournamentSearch(party);
    }
  };

  const onReset = () => {
    if (tournamentSearch) {
      setTournamentSearch();
      resetForm();
    }
  };

  const { handleSubmit, handleChange, values, errors, resetForm } = useFormik({
    initialValues: {
      nick: "",
    },
    validationSchema: Yup.object().shape({
      nick: Yup.string().required("Впишите НИК"),
    }),
    onSubmit,
  });

  return (
    <form className="TournametSearch__form" onSubmit={handleSubmit}>
      <div className="TournametSearch__field">
        <input
          className={
            errors?.nick
              ? "TournametSearch__input--error"
              : "TournametSearch__input"
          }
          type="text"
          name="nick"
          onChange={handleChange}
          value={values.nick}
          placeholder={errors?.nick || "Игровой НИК"}
        />
      </div>

      <div className="TournametSearch__field">
        <button className="TournametSearch__btn" type="submit">
          найти
        </button>
      </div>

      <div className="TournametSearch__field">
        <button
          className={
            tournamentSearch
              ? "TournametSearch__btn"
              : "TournametSearch__btn--disabled"
          }
          type="button"
          onClick={onReset}
        >
          сброс
        </button>
      </div>
    </form>
  );
};

export default TournamentSearch;

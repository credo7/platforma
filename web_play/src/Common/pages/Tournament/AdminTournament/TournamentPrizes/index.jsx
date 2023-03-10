import "./index.scss";

import React from "react";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";

import {
  CREATE_PRIZE,
  DELETE_PRIZE,
  UPDATE_PRIZE,
} from "Common/graphql/TournamentsPrizes";
import { GET_TOURNAMENT } from "Common/graphql/Tournaments";

const initialValues = {
  place: 1,
  to: "",
  amount: 100,
  points: 0,
};

const TournamentPrizes = ({ tournament }) => {
  const prizes = tournament?.prizes.nodes;
  const tournamentId = tournament?.id;

  const refetchQueries = [
    { query: GET_TOURNAMENT, variables: { tournamentId } },
  ];

  const [createPrize] = useMutation(CREATE_PRIZE, { refetchQueries });
  const [updatePrize] = useMutation(UPDATE_PRIZE, { refetchQueries });
  const [deletePrize] = useMutation(DELETE_PRIZE, { refetchQueries });

  const mergePrice = (data, place) => {
    const prize = prizes.find((item) => item.place === place);
    const tournamentsPrize = {
      tournamentId: tournament.id,
      currency: tournament.prizeCurrency,
      place,
      amount: data.amount,
      points: data.points,
    };

    if (prize) {
      updatePrize({
        variables: {
          input: {
            id: prize.id,
            tournamentsPrizePatch: tournamentsPrize,
          },
        },
      });
    } else {
      createPrize({ variables: { input: { tournamentsPrize } } });
    }
  };

  const onSubmit = (data) => {
    if (data.place <= 0) return;

    let to = Number(data.to) > data.place ? data.to : data.place;
    for (var place = data.place; place <= to; place++) {
      mergePrice(data, place);
    }
  };

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    // validationSchema,
    onSubmit,
  });

  const delExtraPrize = (e, id) => {
    deletePrize({ variables: { input: { id } } });
  };

  return !tournament ? (
    <>Призы нужно указать после добавления...</>
  ) : (
    <>
      <div align="center">Призы</div>
      <br />
      <form id="formPrizes" onSubmit={handleSubmit}>
        {errors.place && <p className="txt-red">{errors.place}</p>}
        {errors.to && <p className="txt-red">{errors.to}</p>}
        {errors.amount && <p className="txt-red">{errors.amount}</p>}
        {errors.points && <p className="txt-red">{errors.points}</p>}

        <div className="PrizesForm">
          <div className="PrizesForm__title">Место</div>
          <div className="Prizes__row">
            <div label="place">
              <span className="Prizes__row_text">c</span>
              <input
                name="place"
                className="Prizes__input"
                type="number"
                value={values.place}
                onChange={handleChange}
                placeholder="place"
              />
            </div>
            <div label="to">
              <span className="Prizes__row_text">по</span>

              <input
                name="to"
                className="Prizes__input"
                type="number"
                value={values.to}
                onChange={handleChange}
                placeholder="to"
              />
            </div>
          </div>
          <div className="Prizes__row">
            <div className="Prizes__col_money" label="amount">
              <span className="Prizes__row_title">Сумма</span>
              <br />
              <span className="Prizes__row_text"></span>
              <input
                name="amount"
                className="Prizes__input"
                type="number"
                value={values.amount}
                onChange={handleChange}
                placeholder="amount"
              />
            </div>

            <div className="Prizes__col_money" label="Fantiki">
              <span className="Prizes__row_title">Поинты</span>
              <br />
              <span className="Prizes__row_text"></span>
              <input
                name="points"
                className="Prizes__input"
                type="number"
                value={values.points}
                onChange={handleChange}
                placeholder="points"
              />
            </div>
          </div>
          <div>
            <button className="commonBtn" intent="success" type="submit">
              Сохранить
            </button>
          </div>
        </div>
      </form>

      <br />
      <table align="center">
        <thead>
          <tr>
            <th>место | </th>
            <th>сумма |</th>
            <th>поинты</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {prizes.slice().map((p, index) => (
            <tr key={index} className="">
              <td className="">{p.place}</td>
              <td className="">{p.amount}</td>
              <td className="">{p.points}</td>
              {/* <td className="">
                  <img src={p.valuessImage} alt="prize" />
                </td> */}
              <td>
                <button
                  className="pointer"
                  onClick={(e) => delExtraPrize(e, p.id)}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TournamentPrizes;

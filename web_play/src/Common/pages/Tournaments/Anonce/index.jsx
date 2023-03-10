import "./index.scss";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import Announcement from "Common/pages/Tournaments/Announcement";
// import Tariff from "app/pages/Anonce/Tariff";
import BigLogo from "Common/components/BigLogo";

import { GET_ANONCES } from "Common/graphql/Tournaments";

import { storage } from "Common/services/functions";

const Anonce = () => {
  const [getAnonces, { data: dataAnonces }] = useLazyQuery(GET_ANONCES);

  const anonces = dataAnonces?.allTournaments?.nodes;
  const imgTournament = dataAnonces?.allTournaments?.nodes[0]?.image;

  useEffect(() => {
    getAnonces({ variables: { status: "UPCOMING", first: 5 } });
  }, [getAnonces]);

  return (
    <div className="Anonce">
      {/* <BigLogo size={{ width: "194px", height: "80px" }} /> */}

      <header className="Anonce__header">
        {/* <h2 className="Anonce__h2">Анонс</h2> */}
        {imgTournament && (
          <img
            className="afisha"
            src={storage(imgTournament, "o")}
            alt="афиша турнира"
          />
        )}
      </header>
      {/* Anonce */}
      <div className="Anonce__section">
        {anonces?.length > 0 ? (
          <h2 className="Anonce__h2">Скоро</h2>
        ) : (
          <div className="Anonce__message">
            <h3>Новых турниров пока не запланировано</h3>
            <Link className="Anonce__message_link" to="/tournaments">
              посмотреть турниры, на которые открыта регистрация
            </Link>
          </div>
        )}

        <div className="Anonce__announc">
          {anonces?.map((tournament, index) => (
            <Announcement key={index} {...tournament} />
          ))}
        </div>
      </div>
      {/* Tariffs */}
      {/* <div className="Anonce__section"> */}
      {/*  <h2 className="Anonce__h2">Тарифы и планы</h2> */}

      {/*  <div className="Anonce__tariffs"> */}
      {/*    <Tariff */}
      {/*      src={require('Common/assets/png/Tariff_back.png')} */}
      {/*      tariffName="1 day" */}
      {/*      cost="1000" */}
      {/*    /> */}
      {/*  </div> */}
      {/* </div> */}
    </div>
  );
};

export default Anonce;

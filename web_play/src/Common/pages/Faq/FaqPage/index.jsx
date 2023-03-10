import "./index.scss";

import React from "react";
import { Link, useParams } from "react-router-dom";

import SignGameSlider from "Common/pages/Faq/SignGameSlider";
import TournamentSlider from "Common/pages/Faq/TournamentSlider";
import TeamSlider from "Common/pages/Faq/TeamSlider";
import MoneySlider from "Common/pages/Faq/MoneySlider";
import LeaveTeamSlider from "Common/pages/Faq/LeaveTeamSlider";

const FaqPage = () => {
  const { tabName } = useParams();

  return (
    <div className="Wrapper">
      {!tabName && (
        <div className="FAQ">
          <h1 style={{ textAlign: "center" }}>FAQ</h1>
          <div className="faqQuestion__wrapLink">
            {/* <Link className="faqQuestion__link" to="/faq/signGame">
              Как привязать игру PUBG Mobile?
            </Link> */}
            <Link className="faqQuestion__link" to="/faq/tournament">
              Как участвовать в турнире?
            </Link>
            <Link className="faqQuestion__link" to="/faq/team">
              Как создать свою команду?
            </Link>
            {/* <Link className="faqQuestion__link" to="/faq/money">
              Как вывести денежный выигрыш?
            </Link> */}
            <Link className="faqQuestion__link" to="/faq/leaveTeam">
              Как выйти из команды?
            </Link>
          </div>
        </div>
      )}

      {tabName === "signGame" && (
        <div className="FAQ">
          <SignGameSlider />
        </div>
      )}

      {tabName === "tournament" && (
        <div className="FAQ">
          <TournamentSlider />
        </div>
      )}

      {tabName === "team" && (
        <div className="FAQ">
          <TeamSlider />
        </div>
      )}

      {tabName === "money" && (
        <div className="FAQ">
          <MoneySlider />
        </div>
      )}

      {tabName === "leaveTeam" && (
        <div className="FAQ">
          <LeaveTeamSlider />
        </div>
      )}
    </div>
  );
};

export default FaqPage;

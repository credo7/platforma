import "./index.scss";

import React from "react";
import { useParams, Link } from "react-router-dom";

import Social from "Common/pages/PlayerSettings/Social";
import Player from "Common/pages/PlayerSettings/Player";
import Avatar from "Common/pages/PlayerSettings/Avatar";

const PlayerSettingsPage = () => {
  const { tabName = "player" } = useParams();

  const tabs = [
    { name: "player", text: "Профиль", hide: false, Component: Player },
    { name: "avatar", text: "Аватар", hide: false, Component: Avatar },
    { name: "social", text: "Соц. сети", hide: false, Component: Social },
  ];

  return (
    <div className="PlayerSettings">
      <div className="Sttings__IconEditContainer"></div>

      <div className="Sttings__wrapper">
        <ul className="Settings__tabs">
          {tabs.map((tab, index) => (
            <Link to={`/settings/${tab.name}`} key={index}>
              <li
                id={tab.name}
                className={`Settings__tab${
                  tabName === tab.name ? "--selected" : ""
                } 
                  ${tab.hide ? " tab--hide" : ""}
                `}
              >
                {tab.text}
              </li>
            </Link>
          ))}
        </ul>
        <div className="Settings__content">
          {tabs
            .filter(({ name, Component }) => tabName === name && Component)
            .map(({ Component }, index) => (
              <div className="Settings__content_wrapper" key={index}>
                <Component />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerSettingsPage;

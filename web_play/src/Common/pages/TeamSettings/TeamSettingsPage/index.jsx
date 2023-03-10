import "./index.scss";

import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import { GET_TEAM_BY_OWNER } from "Common/graphql/Teams";
import { useStore } from "Common/hooks/store";

import TeamSettingsInfo from "Common/pages/TeamSettings/TeamSettingsInfo";
import TeamSettingsPlayers from "Common/pages/TeamSettings/TeamSettingsPlayers";
import TeamSettingsFriends from "Common/pages/TeamSettings/TeamSettingsFriends";
import TeamSettingsInvites from "../TeamSettingsInvites";

const TeamSettingsPage = () => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const { tab = "info" } = useParams();

  const [getTeamByOwner, { data: dataTeam }] = useLazyQuery(GET_TEAM_BY_OWNER);
  const team = dataTeam?.team;

  useEffect(() => {
    if (gameId && userId) {
      getTeamByOwner({ variables: { gameId, ownerId: userId } });
    }
  }, [gameId, userId, getTeamByOwner]);

  return (
    <main className="TeamSettings">
      <header className="TeamSettings__header">
        <ul className="TeamSettings__tabs">
          {[
            { name: "info", text: "Информация", condition: true },
            { name: "players", text: "Состав", condition: !!team },
            {
              name: "friends",
              text: "Собрать команду",
              condition: !!team,
            },
          ].map((item, index) => (
            <Link key={index} to={`/team/settings/${item.name}`}>
              {item.condition && (
                <li
                  className={`TeamSettings__tab${
                    item.name === `${tab}` ? "--selected" : ""
                  }`}
                  id={item.name}
                >
                  {item.text}
                </li>
              )}
            </Link>
          ))}
        </ul>
      </header>

      {tab === "info" && <TeamSettingsInfo team={team} />}
      {tab === "players" && (
        <>
          <TeamSettingsPlayers team={team} />
        </>
      )}
      {tab === "friends" && (
        <>
          <TeamSettingsInvites team={team} />
          <TeamSettingsFriends team={team} />
        </>
      )}
    </main>
  );
};

export default TeamSettingsPage;

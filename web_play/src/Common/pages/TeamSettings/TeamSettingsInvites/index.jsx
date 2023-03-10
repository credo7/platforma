import "./index.scss";

import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import TeamPlayerCard from "Common/components/TeamPlayerCard";

import { GET_TEAMS_INVITES } from "Common/graphql/TeamsInvtites";
import ButtonRemove from "Common/components/TeamsInvites/ButtonRemove";

const TeamSettingsInvites = ({ team }) => {
  const [getTeamsInvites, { data: dataTeamsInvites }] =
    useLazyQuery(GET_TEAMS_INVITES);
  const teamsInvites = dataTeamsInvites?.allTeamsInvites.nodes;

  useEffect(() => {
    if (team) {
      getTeamsInvites({ variables: { teamId: team.id } });
    }
  }, [team, getTeamsInvites]);

  return (
    <div className="TeamSettingsPlayers">
      <p className="TeamSettingsInfo__text">Приглашeнные:</p>
      {teamsInvites?.length <= 0 && (
        <div className="TeamSettingsPlayers__discription">
          Здесь появятся те, кому отправлено приглашение вступить в команду.
          Когда приглашение подтвердят, они будут зачислены в состав команды.
        </div>
      )}
      {teamsInvites?.map((item, index) => (
        <TeamPlayerCard
          key={index}
          team={team}
          player={item.player}
          isPlayer={true}
        >
          <ButtonRemove
            id={item.id}
            teamId={team.id}
            playerId={item.playerId}
          />
        </TeamPlayerCard>
      ))}
    </div>
  );
};

export default TeamSettingsInvites;

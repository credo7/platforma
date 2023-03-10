import "./index.scss";

import React, { useEffect } from "react";

import { useLazyQuery } from "@apollo/client";

import TeamCard from "Common/components/TeamCard";

import ButtonAccept from "Common/components/TeamsInvites/ButtonAccept";
import ButtonRemove from "Common/components/TeamsInvites/ButtonRemove";

import { GET_TEAMS_INVITES_USER } from "Common/graphql/TeamsInvtites";
import { useStore } from "Common/hooks/store";

const TeamsInvites = () => {
  const { store } = useStore();

  const { userId, gameId, bells } = store;
  // ! ПЕРЕДЕЛАТЬ
  const notifyUser = bells?.all;

  const [getTeamsInvites, { data: dataTeamsInvites }] = useLazyQuery(
    GET_TEAMS_INVITES_USER
  );
  const teamsInvites = dataTeamsInvites?.allTeamsInvites.nodes;

  useEffect(() => {
    if (userId && gameId) {
      getTeamsInvites({ variables: { playerId: userId } });
    }
  }, [userId, gameId, getTeamsInvites, notifyUser]);

  return (
    <>
      <h4 align="center">Запросы в команду</h4>
      <div className="TeamsRating">
        {teamsInvites?.map((item, index) => {
          return (
            <div key={index} className="PlayersRating__card">
              {/* <div className="PlayersRating__card__number">{index + 1}</div> */}
              <TeamCard
                teamName={item.team.name}
                teamRating={item.team?.teamsRatings?.nodes[0]?.elo}
                teamImg={item.team.image}
                teamCaptainId={item.team.captainId}
                cssTeamCard__inNotification={"TeamCard__inNotification"}
              >
                <ButtonAccept
                  id={item.id}
                  teamId={item.teamId}
                  playerId={item.playerId}
                />
                <ButtonRemove
                  id={item.id}
                  teamId={item.teamId}
                  playerId={item.playerId}
                />
              </TeamCard>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TeamsInvites;

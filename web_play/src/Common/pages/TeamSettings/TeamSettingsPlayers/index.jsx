import "./index.scss";

import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { crud } from "Common/services/postgraphile";

import {
  GET_TEAMS_PLAYERS,
  CREATE_TEAMS_PLAYER,
} from "Common/graphql/TeamsPlayers";
import { GET_USER } from "Common/graphql/Users";

import TeamPlayerCard from "Common/components/TeamPlayerCard";
import ButtonRemove from "Common/components/TeamsPlayers/ButtonRemove";

import { useStore } from "Common/hooks/store";
import { GET_RATING_TEAMS } from "Common/graphql/TeamsRatings";

const { READ: GET_PLAYER } = crud("teamsPlayer");

const TeamSettingsPlayers = ({ team }) => {
  const { store } = useStore();

  const { userId, gameId } = store;

  const [getTeamsPlayers, { data: dataTeamPlayers }] =
    useLazyQuery(GET_TEAMS_PLAYERS);
  const teamPlayers = dataTeamPlayers?.allTeamsPlayers.nodes;
  const player = teamPlayers?.find(
    ({ playerId }) => playerId === team?.ownerId
  );

  const [getTeamsPlayer, { data: dataTeamsPlayer }] = useLazyQuery(GET_PLAYER);
  const isTeamPlayer = useMemo(
    () => !!dataTeamsPlayer?.read.totalCount,
    [dataTeamsPlayer]
  );

  const [createTeamsPlayer] = useMutation(CREATE_TEAMS_PLAYER, {
    refetchQueries: [
      { query: GET_TEAMS_PLAYERS, variables: { teamId: team?.id } },
      { query: GET_USER, variables: { userId } },
      { query: GET_RATING_TEAMS, variables: { gameId } },
    ],
  });

  useEffect(() => {
    if (team) {
      getTeamsPlayers({ variables: { teamId: team.id } });
    }
  }, [team, getTeamsPlayers]);

  useEffect(() => {
    if (userId) {
      getTeamsPlayer({ variables: { condition: { playerId: userId } } });
    }
  }, [userId, getTeamsPlayer]);

  const enterHandler = () => {
    createTeamsPlayer({
      variables: { teamsPlayer: { teamId: team.id, playerId: team?.ownerId } },
    });
  };

  return (
    <div className="TeamSettingsPlayers">
      {!player && !isTeamPlayer && (
        <button className="Settings__button" onClick={enterHandler}>
          Вступить в команду
        </button>
      )}

      {isTeamPlayer && !player && (
        <div className="TeamSettingsPlayers__discription">
          Вы уже состоите в другой команде, поэтому не можете вступить в свою.
        </div>
      )}
      {teamPlayers?.length <= 0 && (
        <Link
          to="/team/settings/friends"
          className="TeamSettingsPlayers__discription"
        >
          У вас пока нет ни одного игрока в команде. Чтобы добавить игрока в
          состав перейдите на вкладку "Собрать команду".
        </Link>
      )}
      {teamPlayers?.map((item, index) => (
        <TeamPlayerCard
          key={index}
          team={team}
          player={item.player}
          isCaptain={item.isCaptain}
          isPlayer={true}
        >
          <ButtonRemove
            id={item.id}
            team={item.team}
            playerId={item.playerId}
          />
        </TeamPlayerCard>
      ))}
    </div>
  );
};

export default TeamSettingsPlayers;

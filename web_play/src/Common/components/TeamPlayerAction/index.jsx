import "./index.scss";

import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
// import { toast } from "react-toastify";

import {
  CREATE_TEAMS_PLAYER,
  DELETE_TEAMS_PLAYER,
  GET_TEAMS_PLAYERS,
} from "Common/graphql/TeamsPlayers";
import { GET_FRIENDS_ON_TEAM } from "Common/graphql/Friends";

import { GET_GAME } from "Common/graphql/Games";

import { useStore } from "Common/hooks/store";

const TeamPlayerAction = ({ team, playerId, isPlayer }) => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const refetchQueries = gameId &&
    userId &&
    team && [
      { query: GET_TEAMS_PLAYERS, variables: { teamId: team.id } },
      { query: GET_FRIENDS_ON_TEAM, variables: { userId, gameId } },
    ];

  const [createTeamsPlayer] = useMutation(CREATE_TEAMS_PLAYER, {
    refetchQueries,
  });
  const [deleteTeamsPlayer] = useMutation(DELETE_TEAMS_PLAYER, {
    refetchQueries,
  });

  const [getGame, { data: dataGame }] = useLazyQuery(GET_GAME);
  const teamLimit = dataGame?.gameById.teamLimit;

  const [getTeamsPlayers, { data: dataTeamPlayers }] =
    useLazyQuery(GET_TEAMS_PLAYERS);
  const teamPlayersTotal = dataTeamPlayers?.allTeamsPlayers.totalCount;

  useEffect(() => {
    if (gameId) {
      getGame({ variables: { gameId } });
    }
  }, [gameId, getGame]);

  useEffect(() => {
    if (team) {
      getTeamsPlayers({ variables: { teamId: team.id } });
    }
  }, [team, getTeamsPlayers]);

  const createHandler = (e) => {
    createTeamsPlayer({
      variables: { teamsPlayer: { teamId: team.id, playerId } },
    });
  };

  const deleteHandler = () => {
    deleteTeamsPlayer({ variables: { teamId: team.id, playerId } });
  };

  return (
    <>
      <div className="TeamPlayerAction__actions">
        {!isPlayer ? (
          <>
            {teamPlayersTotal < teamLimit && (
              <div className="TeamPlayerAction__actions__write">
                <img
                  onClick={createHandler}
                  className="img-width100"
                  src={
                    require("Common/assets/svg/Profile/Add_to_team.svg").default
                  }
                  alt="Add_to_team"
                  title="Добавить в команду"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="TeamPlayerAction__actions__kick">
              <img
                onClick={deleteHandler}
                className="img-width100"
                src={require("Common/assets/svg/Friends/Decline.svg").default}
                alt="Decline"
                title="Удалить из команды"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TeamPlayerAction;

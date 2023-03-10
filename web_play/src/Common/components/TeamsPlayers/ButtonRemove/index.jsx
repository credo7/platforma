import "./index.scss";

import React from "react";

import { DELETE_TEAMS_INVITE } from "Common/graphql/TeamsInvtites";
import { GET_TEAMS_PLAYERS } from "Common/graphql/TeamsPlayers";
import { GET_TEAM_BY_NAME } from "Common/graphql/Teams";
import { GET_USER } from "Common/graphql/Users";

import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { DELETE: DELETE_TEAMS_PLAYERS } = crud("teamsPlayer");

const ButtonRemove = ({ id, team, playerId }) => {
  const { store } = useStore();

  const { userId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_TEAMS_PLAYERS, variables: { teamId: team?.id } },
    { query: GET_TEAM_BY_NAME, variables: { teamName: team?.name } },
  ];

  const [deleteTeamsPlayers] = useMutation(DELETE_TEAMS_PLAYERS);

  const [deleteTeamsInvite] = useMutation(DELETE_TEAMS_INVITE);

  const handlerRemove = () => {
    const isDel = window.confirm("Вы уверены?");
    if (isDel) {
      deleteTeamsInvite({
        variables: { teamId: team?.id, playerId },
        refetchQueries,
      });

      deleteTeamsPlayers({ variables: { input: { id } }, refetchQueries });
    }
  };

  return (
    <div className="FriendInvite__actions__kick">
      <img
        onClick={handlerRemove}
        className="img-width100"
        src={require("Common/assets/svg/Friends/Decline.svg").default}
        alt="Удалить из команды"
      />
    </div>
  );
};

export default ButtonRemove;

import "./index.scss";

import React from "react";

import { GET_FRIENDS_ON_TEAM } from "Common/graphql/Friends";
import { GET_TEAMS_INVITES } from "Common/graphql/TeamsInvtites";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { DELETE: DELETE_TEAMS_INVITE } = crud("teamsInvite");

const ButtonRemove = ({ id, playerId, teamId }) => {
  const { store } = useStore();

  const { userId, gameId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_ON_TEAM, variables: { userId, gameId } },
    { query: GET_TEAMS_INVITES, variables: { teamId } },
  ];

  const [deleteTeamsInvite] = useMutation(DELETE_TEAMS_INVITE);

  const handlerInvite = () => {
    deleteTeamsInvite({
      variables: { input: { id } },
      refetchQueries,
    });
  };

  return (
    <div className="FriendInvite__actions__kick">
      <img
        onClick={handlerInvite}
        className="img-width100"
        src={require("Common/assets/svg/Friends/Decline.svg").default}
        alt="Отменить заявку"
      />
    </div>
  );
};

export default ButtonRemove;

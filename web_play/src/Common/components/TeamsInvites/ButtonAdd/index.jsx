import "./index.scss";

import React from "react";

import { GET_FRIENDS_ON_TEAM } from "Common/graphql/Friends";
import { GET_TEAMS_INVITES } from "Common/graphql/TeamsInvtites";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { CREATE } = crud("teamsInvite");

const ButtonAdd = ({ playerId, teamId }) => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_ON_TEAM, variables: { userId, gameId } },
    { query: GET_TEAMS_INVITES, variables: { teamId } },
  ];

  const [create] = useMutation(CREATE);

  const handlerInvite = () => {
    create({
      variables: { input: { teamsInvite: { playerId, teamId } } },
      refetchQueries,
    });
  };

  return (
    <div className="FriendInvite__actions__write">
      <img
        onClick={handlerInvite}
        className="img-width100"
        src={require("Common/assets/svg/Profile/Add_to_team.svg").default}
        alt="Пригласить в команду"
      />
    </div>
  );
};

export default ButtonAdd;

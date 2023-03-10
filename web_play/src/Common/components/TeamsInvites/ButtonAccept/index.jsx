import "./index.scss";

import React from "react";

import { GET_TEAMS_INVITES_USER } from "Common/graphql/TeamsInvtites";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { UPDATE: UPDATE_TEAMS_INVITES } = crud("teamsInvite");
const { CREATE: CREATE_TEAMS_PLAYERS } = crud("teamsPlayer");

const ButtonAccept = ({ id, teamId, playerId }) => {
  const { store } = useStore();

  const { userId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_TEAMS_INVITES_USER, variables: { playerId: userId } },
  ];

  const [createTeamsPlayers] = useMutation(CREATE_TEAMS_PLAYERS);

  const [updateTeamsInvites] = useMutation(UPDATE_TEAMS_INVITES);

  const handlerInvite = () => {
    createTeamsPlayers({
      variables: { input: { teamsPlayer: { teamId, playerId } } },
    });

    updateTeamsInvites({
      variables: { input: { id, teamsInvitePatch: { status: "ACCEPTED" } } },
      refetchQueries,
    });
  };

  return (
    <div className="TeamInvite__actions__write">
      <img
        onClick={handlerInvite}
        className="img-width100"
        src={require("Common/assets/svg/Friends/Accept.svg").default}
        alt="Принять заявку"
      />
    </div>
  );
};

export default ButtonAccept;

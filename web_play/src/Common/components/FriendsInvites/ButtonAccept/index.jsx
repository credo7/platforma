import "./index.scss";

import React from "react";

import { GET_FRIENDS_BY_USER_ID } from "Common/graphql/Friends";
import {
  GET_FRIENDS_INVITES_BY_FRIEND,
  GET_FRIENDS_INVITES_BY_USER,
} from "Common/graphql/FriendsInvtites";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { UPDATE: UPDATE_FRIENDS_INVITES } = crud("friendsInvite");
const { CREATE: CREATE_FRIENDS } = crud("friend");

const ButtonAccept = ({ id, userId, friendId }) => {
  const { store } = useStore();
  const { gameId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_FRIEND, variables: { friendId: userId } },
    { query: GET_FRIENDS_BY_USER_ID, variables: { userId, gameId, friendId } },
  ];

  const [createFriends] = useMutation(CREATE_FRIENDS);

  const [updateFriendsInvites] = useMutation(UPDATE_FRIENDS_INVITES);

  const handlerInvite = () => {
    createFriends({ variables: { input: { friend: { userId, friendId } } } });
    createFriends({
      variables: { input: { friend: { userId: friendId, friendId: userId } } },
    });
    updateFriendsInvites({
      variables: { input: { id, friendsInvitePatch: { status: "ACCEPTED" } } },
      refetchQueries,
    });
  };

  return (
    <div className="FriendInvite__actions__write">
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

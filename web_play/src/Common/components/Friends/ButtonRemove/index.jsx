import "./index.scss";

import React from "react";
import { useMutation } from "@apollo/client";

import { DELETE_FRIEND, GET_FRIENDS_BY_USER_ID } from "Common/graphql/Friends";
import {
  DELETE_FRIENDS_INVITE,
  GET_FRIENDS_INVITES_BY_FRIEND,
  GET_FRIENDS_INVITES_BY_USER,
} from "Common/graphql/FriendsInvtites";
import { GET_USER } from "Common/graphql/Users";

import { useStore } from "Common/hooks/store";

const ButtonRemove = ({ userId, friendId }) => {
  const { store } = useStore();
  const { gameId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_FRIEND, variables: { friendId: userId } },
    { query: GET_FRIENDS_BY_USER_ID, variables: { userId, gameId, friendId } },
  ];

  const [deleteFriend] = useMutation(DELETE_FRIEND);
  const [deleteFriendsInvite] = useMutation(DELETE_FRIENDS_INVITE);

  const handlerRemove = () => {
    let isDel = window.confirm("Вы уверены?");
    if (isDel) {
      deleteFriend({ variables: { userId, friendId } });
      deleteFriend({ variables: { userId: friendId, friendId: userId } });
      deleteFriendsInvite({ variables: { userId, friendId } });
      deleteFriendsInvite({
        variables: { userId: friendId, friendId: userId },
        refetchQueries,
      });
    }
  };

  return (
    <div className="FriendInvite__actions__kick">
      <img
        onClick={handlerRemove}
        className="img-width100"
        src={require("Common/assets/svg/Friends/Decline.svg").default}
        alt="Удалить из друзей"
      />
    </div>
  );
};

export default ButtonRemove;

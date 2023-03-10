import "./index.scss";

import React from "react";

import {
  GET_FRIENDS_INVITES_BY_FRIEND,
  GET_FRIENDS_INVITES_BY_USER,
} from "Common/graphql/FriendsInvtites";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { DELETE: DELETE_FRIENDS_INVITE } = crud("friendsInvite");

const ButtonRemove = ({ id }) => {
  const { store } = useStore();

  const { userId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_FRIEND, variables: { friendId: userId } },
  ];
  const [deleteFriendsInvite] = useMutation(DELETE_FRIENDS_INVITE);

  const handlerInvite = () => {
    deleteFriendsInvite({ variables: { input: { id } }, refetchQueries });
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

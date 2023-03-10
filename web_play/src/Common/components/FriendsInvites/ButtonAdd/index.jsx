import "./index.scss";

import React from "react";

import {
  GET_FRIENDS_INVITES_BY_FRIEND,
  GET_FRIENDS_INVITES_BY_USER,
} from "Common/graphql/FriendsInvtites";
import { GET_RATING_PLAYERS } from "Common/graphql/PlayersRatings";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { crud } from "Common/services/postgraphile";

import { useMutation } from "@apollo/client";

const { CREATE } = crud("friendsInvite");

const ButtonAdd = ({ playerId }) => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const refetchQueries = [
    { query: GET_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_USER, variables: { userId } },
    { query: GET_FRIENDS_INVITES_BY_FRIEND, variables: { friendId: userId } },
    { query: GET_RATING_PLAYERS, variables: { playerId: userId, gameId } },
  ];

  const [create] = useMutation(CREATE);

  const handlerInvite = () => {
    create({
      variables: {
        input: { friendsInvite: { userId: playerId, friendId: userId } },
      },
      refetchQueries,
    });
  };

  return (
    <div className="FriendInvite__actions__write">
      <img
        onClick={handlerInvite}
        className="img-width100"
        src={require("Common/assets/svg/Profile/Add_to_friend.svg").default}
        alt="Пригласить в друзья"
      />
    </div>
  );
};

export default ButtonAdd;

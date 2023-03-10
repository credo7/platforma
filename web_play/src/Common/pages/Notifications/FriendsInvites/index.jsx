import "./index.scss";

import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import UserCard from "Common/components/UserCard";

import {
  GET_FRIENDS_INVITES_BY_USER,
  GET_FRIENDS_INVITES_BY_FRIEND,
} from "Common/graphql/FriendsInvtites";
import ButtonRemove from "Common/components/FriendsInvites/ButtonRemove";
import ButtonAccept from "Common/components/FriendsInvites/ButtonAccept";
import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

const FriendsInvites = () => {
  const { store } = useStore();

  const { isAuth, userId } = store;

  const [getFriendsInvitesByUser, { data: dataFriendsInvitesByUser }] =
    useLazyQuery(GET_FRIENDS_INVITES_BY_USER);
  const friendsInvitesUser = dataFriendsInvitesByUser?.allFriendsInvites.nodes;

  const [getFriendsInvitesByFriend, { data: dataFriendsInvitesByFriend }] =
    useLazyQuery(GET_FRIENDS_INVITES_BY_FRIEND);
  const friendsInvitesFriend =
    dataFriendsInvitesByFriend?.allFriendsInvites.nodes;

  useEffect(() => {
    if (userId) {
      getFriendsInvitesByUser({ variables: { userId } });
      getFriendsInvitesByFriend({ variables: { friendId: userId } });
    }
  }, [userId, getFriendsInvitesByUser, getFriendsInvitesByFriend]);

  return (
    <>
      <h4 align="center">Запросы в друзья</h4>
      <div className="Notifi__conversation__wrapper">
        {friendsInvitesUser?.map((item, index) => (
          <UserCard
            key={index}
            userId={item.friendId}
            username={""}
            usernameMain={item.user.username}
            img={
              item?.user.image
                ? storage(item.user.image, "s")
                : require("Common/assets/png/ProfileIcon.png").default
            }
            rotate={item.user.rotate}
            rating={item.user.players?.nodes[0]?.rating?.nodes[0]?.elo}
            isLogin={isAuth}
            isChatBlocked
            isFriend={item}
            isOwner
          >
            <ButtonAccept
              id={item.id}
              userId={item.userId}
              friendId={item.friendId}
            />
            <ButtonRemove id={item.id} />
          </UserCard>
        ))}

        {friendsInvitesFriend?.map((item, index) => (
          <UserCard
            key={index}
            userId={item.friendId}
            username={""}
            usernameMain={item.user.username}
            img={
              item?.user.image
                ? storage(item.user.image, "s")
                : require("Common/assets/png/ProfileIcon.png").default
            }
            rotate={item.user.rotate}
            players={item.user.players?.nodes}
            rating={item.user.players?.nodes[0]?.rating?.nodes[0]?.elo}
            isLogin={isAuth}
            isChatBlocked
            isFriend={item}
            isOwner
          >
            <ButtonRemove id={item.id} />
          </UserCard>
        ))}
      </div>
    </>
  );
};

export default FriendsInvites;

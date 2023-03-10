import "./index.scss";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import UserCard from "Common/components/UserCard";

import { GET_FRIENDS_BY_USER_ID } from "Common/graphql/Friends";

import ButtonRemove from "Common/components/Friends/ButtonRemove";
// eslint-disable-next-line no-unused-vars
import ButtonSendMessage from "Common/components/Chat/ButtonSendMessage";
import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

const Friends = ({ player }) => {
  const { store } = useStore();

  const { tab = "friends", subTab = "all" } = useParams();

  const { userId, user, gameId } = store;

  const [owner, setOwner] = useState(false);

  const [getFriendsPlayer, { data: dataFriendsPlayer }] = useLazyQuery(
    GET_FRIENDS_BY_USER_ID
  );
  const friendsPlayer = dataFriendsPlayer?.allFriends?.nodes;

  const [getFriendsUser, { data: dataFriendsUser }] = useLazyQuery(
    GET_FRIENDS_BY_USER_ID
  );
  const friendsUser = dataFriendsUser?.allFriends?.nodes;
  const friendMutual = friendsUser?.filter((frUser) =>
    friendsPlayer?.some((frPlayer) => frUser.friendId === frPlayer.friendId)
  );

  useEffect(() => {
    if (player && gameId && userId) {
      getFriendsPlayer({
        variables: { userId: player.id, gameId, friendId: userId },
      });
    }
  }, [player, gameId, getFriendsPlayer, userId]);

  useEffect(() => {
    if (userId && gameId && userId) {
      getFriendsUser({ variables: { userId, gameId, friendId: userId } });
    }
  }, [userId, gameId, getFriendsUser]);

  useEffect(() => {
    setOwner(player?.id === userId);
  }, [player, userId]);

  return (
    <div className="Friends">
      <ul className="Friends__tabs">
        {[
          {
            text: "Все друзья",
            to: `/profile/${player?.username}/friends/all`,
            condition: true,
          },
          {
            text: "Онлайн",
            to: `/profile/${player?.username}/friends/online`,
            condition: !!user && owner,
          },
          {
            text: "Общие",
            to: `/profile/${player?.username}/friends/mutual`,
            condition: !!user && !owner,
          },
        ].map(
          (item, index) =>
            item.condition && (
              <Link key={index} to={item.to}>
                <li
                  className={`Friends__tab${
                    item.to.indexOf(`${tab}/${subTab}`) !== -1
                      ? "--selected"
                      : ""
                  }`}
                >
                  {item.text}
                </li>
              </Link>
            )
        )}
      </ul>
      <div className="Friends__content">
        {`${tab}/${subTab}` === "friends/all" &&
          friendsPlayer?.map((item, index) => {
            // const isFriend = !!item.user?.friend?.totalCount;

            return (
              <UserCard
                key={index}
                userId={item.friendId}
                username=""
                usernameMain={item?.user.username}
                img={
                  item?.user.image
                    ? storage(item?.user.image, "s")
                    : require("Common/assets/png/ProfileIcon.png").default
                }
                rotate={item?.user.rotate}
                players={player?.players?.nodes}
                rating={item?.user?.players?.nodes[0]?.ratings?.nodes[0]?.elo}
                // }
                // victories={
                //   item?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.wins
                // }
                // defeats={
                //   item?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.loss
                // }
                // isChatBlocked={item.blockChat}
                isLogin={!!user}
                isFriend={{
                  accepted: item?.accepted,
                  blocked: item?.blocked,
                  friendId: item?.friendId,
                  id: item?.id,
                  userId: userId,
                }}
                iconRemoveFriend={true}
                // isInGame={item?.playerInTeam}
                isOnline={item?.user?.online}
                isOwner={owner}
              >
                {/* {isFriend && (
                  <ButtonSendMessage
                    playerId={item?.friendId}
                    player={item?.user}
                  />
                )} */}
                <ButtonRemove
                  id={item.id}
                  userId={item.userId}
                  friendId={item.friendId}
                />
              </UserCard>
            );
          })}
        {`${tab}/${subTab}` === "friends/mutual" &&
          friendMutual?.map((item, index) => {
            // const isFriend = !!item.user?.friend?.totalCount;
            return (
              <UserCard
                key={index}
                userId={item.friendId}
                username=""
                usernameMain={item?.user.username}
                img={
                  item?.user.image
                    ? storage(item?.user.image, "s")
                    : require("Common/assets/png/ProfileIcon.png").default
                }
                rotate={item?.user.rotate}
                players={player?.players?.nodes}
                rating={item?.user?.players?.nodes[0]?.ratings?.nodes[0]?.elo}
                // }
                // victories={
                //   item?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.wins
                // }
                // defeats={
                //   item?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.loss
                // }
                // isChatBlocked={item.blockChat}
                isLogin={!!user}
                isFriend={{
                  accepted: item?.accepted,
                  blocked: item?.blocked,
                  friendId: item?.friendId,
                  id: item?.id,
                  userId: userId,
                }}
                iconRemoveFriend={true}
                // isInGame={item?.playerInTeam}
                isOnline={item?.user.online}
                isOwner={owner}
              >
                {/* {isFriend && (
                  <ButtonSendMessage
                    playerId={item.friendId}
                    player={item?.user}
                  />
                )} */}
                <ButtonRemove
                  id={item.id}
                  userId={item.userId}
                  friendId={item.friendId}
                />
              </UserCard>
            );
          })}

        {`${tab}/${subTab}` === "friends/online" &&
          friendsPlayer
            ?.filter((item) => item?.user.online)
            ?.map((item, index) => {
              // const isFriend = !!item.user?.friend?.totalCount;
              return (
                <UserCard
                  key={index}
                  userId={item.friendId}
                  username=""
                  usernameMain={item?.user.username}
                  img={
                    item?.user.image
                      ? storage(item?.user.image, "s")
                      : require("Common/assets/png/ProfileIcon.png").default
                  }
                  rotate={item?.user.rotate}
                  players={player?.players?.nodes}
                  rating={item?.user?.players?.nodes[0]?.ratings?.nodes[0]?.elo}
                  // }
                  // victories={
                  //   item?.players?.find(
                  //     (player) => player.gameId === gameType
                  //   )?.stats.wins
                  // }
                  // defeats={
                  //   item?.players?.find(
                  //     (player) => player.gameId === gameType
                  //   )?.stats.loss
                  // }
                  // isChatBlocked={item.blockChat}
                  isLogin={!!user}
                  isFriend={{
                    accepted: item?.accepted,
                    blocked: item?.blocked,
                    friendId: item?.friendId,
                    id: item?.id,
                    userId: userId,
                  }}
                  iconRemoveFriend={true}
                  // isInGame={item?.playerInTeam}
                  isOnline={item?.user.online}
                  isOwner={owner}
                >
                  {/* {isFriend && (
                    <ButtonSendMessage
                      playerId={item.friendId}
                      player={item?.user}
                    />
                  )} */}
                  <ButtonRemove
                    id={item.id}
                    userId={item.userId}
                    friendId={item.friendId}
                  />
                </UserCard>
              );
            })}
      </div>
    </div>
  );
};

export default Friends;

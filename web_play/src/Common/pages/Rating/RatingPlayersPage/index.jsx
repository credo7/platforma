import "./index.scss";

import React, { useEffect, useState, useMemo } from "react";

import { useLazyQuery } from "@apollo/client";
import { GET_RATING_PLAYERS } from "Common/graphql/PlayersRatings";

import UserCard from "Common/components/UserCard";
import RatingTabs from "Common/components/RatingTabs";
import { useStore } from "Common/hooks/store";

import Search from "Common/components/Search";
import ButtonAdd from "Common/components/FriendsInvites/ButtonAdd";

import { storage } from "Common/services/functions";
import Pagination, { usePagination } from "Common/components/Pagination";

import ProfileIcon from "Common/assets/png/ProfileIcon.png";
import SearchBigIcon from "Common/assets/svg/General/Search_big_icon.svg";

const useRatingPlayers = ({ userId, gameId, search, pagination }) => {
  const { offset, limit } = pagination;

  const [getRatingPlayers, { data }] = useLazyQuery(GET_RATING_PLAYERS);
  const players = useMemo(() => data?.node?.nodes, [data]);
  const pageInfo = useMemo(() => data?.node.pageInfo, [data]);

  useEffect(() => {
    const isSearch = search?.length >= 3;

    userId &&
      gameId &&
      getRatingPlayers({
        variables: {
          playerId: userId,
          gameId,
          limit,
          offset: isSearch ? 0 : offset,
          search: isSearch ? `%${search}%` : "%%",
        },
      });
  }, [search, userId, gameId, limit, offset, getRatingPlayers]);

  return { players, pageInfo };
};

const RatingPlayersPage = () => {
  const { store } = useStore();

  const { isAuth, userId, gameId } = store;

  const [search, setSearch] = useState("");

  const { pagination, setPagination } = usePagination({ limit: 7 });

  const { offset } = pagination;

  const { players, pageInfo } = useRatingPlayers({
    userId,
    gameId,
    search,
    pagination,
  });

  return (
    <RatingTabs tabName={"players"}>
      <div className="Chats__search">
        <Search
          className="Chats__search__input"
          placeholder=""
          updateSearch={(value) => setSearch(value)}
        />
        <div className="Chats__search__imgWrapper">
          <img className="img-width100" src={SearchBigIcon} alt="Поиск" />
        </div>
      </div>

      <div className="PlayersRating">
        {players?.map((item, index) => {
          const player = {
            ...item,
            user: item.player.user,
            stats: item.player.stats?.edges[0]?.node,
            isInvite:
              item.player.user.friendsInvitesByFriendId.totalCount +
              item.player.user.friendsInvitesByUserId.totalCount,
            isOwner: item.player.user.id === userId,
            img: item.player.user.image
              ? storage(item.player.user.image, "m")
              : ProfileIcon,
          };
          return (
            <div key={index} className="PlayersRating__card">
              {/*  неправильное отображение цифр рейтинга при поиске - решено времено скрыть */}
              {/* <div className="PlayersRating__card__number">
                {index + 1 + offset}
              </div> */}
              <UserCard
                key={player.user.id}
                userId={player.user.id}
                img={player.img}
                username=""
                usernameMain={player.user.username}
                players={[{ gameId: player.gameId }]}
                rating={player.elo}
                victories={player.stats?.wins}
                defeats={player.stats?.loss}
                isLogin={isAuth}
                // isInGame={ }
                // isOnline={ }
                isTeamMember={false}
                isHasTeam={player.hasTeam}
                isRatingList={true}
                rotate={player.user.rotate}
              >
                {!player.isInvite && !player.isOwner && (
                  <ButtonAdd playerId={player.user.id} />
                )}
              </UserCard>
            </div>
          );
        })}
      </div>

      {players?.length && (
        <Pagination {...{ pagination, setPagination, pageInfo }} />
      )}
    </RatingTabs>
  );
};

export default RatingPlayersPage;

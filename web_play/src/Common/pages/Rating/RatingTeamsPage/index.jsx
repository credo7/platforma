import "./index.scss";

import React, { useEffect, useState, useMemo } from "react";

import { useLazyQuery } from "@apollo/client";
import { GET_RATING_TEAMS } from "Common/graphql/TeamsRatings";

import RatingTabs from "Common/components/RatingTabs";
import TeamCard from "Common/components/TeamCard";
import { useStore } from "Common/hooks/store";

import Search from "Common/components/Search";

import Pagination, { usePagination } from "Common/components/Pagination";

import SearchBigIcon from "Common/assets/svg/General/Search_big_icon.svg";

const useRatingTeams = ({ search, gameId, pagination }) => {
  const { offset, limit } = pagination;

  const [getRatingTeams, { data }] = useLazyQuery(GET_RATING_TEAMS);
  const teams = useMemo(() => data?.node.nodes, [data]);
  const pageInfo = useMemo(() => data?.node.pageInfo, [data]);

  useEffect(() => {
    const isSearch = search.length >= 3;

    gameId &&
      getRatingTeams({
        variables: {
          gameId,
          limit,
          offset: isSearch ? 0 : offset,
          search: isSearch ? `%${search}%` : "%%",
        },
      });
  }, [search, gameId, limit, offset, getRatingTeams]);

  return { teams, pageInfo };
};

const RatingTeamsPage = () => {
  const { store } = useStore();

  const [search, setSearch] = useState("");

  const { gameId } = store;

  const { pagination, setPagination } = usePagination({ limit: 8 });

  const { offset } = pagination;

  const { teams, pageInfo } = useRatingTeams({
    search,
    gameId,
    pagination,
  });

  return (
    <RatingTabs tabName={"teams"}>
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

      <div className="TeamsRating">
        {teams?.map((item, index) => {
          return (
            <div key={index} className="PlayersRating__card">
              {/*  неправильное отображение цифр рейтинга при поиске - решено времено скрыть */}
              {/* <div className="PlayersRating__card__number">
                {index + 1 + offset}
              </div> */}
              <TeamCard
                teamName={item.team.name}
                teamRating={item.elo}
                teamImg={item.team.image}
                teamCaptainId={item.team.captainId}
                teamPlayers={item.team.players.nodes}
              />
            </div>
          );
        })}
      </div>

      {teams?.length && (
        <Pagination {...{ pagination, setPagination, pageInfo }} />
      )}
    </RatingTabs>
  );
};

export default RatingTeamsPage;

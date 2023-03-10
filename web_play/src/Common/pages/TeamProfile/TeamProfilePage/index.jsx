import "./index.scss";

import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import { CountryRegionData } from "react-country-region-selector";

import UserCard from "Common/components/UserCard";
import ButtonRemove from "Common/components/TeamsPlayers/ButtonRemove";
import { useStore } from "Common/hooks/store";

import { GET_TEAM_BY_NAME } from "Common/graphql/Teams";
import { GET_USER } from "Common/graphql/Users";
import ProfileIcon from "Common/components/ProfileIcon";

import { storage } from "Common/services/functions";

import ProfileIconPng from "Common/assets/png/ProfileIcon.png";

const TeamProfilePage = () => {
  const { store } = useStore();

  const { user, userId, gameId } = store;

  const { teamName } = useParams();
  const history = useHistory();

  const [getTeamByName, { data: dataTeamByName }] =
    useLazyQuery(GET_TEAM_BY_NAME);

  const team = dataTeamByName?.teamByName;
  const teamRating = team?.teamsRatingsByTeamId?.nodes[0]?.elo;
  const participantsTeam = team?.teamsPlayersByTeamId?.nodes;
  // const isUserPlayerInTeam = participantsTeam?.find(
  //   (item) => item.userByPlayerId.id === userId
  // );

  const teamCountry =
    team?.country &&
    CountryRegionData?.find((item) => item[1] === team?.country)[0];

  const isOwnerTeam = team?.ownerId === userId;

  const [getUserById, { data: dataUserById }] = useLazyQuery(GET_USER);
  // const nameOwnerTeam = dataUserById?.user?.username; - ЭТОТ ЗАПРОС БЫЛ ДО ПОСЛЕДНИХ ИЗМЕНЕНИЙ 13 янв 2022
  const nameOwnerTeam = dataUserById?.node?.username; // А ТЕПЕРЬ ТАКОЙ ЗАПРОС - почему такая разница

  useEffect(() => {
    if (teamName) {
      getTeamByName({ variables: { teamName } });
    }
  }, [teamName, getTeamByName]);

  useEffect(() => {
    if (dataTeamByName) {
      getUserById({
        variables: { userId: team?.ownerId },
      });
    }
  }, [dataTeamByName, getUserById]);

  useEffect(() => {
    if (dataTeamByName && !isOwnerTeam) {
      // history.push("/team/settings");
    }
  }, [dataTeamByName, isOwnerTeam, history]);

  if (!team) {
    return (
      <center>
        <h3>Такой команды нет</h3>
      </center>
    );
  }

  return (
    <div className="TeamProfilePage">
      <div className="TeamProfilePage__container">
        <div className="Profile__header">
          <div className="Profile__user">
            <div className="Profile__imgWrapper">
              <ProfileIcon
                src={team?.image ? storage(team.image, "l") : ProfileIconPng}
                // rotate={player?.rotate}
                height={70}
                width={70}
              />
            </div>
            <div className="Profile__userInfo">
              <div className="Profile__usernameAndDots">
                <h1 className="Text-16px-700">{team?.name}</h1>
              </div>
              <p className="Text-12px-400">{teamCountry}</p>

              {isOwnerTeam ? (
                <Link
                  className="commonBtn TeamProfilePage__commonBtn"
                  to="/team/settings"
                >
                  Редактировать
                </Link>
              ) : (
                <Link
                  className="TeamProfilePage__nameOwnerTeam"
                  to={`/profile/${nameOwnerTeam}`}
                >
                  хозяин команды: <br /> {nameOwnerTeam}
                </Link>
              )}
            </div>
          </div>
          <div className="TeamProfilePage__rating">{teamRating}</div>
        </div>
        <div className="TeamProfilePage__teamPlayers">
          <div className="TeamProfilePage__title">Состав команды</div>
          {participantsTeam?.map((item) => {
            return (
              <UserCard
                key={item.userByPlayerId.id}
                userId={item.userByPlayerId.id}
                username=""
                usernameMain={item.userByPlayerId.username}
                playerName={
                  item.userByPlayerId.playersByUserId?.nodes[0]?.username
                }
                img={
                  item.userByPlayerId.image
                    ? storage(item.userByPlayerId.image, "s")
                    : ProfileIconPng
                }
                rotate={item.userByPlayerId.rotate}
                isOnline={item.userByPlayerId.online}
                isFriend={{
                  accepted: true,
                  blocked: false,
                  friendId: item.userByPlayerId.id,
                  id: item.userByPlayerId.id,
                  userId: userId,
                }}
                players={[{ gameId: gameId }]}
                rating={
                  item.userByPlayerId.playersByUserId?.nodes[0]
                    ?.playersRatingsByPlayerId?.nodes[0]?.elo
                }
                teamCaptain_TeamProfile={item.isCaptain}
                // }
                // victories={
                //   friend?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.wins
                // }
                // defeats={
                //   friend?.players?.find(
                //     (player) => player.gameId === gameType
                //   )?.stats.loss
                // }
                // isChatBlocked={friend.blockChat}

                // isInGame={friend?.playerInTeam}

                // isOwner={owner}
                isLogin={!!user}
              >
                {item.userByPlayerId.id === userId && (
                  <ButtonRemove
                    id={item.userByPlayerId.teamsPlayersByPlayerId.nodes[0].id}
                    team={team}
                    playerId={item.userByPlayerId?.id}
                  />
                )}
              </UserCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamProfilePage;

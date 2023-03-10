import "./index.scss";

import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import { GET_USER_BY_USERNAME } from "Common/graphql/Users";
import { GET_RATING_PLAYER } from "Common/graphql/PlayersRatings";
import { GET_TOURNAMENTS_HISTORY } from "Common/graphql/Tournaments";
import { GET_TOURNAMENTS_TEAMS_HISTORY } from "Common/graphql/TournamentsTeams";

import Friends from "Common/pages/Profile/Friends";
import GamesHistory from "Common/pages/Profile/GamesHistory";
import Social from "Common/pages/Profile/Social";
import { useStore } from "Common/hooks/store";

import ProfileIcon from "Common/components/ProfileIcon";
import ProfileIconImg from "Common/assets/png/ProfileIcon.png";
import Modal from "Common/components/Modal";
import ButtonSendMessage from "Common/components/Chat/ButtonSendMessage";
import ButtonAdd from "Common/components/FriendsInvites/ButtonAdd";

import { storage } from "Common/services/functions";

const ProfilePage = () => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const { username = "", tab = "games", subTab = "now" } = useParams();

  const [getUserByUsername, { data: dataUser }] =
    useLazyQuery(GET_USER_BY_USERNAME);
  const player = dataUser?.userByUsername;
  const isFriend = !!player?.friend?.totalCount;
  const isOwner = player?.id === userId;
  const chatRoom = dataUser?.chatRooms?.nodes[0];
  const playInTeamName = player?.playInTeam?.nodes[0]?.name;
  const playerNameInGame = player?.players?.nodes[0]?.username;

  const [getRatingPlayer, { data: dataRatingPlayer }] =
    useLazyQuery(GET_RATING_PLAYER);
  const rating = dataRatingPlayer?.player?.playersRatings?.nodes[0]?.elo;

  const [getTournamentsHistory, { data: dataTournamentsHistory }] =
    useLazyQuery(GET_TOURNAMENTS_HISTORY);

  const [getTournamentsNow, { data: dataTournamentsNow }] = useLazyQuery(
    GET_TOURNAMENTS_HISTORY
  );

  const [getTournamentsTeamsHistory, { data: dataTournamentsTeamsHistory }] =
    useLazyQuery(GET_TOURNAMENTS_TEAMS_HISTORY);

  const [getTournamentsTeamsNow, { data: dataTournamentsTeamsNow }] =
    useLazyQuery(GET_TOURNAMENTS_TEAMS_HISTORY);

  const allTournamentsNow = dataTournamentsNow &&
    dataTournamentsTeamsNow && [
      ...dataTournamentsNow?.allTournamentsPlayers?.nodes,
      ...dataTournamentsTeamsNow?.allTournamentsTeamsPlayers?.nodes,
    ];

  const allTournamentsHistory = dataTournamentsHistory &&
    dataTournamentsTeamsHistory && [
      ...dataTournamentsHistory?.allTournamentsPlayers?.nodes,
      ...dataTournamentsTeamsHistory?.allTournamentsTeamsPlayers?.nodes,
    ];

  const refetchQueries = [
    { query: GET_USER_BY_USERNAME, variables: { username, playerId: userId } },
  ];

  useEffect(() => {
    if (username && userId) {
      getUserByUsername({ variables: { username, playerId: userId } });
    }
  }, [username, getUserByUsername, userId]);

  useEffect(() => {
    if (player && gameId) {
      getRatingPlayer({ variables: { playerId: player?.id, gameId } });
      getTournamentsHistory({
        variables: { playerId: player?.id, gameId, status: ["FINISHED"] },
      });
      getTournamentsNow({
        variables: {
          playerId: player?.id,
          gameId,
          status: ["LIVE", "REGISTRATION", "CONFIRMATION"],
        },
      });

      getTournamentsTeamsHistory({
        variables: { playerId: player?.id, status: ["FINISHED"] },
      });
      getTournamentsTeamsNow({
        variables: {
          playerId: player?.id,
          status: ["LIVE", "REGISTRATION", "CONFIRMATION"],
        },
      });
    }
  }, [
    player,
    gameId,
    getRatingPlayer,
    getTournamentsHistory,
    getTournamentsNow,
    getTournamentsTeamsHistory,
    getTournamentsTeamsNow,
  ]);

  return (
    <div className="Profile">
      <div className="Profile__header">
        <div className="Profile__user">
          <div className="Profile__imgWrapper">
            <ProfileIcon
              src={player?.image ? storage(player.image, "l") : ProfileIconImg}
              rotate={player?.rotate}
              height={70}
              width={70}
            />
          </div>
          <div className="Profile__userInfo">
            <div className="Profile__usernameAndDots">
              <h1 className="Text-16px-700">{player?.username}</h1>
            </div>
            <p className="Text-12px-400">{playerNameInGame}</p>
            <h2 className="Text-18px-700">{rating}</h2>
            {playInTeamName && (
              <div className="Profile__userTeam">
                <div className="Profile__userTeam_text">Играет в команде:</div>
                <Link
                  className="Profile__userTeam_teamName"
                  to={`/team/profile/${playInTeamName}`}
                >
                  {playInTeamName}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="Profile__sendMessage">
          {isOwner && (
            <Link
              className="commonBtn Profile__commonBtn"
              to="/settings/player"
            >
              Редактировать
            </Link>
          )}
          {isFriend && (
            <ButtonSendMessage
              playerId={player?.id}
              player={player}
              chatRoom={chatRoom}
              refetchQueries={refetchQueries}
            />
          )}
          {!isFriend && !isOwner && <ButtonAdd playerId={player?.id} />}
          <div className="wrapDotsAndInvite">
            <div className="Profile__contactAndGameStat">
              <div className="Profile__contactAndGameStat__wrapper">
                <div className="Profile__contactAndGameStat__block">
                  <Link to={`/profile/${player?.username}/socials`}>
                    <Modal
                      openButton={{
                        className: "Modal__openButton",
                        child: () => (
                          <div className="Profile__dots__imgWrapper">
                            <img
                              className="img-width100"
                              src={
                                require("Common/assets/svg/Profile/Dots.svg")
                                  .default
                              }
                              alt="Действия"
                            />
                          </div>
                        ),
                      }}
                    >
                      <Social playerId={player?.id} />
                    </Modal>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="Profile__main">
        <header className="Profile__main__header">
          <ul className="Profile__main__tabs">
            {[
              { name: "games/now", text: "Игры сейчас" },
              { name: "games/history", text: "История игр" },
              { name: "friends/all", text: "Друзья" },
            ].map((item, index) => (
              <Link key={index} to={`/profile/${username}/${item.name}`}>
                <li
                  className={`Profile__main__tab${
                    item.name === `${tab}/${subTab}` ? "--selected" : ""
                  }`}
                  id={item.name}
                >
                  {item.text}
                </li>
              </Link>
            ))}
          </ul>
        </header>

        {`${tab}/${subTab}` === "games/now" && (
          <GamesHistory tournaments={allTournamentsNow} />
        )}

        {`${tab}/${subTab}` === "games/history" && (
          <GamesHistory tournaments={allTournamentsHistory} />
        )}

        {`${tab}` === "friends" && <Friends {...{ player }} />}

        {/* {`${tab}/${subTab}` === "member/friends" && (
          <Team players={player?.players} />
        )} */}
      </main>
    </div>
  );
};

export default ProfilePage;

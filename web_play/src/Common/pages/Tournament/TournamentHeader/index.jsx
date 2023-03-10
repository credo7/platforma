import "./index.scss";

import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { BsGearFill } from "react-icons/bs";

import moment from "Common/services/moment";

import { GET_TOURNAMENT, SET_STATUS } from "Common/graphql/Tournaments";
import { CREATE_NOTIFICATION_TOURNAMENT } from "Common/graphql/NotificationsTournament";
import {
  CREATE_PLAYER,
  DELETE_PLAYER,
  GET_TOURNAMENTS_PLAYERS,
} from "Common/graphql/TournamentsPlayers";

import { UPDATE_PLAYERS_RATING } from "Common/graphql/PlayersRatings";
import { CREATE_PLAYERS_RATINGS_HISTORIY } from "Common/graphql/PlayersRatingHistories";

import {
  CREATE_TEAM,
  DELETE_TEAM,
  GET_TOURNAMENTS_TEAMS,
} from "Common/graphql/TournamentsTeams";
import { CREATE_TOURNAMETS_TEAM_PLAYER } from "Common/graphql/TournamentsTeamsPlayers";
import { UPDATE_TEAMS_RATING } from "Common/graphql/TeamsRatings";
import { CREATE_TEAMS_RATING_HISTORY } from "Common/graphql/TeamsRatingsHistories";
import { useStore } from "Common/hooks/store";
import { useCreateWalletsTransaction } from "Wallets/apollo/WalletsTransactions";

const TournamentHeader = ({
  tournament,
  tournamentPlayers,
  tournamentTeams,
  tournamentPlayer,
  tournamentTeam,
  isTeamPlayer,
}) => {
  const { store } = useStore();
  const history = useHistory();

  const { createWalletsTransaction } = useCreateWalletsTransaction();

  const tournamentId = tournament.id;

  const { gameId, userId, isAdmin, player, team, user } = store;

  const isPlayer = tournamentPlayer?.playerId === userId;
  const isTeamOwner = tournamentTeam?.team?.ownerId === userId;
  const isAutoClosedRegistrationTeams =
    tournamentTeams?.length === tournament?.slots;
  const isAutoClosedRegistrationSolo =
    tournamentPlayers?.length === tournament?.slots;

  const [cooldown, setCooldown] = useState();

  // status
  const [setStatus] = useMutation(SET_STATUS, {
    refetchQueries: [{ query: GET_TOURNAMENT, variables: { tournamentId } }],
  });

  // tournamentsPlayer
  const [createTournamentsPlayer] = useMutation(CREATE_PLAYER);
  const [deleteTournamentsPlayer] = useMutation(DELETE_PLAYER);

  // tournamentsTeam
  const [createTournamentsTeam, { data: dataCreateTournamentsTeam }] =
    useMutation(CREATE_TEAM);
  const [deleteTournamentsTeam] = useMutation(DELETE_TEAM);
  const [createTournamentsTeamPlayer] = useMutation(
    CREATE_TOURNAMETS_TEAM_PLAYER
  );

  // notification
  const [createNotificationTournament] = useMutation(
    CREATE_NOTIFICATION_TOURNAMENT
  );

  // ratings
  const [updatePlayersRatings] = useMutation(UPDATE_PLAYERS_RATING, {
    // refetchQueries,
  });
  const [createPlayersRatingHistories] = useMutation(
    CREATE_PLAYERS_RATINGS_HISTORIY
  );

  // team ratings
  const [updateTeamsRating] = useMutation(UPDATE_TEAMS_RATING, {
    // refetchQueries,
  });
  const [createTeamsRatingsHistory] = useMutation(CREATE_TEAMS_RATING_HISTORY);

  useEffect(() => {
    if (tournament?.status === "LIVE") {
      history.push(`/tournament/${tournamentId}/party`);
    }
  }, [tournament, tournamentId, history]);

  // change action
  const handleAction = (action) => {
    if (tournament.format === "SOLO") {
      const rqtPlayers = [
        {
          query: GET_TOURNAMENTS_PLAYERS,
          variables: { tournamentId, isAdmin, gameId },
        },
      ];

      switch (action) {
        case "join":
          createTournamentsPlayer({
            variables: {
              tournamentId,
              playerId: userId,
              name: player.username,
              gameId,
              isAdmin,
            },
            refetchQueries: rqtPlayers,
          });

          break;

        case "leave":
          deleteTournamentsPlayer({
            variables: { tournamentId, playerId: userId },
            refetchQueries: rqtPlayers,
          });
          break;

        default:
      }
      setCooldown(3);
    }

    if (tournament.format === "TEAM") {
      const rqtTeams = [
        {
          query: GET_TOURNAMENTS_TEAMS,
          variables: { tournamentId, isAdmin, gameId },
        },
      ];
      switch (action) {
        case "join":
          createTournamentsTeam({
            variables: {
              tournamentsTeam: {
                tournamentId,
                teamId: team.id,
                teamName: team.name,
              },
            },
            refetchQueries: rqtTeams,
          });
          break;

        case "leave":
          deleteTournamentsTeam({
            variables: { tournamentId, teamId: team.id },
            refetchQueries: rqtTeams,
          });
          break;

        default:
      }
      setCooldown(3);
    }
  };

  /* --- заполнение таблицы tournamentsTeamsPlayers --- */
  // dataCreateTournamentsTeam для предотвращения попытки повторной записи
  // при повторном заходе на страницу
  useEffect(() => {
    if (dataCreateTournamentsTeam && tournamentTeam) {
      let teamPlayers = tournamentTeam.team.players.nodes;
      teamPlayers.forEach((item) => {
        createTournamentsTeamPlayer({
          variables: {
            tournamentId: tournamentTeam.tournamentId,
            playerName: item.user?.players?.nodes[0]?.username || "",
            playerId: item.playerId,
            tournamentTeamId: tournamentTeam.id,
          },
        });
      });
    }
  }, [dataCreateTournamentsTeam, tournamentTeam, createTournamentsTeamPlayer]);

  // cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown(cooldown - 1);
    }, 1000);

    cooldown === 0 && clearInterval(timer);

    return () => clearInterval(timer);
  }, [cooldown]);

  const setTeamRating = ({ tTeam, maxPlace = 10 }) => {
    const addElo = maxPlace - parseInt(tTeam.tookPlace);

    const rating = tTeam.team.rating.nodes[0];

    const elo = rating.elo + addElo;

    createTeamsRatingsHistory({
      variables: { gameId, teamId: tTeam.teamId, elo },
    });
    updateTeamsRating({
      variables: { teamsRatingPatch: { elo }, gameId, teamId: tTeam.teamId },
    });
  };

  const setRating = ({ tPlayer, maxPlace = 50 }) => {
    const addElo = maxPlace - parseInt(tPlayer.tookPlace);

    const player = tPlayer.user.player.nodes[0];
    const rating = player.rating.nodes[0];

    if (player && rating) {
      const variables = {
        gameId,
        playerId: player.id,
        elo: rating.elo + addElo,
      };

      createPlayersRatingHistories({ variables });
      updatePlayersRatings({ variables });
    }
  };

  const setWallets = ({ wallet, currentPlace }) => {
    const prize = tournament?.prizes?.nodes?.find(
      (item) => item.place === currentPlace
    );

    if (prize && wallet) {
      createWalletsTransaction({
        walletsTransaction: {
          walletId: wallet.id,
          amount: parseInt(prize.amount),
          comment: `For ${prize.place} place in ${tournament.name}`,
          status: "COMPLETED",
        },
      });
    }
  };

  // set status
  const changeTournamentStatus = (status) => {
    setStatus({ variables: { tournamentId, status } });

    // notification
    if (status === "CONFIRMATION") {
      if (tournament.format === "SOLO") {
        tournamentPlayers.forEach((item) => {
          createNotificationTournament({
            variables: {
              userId: item.playerId,
              tournamentId,
            },
          });
        });
      }
      if (tournament.format === "TEAM") {
        tournamentTeams
          .flatMap((item) => item.team?.players?.nodes)
          .forEach((item) => {
            createNotificationTournament({
              variables: {
                userId: item.playerId,
                tournamentId,
              },
            });
          });
      }
    }

    if (status === "FINISHED") {
      if (tournament.format === "SOLO") {
        tournamentPlayers
          .filter((item) => item.tookPlace && item.tookKill)
          .forEach((item, index) => {
            // ПРИЗ ПОЛУЧАЕТ КАЖДЫЙ УЧАСТНИК
            setWallets({
              wallet: item.user.wallet,
              currentPlace: index + 1,
            });
            setRating({ tPlayer: item });
          });
      }
      if (tournament.format === "TEAM") {
        tournamentTeams
          .filter((item) => item.tookPlace && item.tookKill)
          .forEach((item, index) => {
            // ПРИЗ ПОЛУЧАЕТ ХОЗЯИН КОМАНДЫ
            setWallets({
              wallet: item.team.owner.wallet,
              currentPlace: index + 1,
            });
            setTeamRating({ tTeam: item });
          });
      }
    }

    setCooldown(3);
  };

  const tournamentDetails = ({
    isParty,
    isUserParty,
    link,
    isTeamParty,
    isMyTeamParty,
  }) => {
    return (
      <>
        {(!isTeamPlayer &&
          !isAutoClosedRegistrationTeams &&
          tournament.format === "TEAM") ||
        (!isAutoClosedRegistrationSolo && tournament.format === "SOLO") ||
        (isTeamOwner && tournament.format === "TEAM") ||
        (isPlayer && tournament.format === "SOLO") ? (
          <>
            {!isUserParty && (
              <Link
                to={{
                  pathname: link,
                  state: { from: history.location.pathname },
                }}
              >
                <div className="commonBtn">участвовать</div>
              </Link>
            )}
            {/* ----------------КНОПКА УЧАСТВОВАТЬ НА КОМАНДНОМ--------------------------- */}
            {tournament.status === "REGISTRATION" &&
              tournament.format === "TEAM" &&
              isUserParty &&
              isMyTeamParty && (
                <>
                  {cooldown ? (
                    <div className="commonBtn--disable">{cooldown}</div>
                  ) : (
                    <>
                      {isParty ? (
                        <div
                          className="commonBtn"
                          onClick={() => handleAction(`leave`)}
                        >
                          покинуть
                        </div>
                      ) : (
                        <div
                          className="commonBtn  commonBtn_red"
                          onClick={() => handleAction(`join`)}
                        >
                          участвовать
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

            {/* ----------------КНОПКА УЧАСТВОВАТЬ НА СОЛО--------------------------- */}
            {tournament.status === "REGISTRATION" &&
              tournament.format === "SOLO" &&
              isUserParty &&
              isTeamParty && (
                <>
                  {cooldown ? (
                    <div className="commonBtn--disable">{cooldown}</div>
                  ) : (
                    <>
                      {isParty ? (
                        <div
                          className="commonBtn"
                          onClick={() => handleAction(`leave`)}
                        >
                          покинуть
                        </div>
                      ) : (
                        <div
                          className="commonBtn  commonBtn_red"
                          onClick={() => handleAction(`join`)}
                        >
                          участвовать
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
          </>
        ) : (
          tournament.format === "SOLO" &&
          isAutoClosedRegistrationSolo && (
            <div className="TournamentDetails__isTeamPlayer">
              нет свободных мест
            </div>
          )
        )}

        {tournament.format === "TEAM" &&
          tournament.status === "REGISTRATION" &&
          isTeamPlayer &&
          !isTeamOwner && (
            <div className="TournamentDetails__isTeamPlayer">
              ты играешь в другой команде
            </div>
          )}

        {tournament.status === "UPCOMING" && (
          <div className="TournamentDetails__isTeamPlayer TournamentDetails__isTeamPlayer_wide">
            <span>Регистрация начнется</span>
            <span>
              {moment(new Date(tournament.registrationStartAt)).format(
                "D MMMM HH:mm"
              )}
            </span>
          </div>
        )}

        {tournament.format === "TEAM" &&
          !isMyTeamParty &&
          isUserParty &&
          !isAutoClosedRegistrationTeams && (
            <Link
              className="TournamentDetails__isTeamPlayer"
              to={"/team/settings/friends"}
            >
              в твоей команде нет игроков
            </Link>
          )}
      </>
    );
  };

  return (
    <header className="TournamentDetails__header">
      <div className="TournamentDetails__mainInfo">
        <div className="TournamentDetails__infoBlock">
          <p className="TournamentDetails__topic">
            <span>{tournament.name}</span>
            {isAdmin && (
              <span>
                <Link
                  to={`/admin/tournament/${tournamentId}`}
                  className="TournamentDetails__adminAction editButton"
                >
                  <BsGearFill />
                </Link>
              </span>
            )}
          </p>

          <p className="TournamentDetails__gameType Text-10px-700">
            {tournament?.gameId.replace("_", " ").toLocaleUpperCase()}
          </p>

          <p className="TournamentDetails__date">
            <span className="Text-12px-500">
              {moment(new Date(tournament.liveStartAt)).format("D MMMM HH:mm")}
            </span>
          </p>
        </div>

        <div className="TournamentDetails__btnBlock">
          {tournament?.format === "SOLO" && (
            <>
              {tournamentDetails({
                isParty: !!tournamentPlayer,
                isUserParty: !!player,
                isTeamParty: true,
                link: `/settings/player`,
              })}
            </>
          )}
          {tournament?.format === "TEAM" && (
            <>
              {tournamentDetails({
                isParty: !!tournamentTeam,
                isUserParty: !!team, // есть своя команда
                isTeamParty: !!user?.teamsPlayers?.totalCount, // состоит в какой-либо команде (ПОЧЕМУ-ТО ИСПОЛЬЗУЕТСЯ В СОЛО РЕЖИМЕ - РАЗОБРАТЬСЯ)
                isMyTeamParty:
                  !!user?.teams?.nodes[0]?.teamsPlayers?.totalCount, // в своей команде есть игроки
                link: `/team/settings`,
              })}
            </>
          )}
        </div>
      </div>

      <div className="TournamentDetails__addition">
        <figure className="TournamentDetails__addition__prize">
          <div className="TournamentDetails__addition__prizeImg">
            <img
              className="img-width100"
              src={
                require("Common/assets/svg/Tournament_details/Rub.svg").default
              }
              alt="Rub"
            />
          </div>
          <span>{tournament?.prize}</span>
        </figure>
        <span className="TournametDetails__teamSize">
          {tournament.format === "SOLO" && <>Solo</>}

          {tournament.format === "TEAM" && (
            <>
              {tournament.teamSize === 1 && <>Solo</>}
              {tournament.teamSize === 2 && <>Duo</>}
              {tournament.teamSize === 3 && <>Trio</>}
              {tournament.teamSize === 4 && <>Squad</>}
            </>
          )}
        </span>
        <figure className="TournamentDetails__addition__party">
          <div className="TournamentDetails__addition__partyImg">
            <img
              className="img-width100"
              src={
                require("Common/assets/svg/Tournament_details/Party.svg")
                  .default
              }
              alt="Party"
            />
          </div>
          {tournament.viewSlots && (
            <span>
              {tournament.format === "SOLO" && (
                <>
                  {" "}
                  {tournamentPlayers?.length} / {tournament.slots}
                </>
              )}
              {tournament.format === "TEAM" && (
                <>
                  {tournamentTeams?.length} / {tournament.slots}
                </>
              )}
            </span>
          )}
        </figure>
      </div>

      <div>
        <div className="TournamentDetails__status">
          {tournament.status === "REGISTRATION" ? (
            <>Открыта регистрация!</>
          ) : tournament.status === "CONFIRMATION" ? (
            <>Заходим в лобби!</>
          ) : tournament.status === "LIVE" ? (
            <>Идет игра!</>
          ) : tournament.status === "FINISHED" ? (
            <>Турнир завершен!</>
          ) : (
            ""
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="TournamentDetails__addition">
          {cooldown ? (
            <div className="TournamentDetails__wrapperAdminAction">
              <div className="TournamentDetails__adminAction commonBtn--disable">
                {cooldown}
              </div>
            </div>
          ) : (
            <div className="TournamentDetails__wrapperAdminAction">
              {tournament?.status === "UPCOMING" && (
                <>
                  <div
                    className="TournamentDetails__adminAction commonBtn"
                    onClick={() => changeTournamentStatus("REGISTRATION")}
                  >
                    Открыть регистрацию
                  </div>
                </>
              )}

              {tournament?.status === "REGISTRATION" && (
                <>
                  <div
                    className="TournamentDetails__adminAction commonBtn--error"
                    onClick={() => changeTournamentStatus("UPCOMING")}
                  >
                    Закрыть регистрацию
                  </div>

                  {tournament?.round?.lobbyName ? (
                    <div
                      className={"TournamentDetails__adminAction commonBtn "}
                      onClick={() => changeTournamentStatus("CONFIRMATION")}
                    >
                      Показать всем лобби
                    </div>
                  ) : (
                    <div
                      className={
                        "TournamentDetails__adminAction commonBtn--disable"
                      }
                    >
                      Внесите лобби
                    </div>
                  )}
                </>
              )}

              {tournament?.status === "CONFIRMATION" && (
                <>
                  <div
                    className="TournamentDetails__adminAction commonBtn--error"
                    onClick={() => changeTournamentStatus("REGISTRATION")}
                  >
                    Скрыть лобби
                  </div>

                  <div
                    className={
                      "TournamentDetails__adminAction commonBtn " +
                      tournament?.status
                    }
                    onClick={() => changeTournamentStatus("LIVE")}
                  >
                    Запустить турнир
                  </div>
                </>
              )}

              {tournament?.status === "LIVE" && (
                <>
                  <div
                    className="TournamentDetails__adminAction commonBtn--error"
                    onClick={() => changeTournamentStatus("CONFIRMATION")}
                  >
                    Остановить турнир
                  </div>

                  <div
                    className="TournamentDetails__adminAction commonBtn"
                    onClick={() => {
                      changeTournamentStatus("FINISHED");
                    }}
                  >
                    Завершить турнир
                  </div>
                </>
              )}

              {tournament?.status === "FINISHED" && (
                <>
                  <div
                    className="TournamentDetails__adminAction commonBtn"
                    onClick={() => {
                      changeTournamentStatus("LIVE");
                    }}
                  >
                    Редактировать итоги
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TournamentHeader;

import "./index.scss";

import React, { useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import TournamentInfo from "Common/pages/Tournament/TournamentInfo";
import TournamentRound from "Common/pages/Tournament/TournamentRound";

import { GET_TOURNAMENT, SUB_TOURNAMENT } from "Common/graphql/Tournaments";

import {
  GET_TOURNAMENTS_PLAYERS,
  SUB_TOURNAMENTS_PLAYERS,
} from "Common/graphql/TournamentsPlayers";
import {
  GET_TOURNAMENTS_TEAMS,
  SUB_TOURNAMENTS_TEAMS,
} from "Common/graphql/TournamentsTeams";

import ClientOnly from "Common/components/ClientOnly";
import TournamentHeader from "Common/pages/Tournament/TournamentHeader";
import TournamentParty from "Common/pages/Tournament/TournamentParty";
import { useStore } from "Common/hooks/store";

const TournamentPage = () => {
  const { store } = useStore();

  const history = useHistory();

  const { tournamentId: tId, tabName = "about" } = useParams();

  const tournamentId = tId;

  const { gameId, userId, isAdmin } = store;

  // tournament
  const [
    getTournament,
    { data: dataTournament, subscribeToMore: subTournament },
  ] = useLazyQuery(GET_TOURNAMENT, { pollInterval: 10000 });
  const tournament = dataTournament?.tournamentById;

  // tournament players
  const [
    getTournamentsPlayers,
    { data: dataTournamentPlayers, subscribeToMore: subTournamentPlayers },
  ] = useLazyQuery(GET_TOURNAMENTS_PLAYERS, { pollInterval: 10000 });
  const tournamentPlayers = dataTournamentPlayers?.allTournamentsPlayers.nodes;
  const tournamentPlayer = tournamentPlayers?.find(
    (item) => item.playerId === userId
  );

  const [
    getTournamentsTeams,
    { data: dataTournamentTeams, subscribeToMore: subTournamentTeams },
  ] = useLazyQuery(GET_TOURNAMENTS_TEAMS, { pollInterval: 10000 });
  const tournamentTeams = dataTournamentTeams?.allTournamentsTeams.nodes;
  const tournamentTeam = tournamentTeams?.find(
    (item) => item.team.ownerId === userId
  );

  let isTeamPlayer = tournamentTeams?.map((item) =>
    item.team.players.nodes.find((item) => item.playerId === userId)
  );

  if (isTeamPlayer) {
    isTeamPlayer = !!isTeamPlayer[0];
  }

  useEffect(() => {
    if (tournament?.status === "LIVE") {
      history.push(`/tournament/${tournamentId}/party`);
    }
  }, [tournament, tournamentId, history]);

  // useEffect(() => {
  //   if (dataTournament) {
  //     subTournament({
  //       document: SUB_TOURNAMENT,
  //       variables: { tournamentId },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev;
  //         return Object.assign({}, prev, subscriptionData.data);
  //       },
  //     });
  //   }
  // }, [dataTournament, tournamentId, subTournament]);

  // useEffect(() => {
  //   if (dataTournamentPlayers) {
  //     subTournamentPlayers({
  //       document: SUB_TOURNAMENTS_PLAYERS,
  //       variables: { tournamentId, gameId },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev;
  //         return Object.assign({}, prev, subscriptionData.data);
  //       },
  //     });
  //   }
  // }, [dataTournamentPlayers, tournamentId, gameId, subTournamentPlayers]);

  // useEffect(() => {
  //   if (dataTournamentTeams) {
  //     subTournamentTeams({
  //       document: SUB_TOURNAMENTS_TEAMS,
  //       variables: { tournamentId, gameId },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev;
  //         return Object.assign({}, prev, subscriptionData.data);
  //       },
  //     });
  //   }
  // }, [dataTournamentTeams, tournamentId, gameId, subTournamentTeams]);

  // get dataTournament
  useEffect(() => {
    if (tournamentId) {
      getTournament({ variables: { tournamentId } });
    }
  }, [tournamentId, getTournament]);

  // get dataTournamentPlayers
  useEffect(() => {
    if (tournamentId && gameId) {
      getTournamentsPlayers({
        variables: { tournamentId, gameId },
      });
      getTournamentsTeams({
        variables: { tournamentId, gameId },
      });
    }
  }, [
    tournamentId,
    tournament,
    gameId,
    getTournamentsPlayers,
    getTournamentsTeams,
  ]);

  if (tournament) {
    return (
      <ClientOnly>
        <div className="TournamentDetails">
          <TournamentHeader
            {...{
              tournament,
              tournamentPlayers,
              tournamentTeams,
              tournamentPlayer,
              tournamentTeam,
              isTeamPlayer,
            }}
          />

          <ul className="TournamentDetails__tabs">
            {[
              {
                name: "about",
                text: "Информация",
                linkClass: "",
                condition: true,
              },
              {
                name: "party",
                text: tournament.status === "FINISHED" ? "Итоги" : "Участники",
                linkClass: "",
                condition: true,
              },
              {
                name: "lobby",
                text: "Лобби",
                linkClass:
                  tournament.status === "CONFIRMATION" ? "raundsColorRed" : "",
                condition:
                  tournamentPlayer || tournamentTeam || isTeamPlayer || isAdmin,
              },
            ].map(
              (tab, index) =>
                tab.condition && (
                  <li
                    key={index}
                    className={`TournamentDetails__tab${
                      tabName === tab.name ? "--selected" : ""
                    } ${tab.linkClass}`}
                    id={tab.name}
                  >
                    <div className="RoundCornerWrapperBL">
                      <div className="RoundCornerBL" />
                    </div>
                    <Link to={`/tournament/${tournament.id}/${tab.name}`}>
                      {tab.text}
                    </Link>
                    <div className="RoundCornerWrapperBR">
                      <div className="RoundCornerBR" />
                    </div>
                  </li>
                )
            )}
          </ul>

          <main className="TournamentDetails__main">
            {tabName === "about" && <TournamentInfo tournament={tournament} />}

            {tabName === "party" && (
              <>
                {tournament.format === "SOLO" && (
                  <TournamentParty
                    tournament={tournament}
                    tournamentParty={tournamentPlayers}
                    party={tournamentPlayer}
                  />
                )}
                {tournament.format === "TEAM" && (
                  <TournamentParty
                    tournament={tournament}
                    tournamentParty={tournamentTeams}
                    party={tournamentTeam}
                  />
                )}
              </>
            )}

            {tabName === "lobby" && <TournamentRound tournament={tournament} />}
          </main>
        </div>
      </ClientOnly>
    );
  }

  return null;
};

export default TournamentPage;

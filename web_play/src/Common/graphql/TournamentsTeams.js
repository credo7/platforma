import { gql } from "@apollo/client";

export const TOURNAMETS_TEAMS_FRAGMENT = gql`
  fragment TournamentsTeamsFields on TournamentsTeam {
    id
    teamName
    teamId
    tookPlace
    tookKill
    tournamentId
    team: teamByTeamId {
      id
      image
      captainId
      ownerId
      owner: userByOwnerId {
        wallet: walletByUserId {
          id
        }
      }
      players: teamsPlayersByTeamId {
        nodes {
          id
          playerId
          isCaptain
          user: userByPlayerId {
            username
            image
            id
            online
            players: playersByUserId(condition: { gameId: $gameId }) {
              nodes {
                username
                playerRating: playersRatingsByPlayerId {
                  nodes {
                    elo
                  }
                }
              }
            }
          }
        }
      }
      rating: teamsRatingsByTeamId(condition: { gameId: $gameId }) {
        nodes {
          elo
        }
      }
    }
  }
`;

export const SUB_TOURNAMENTS_TEAMS = gql`
  ${TOURNAMETS_TEAMS_FRAGMENT}
  subscription subTournamentsTeams($tournamentId: UUID!, $gameId: String!) {
    allTournamentsTeams(
      condition: { tournamentId: $tournamentId }
      orderBy: TOOK_PLACE_ASC
    ) {
      nodes {
        ...TournamentsTeamsFields
      }
      totalCount
    }
  }
`;

export const GET_TOURNAMENTS_TEAMS = gql`
  ${TOURNAMETS_TEAMS_FRAGMENT}
  query getTournamentsTeams($tournamentId: UUID!, $gameId: String!) {
    allTournamentsTeams(
      condition: { tournamentId: $tournamentId }
      orderBy: TOOK_PLACE_ASC
    ) {
      nodes {
        ...TournamentsTeamsFields
      }
      totalCount
    }
  }
`;
export const GET_TOURNAMENTS_TEAMS_HISTORY = gql`
  query getTournamentsTeamsNow($playerId: UUID!, $status: [TournamentStatus!]) {
    allTournamentsTeamsPlayers(
      filter: {
        playerId: { equalTo: $playerId }
        tournamentByTournamentId: { status: { in: $status } }
      }
    ) {
      nodes {
        tournamentByTournamentId {
          name
          tournamentsPlayersByTournamentId {
            totalCount
          }
          prize
          liveStartAt
          id
          slots
          game: gameByGameId {
            icon
          }
          teamSize
          format
        }
      }
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation createTournamentsTeam($tournamentsTeam: TournamentsTeamInput!) {
    createTournamentsTeam(input: { tournamentsTeam: $tournamentsTeam }) {
      tournamentsTeam {
        id
      }
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation deleteTournamentsTeam($tournamentId: UUID!, $teamId: UUID!) {
    deleteTournamentsTeamByTournamentIdAndTeamId(
      input: { tournamentId: $tournamentId, teamId: $teamId }
    ) {
      tournamentsTeam {
        id
      }
      deletedTournamentsTeamId
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation updatePlace(
    $id: UUID!
    $tournamentsTeamPatch: TournamentsTeamPatch!
  ) {
    updateTournamentsTeamById(
      input: { tournamentsTeamPatch: $tournamentsTeamPatch, id: $id }
    ) {
      clientMutationId
    }
  }
`;

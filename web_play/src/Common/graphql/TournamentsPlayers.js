import { gql } from "@apollo/client";

export const TOURNAMETS_PLAYERS_FRAGMENT = gql`
  fragment TournamentsPlayersFields on TournamentsPlayer {
    id
    name
    playerId
    tookPlace
    tookKill
    user: userByPlayerId {
      username
      image
      rotate
      wallet: walletByUserId {
        id
      }
      player: playersByUserId(condition: { gameId: $gameId }, first: 1) {
        nodes {
          id
          username
          rating: playersRatingsByPlayerId(
            condition: { gameId: $gameId }
            first: 1
          ) {
            nodes {
              elo
            }
          }
        }
      }
    }
  }
`;

export const SUB_TOURNAMENTS_PLAYERS = gql`
  ${TOURNAMETS_PLAYERS_FRAGMENT}
  subscription subTournamentsPlayers($tournamentId: UUID!, $gameId: String!) {
    allTournamentsPlayers(
      condition: { tournamentId: $tournamentId }
      orderBy: TOOK_PLACE_ASC
    ) {
      nodes {
        ...TournamentsPlayersFields
      }
      totalCount
    }
  }
`;

export const GET_TOURNAMENTS_PLAYERS = gql`
  ${TOURNAMETS_PLAYERS_FRAGMENT}
  query getTournamentsPlayers($tournamentId: UUID!, $gameId: String!) {
    allTournamentsPlayers(
      condition: { tournamentId: $tournamentId }
      orderBy: TOOK_PLACE_ASC
    ) {
      nodes {
        ...TournamentsPlayersFields
      }
      totalCount
    }
  }
`;

export const CREATE_PLAYER = gql`
  ${TOURNAMETS_PLAYERS_FRAGMENT}
  mutation createTournamentsPlayer(
    $tournamentId: UUID!
    $playerId: UUID!
    $name: String!
    $gameId: String!
  ) {
    createTournamentsPlayer(
      input: {
        tournamentsPlayer: {
          tournamentId: $tournamentId
          playerId: $playerId
          name: $name
        }
      }
    ) {
      tournamentsPlayer {
        ...TournamentsPlayersFields
      }
    }
  }
`;

export const DELETE_PLAYER = gql`
  mutation deleteTournamentsPlayer($tournamentId: UUID!, $playerId: UUID!) {
    deleteTournamentsPlayerByTournamentIdAndPlayerId(
      input: { tournamentId: $tournamentId, playerId: $playerId }
    ) {
      tournamentsPlayer {
        id
      }
    }
  }
`;

export const UPDATE_PLAYER = gql`
  mutation updateTournamentsPlayer(
    $id: UUID!
    $tournamentsPlayerPatch: TournamentsPlayerPatch!
  ) {
    updateTournamentsPlayerById(
      input: { tournamentsPlayerPatch: $tournamentsPlayerPatch, id: $id }
    ) {
      clientMutationId
    }
  }
`;

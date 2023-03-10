import { gql } from "@apollo/client";

export const GET_ROUND = gql`
  query getRound($tournamentId: UUID!) {
    tournamentsRoundByTournamentId(tournamentId: $tournamentId) {
      lobbyName
      lobbyPassword
    }
  }
`;

export const CREATE_ROUND = gql`
  mutation createRound($tournamentsRound: TournamentsRoundInput!) {
    createTournamentsRound(input: { tournamentsRound: $tournamentsRound }) {
      clientMutationId
    }
  }
`;

export const UPDATE_ROUND = gql`
  mutation updateRound(
    $tournamentId: UUID!
    $tournamentsRoundPatch: TournamentsRoundPatch!
  ) {
    updateTournamentsRoundByTournamentId(
      input: {
        tournamentsRoundPatch: $tournamentsRoundPatch
        tournamentId: $tournamentId
      }
    ) {
      clientMutationId
    }
  }
`;

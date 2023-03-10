import { gql } from "@apollo/client";

export const CREATE_PRIZE = gql`
  mutation createPrize($input: CreateTournamentsPrizeInput!) {
    createTournamentsPrize(input: $input) {
      clientMutationId
    }
  }
`;

export const DELETE_PRIZE = gql`
  mutation deletePrize($input: DeleteTournamentsPrizeByIdInput!) {
    deleteTournamentsPrizeById(input: $input) {
      clientMutationId
    }
  }
`;

export const UPDATE_PRIZE = gql`
  mutation updatePrize($input: UpdateTournamentsPrizeByIdInput!) {
    updateTournamentsPrizeById(input: $input) {
      clientMutationId
    }
  }
`;

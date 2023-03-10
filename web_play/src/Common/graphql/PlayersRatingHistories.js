import { gql } from "@apollo/client";

export const CREATE_PLAYERS_RATINGS_HISTORIY = gql`
  mutation createPlayersRatingsHistory(
    $gameId: String!
    $playerId: UUID!
    $elo: Int!
  ) {
    createPlayersRatingsHistory(
      input: {
        playersRatingsHistory: {
          gameId: $gameId
          playerId: $playerId
          elo: $elo
        }
      }
    ) {
      clientMutationId
    }
  }
`;

import { gql } from "@apollo/client";

export const CREATE_TEAMS_RATING_HISTORY = gql`
  mutation createTeamsRatingsHistory(
    $gameId: String!
    $teamId: UUID!
    $elo: Int!
  ) {
    createTeamsRatingsHistory(
      input: {
        teamsRatingsHistory: { gameId: $gameId, teamId: $teamId, elo: $elo }
      }
    ) {
      clientMutationId
    }
  }
`;

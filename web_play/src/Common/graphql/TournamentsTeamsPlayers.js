import { gql } from "@apollo/client";

export const CREATE_TOURNAMETS_TEAM_PLAYER = gql`
  mutation createTournamentsTeamsPlayer(
    $tournamentId: UUID!
    $playerName: String!
    $playerId: UUID!
    $tournamentTeamId: UUID!
  ) {
    createTournamentsTeamsPlayer(
      input: {
        tournamentsTeamsPlayer: {
          tournamentId: $tournamentId
          playerName: $playerName
          playerId: $playerId
          tournamentTeamId: $tournamentTeamId
        }
      }
    ) {
      clientMutationId
    }
  }
`;

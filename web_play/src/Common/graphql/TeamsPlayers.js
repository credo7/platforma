import { gql } from "@apollo/client";

export const GET_TEAMS_PLAYERS = gql`
  query getTeamsPlayers($teamId: UUID!) {
    allTeamsPlayers(condition: { teamId: $teamId }) {
      totalCount
      nodes {
        id
        teamId
        playerId
        isCaptain
        player: userByPlayerId {
          username
          players: playersByUserId {
            nodes {
              rating: playersRatingsByPlayerId {
                nodes {
                  elo
                }
              }
            }
          }
        }
        team: teamByTeamId {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_TEAMS_PLAYER = gql`
  mutation createTeamsPlayer($teamsPlayer: TeamsPlayerInput!) {
    createTeamsPlayer(input: { teamsPlayer: $teamsPlayer }) {
      clientMutationId
    }
  }
`;

export const DELETE_TEAMS_PLAYER = gql`
  mutation deleteTeamsPlayer($teamId: UUID!, $playerId: UUID!) {
    deleteTeamsPlayerByTeamIdAndPlayerId(
      input: { teamId: $teamId, playerId: $playerId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_TEAMS_PLAYER = gql`
  mutation updateTeamsPlayer(
    $teamId: UUID!
    $playerId: UUID!
    $teamsPlayerPatch: TeamsPlayerPatch!
  ) {
    updateTeamsPlayerByTeamIdAndPlayerId(
      input: {
        teamsPlayerPatch: $teamsPlayerPatch
        teamId: $teamId
        playerId: $playerId
      }
    ) {
      clientMutationId
    }
  }
`;

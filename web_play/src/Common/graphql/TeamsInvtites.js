import { gql } from "@apollo/client";

export const GET_TEAMS_INVITES = gql`
  query getTeamsInvites($teamId: UUID!) {
    allTeamsInvites(
      condition: { teamId: $teamId, status: "INVITED" }
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        id
        teamId
        playerId
        player: userByPlayerId {
          id
          username
          image
          players: playersByUserId {
            nodes {
              rating: playersRatingsByPlayerId {
                nodes {
                  elo
                }
              }
              playersStats: playersStatsByPlayerId {
                nodes {
                  loss
                  wins
                }
              }
            }
          }
          rotate
        }
      }
    }
  }
`;

export const GET_TEAMS_INVITES_USER = gql`
  query getTeamsInvites($playerId: UUID!) {
    allTeamsInvites(
      condition: { playerId: $playerId, status: "INVITED" }
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        id
        playerId
        teamId
        team: teamByTeamId {
          captainId
          country
          image
          name
          ownerId
          gameId
          teamsRatings: teamsRatingsByTeamId {
            nodes {
              elo
            }
          }
        }
      }
    }
  }
`;

export const DELETE_TEAMS_INVITE = gql`
  mutation deleteTeamsInvite($teamId: UUID!, $playerId: UUID!) {
    deleteTeamsInviteByTeamIdAndPlayerId(
      input: { teamId: $teamId, playerId: $playerId }
    ) {
      clientMutationId
    }
  }
`;

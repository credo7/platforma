import { gql } from "@apollo/client";

export const CREATE_TEAMS_RATING = gql`
  mutation createTeamsRating($gameId: String!, $teamId: UUID!) {
    createTeamsRating(
      input: { teamsRating: { gameId: $gameId, teamId: $teamId } }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_TEAMS_RATING = gql`
  mutation updateTeamsRating(
    $gameId: String!
    $teamId: UUID!
    $teamsRatingPatch: TeamsRatingPatch!
  ) {
    updateTeamsRatingByGameIdAndTeamId(
      input: {
        teamsRatingPatch: $teamsRatingPatch
        gameId: $gameId
        teamId: $teamId
      }
    ) {
      clientMutationId
    }
  }
`;

export const GET_RATING_TEAMS = gql`
  query getTeamsRating(
    $gameId: String!
    $limit: Int = 5
    $offset: Int = 0
    $search: String! = "%%"
  ) {
    node: allTeamsRatings(
      orderBy: ELO_DESC
      condition: { gameId: $gameId }
      filter: { teamByTeamId: { name: { likeInsensitive: $search } } }
      first: $limit
      offset: $offset
    ) {
      nodes {
        elo
        team: teamByTeamId {
          name
          country
          image
          captainId
          players: teamsPlayersByTeamId {
            nodes {
              id
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
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

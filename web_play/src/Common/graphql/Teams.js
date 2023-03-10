import { gql } from "@apollo/client";

export const GET_TEAM_BY_OWNER = gql`
  query getTeamByOwner($gameId: String!, $ownerId: UUID!) {
    team: teamByGameIdAndOwnerId(gameId: $gameId, ownerId: $ownerId) {
      id
      name
      country
      captainId
      image
      ownerId
    }
  }
`;

export const GET_TEAM_BY_NAME = gql`
  query getTeamByName($teamName: String!) {
    teamByName(name: $teamName) {
      captainId
      country
      image
      name
      ownerId
      gameId
      id
      teamsPlayersByTeamId {
        nodes {
          isCaptain
          userByPlayerId {
            image
            rotate
            username
            id
            online
            playersByUserId {
              nodes {
                playersRatingsByPlayerId {
                  nodes {
                    elo
                  }
                }
                username
              }
            }
            teamsPlayersByPlayerId {
              nodes {
                id
              }
            }
          }
        }
      }
      teamsRatingsByTeamId {
        nodes {
          elo
        }
      }
    }
  }
`;

export const UPDATE_TEAM_BY_OWNER = gql`
  mutation updateTeamByOwner(
    $gameId: String!
    $ownerId: UUID!
    $teamPatch: TeamPatch!
  ) {
    updateTeamByGameIdAndOwnerId(
      input: { gameId: $gameId, ownerId: $ownerId, teamPatch: $teamPatch }
    ) {
      team {
        id
      }
    }
  }
`;

export const CREATE_TEAM_BY_OWNER = gql`
  mutation createTeam($team: TeamInput!) {
    createTeam(input: { team: $team }) {
      team {
        id
      }
    }
  }
`;

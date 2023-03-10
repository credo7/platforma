import { gql } from "@apollo/client";

export const GET_RATING_PLAYERS = gql`
  query getRatingPlayers(
    $gameId: String!
    $playerId: UUID!
    $offset: Int = 0
    $limit: Int = 5
    $search: String! = "%%"
  ) {
    node: allPlayersRatings(
      orderBy: ELO_DESC
      condition: { gameId: $gameId }
      filter: { playerByPlayerId: { username: { likeInsensitive: $search } } }
      offset: $offset
      first: $limit
    ) {
      nodes {
        elo
        gameId
        player: playerByPlayerId {
          user: userByUserId {
            id
            username
            image
            rotate
            friendsInvitesByFriendId(condition: { userId: $playerId }) {
              totalCount
            }
            friendsInvitesByUserId(condition: { friendId: $playerId }) {
              totalCount
            }
          }
          stats: playersStatsByPlayerId {
            edges {
              node {
                loss
                wins
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

export const GET_RATING_PLAYER = gql`
  query getRatingPlayer($playerId: UUID!, $gameId: String!) {
    player: playerByGameIdAndUserId(gameId: $gameId, userId: $playerId) {
      playersRatings: playersRatingsByPlayerId {
        nodes {
          elo
        }
      }
    }
  }
`;

export const CREATE_USERS_RATINGS = gql`
  mutation createPlayersRating($gameId: String!, $playerId: UUID!, $elo: Int!) {
    createPlayersRating(
      input: {
        playersRating: { gameId: $gameId, playerId: $playerId, elo: $elo }
      }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_PLAYERS_RATING = gql`
  mutation updatePlayersRating($gameId: String!, $playerId: UUID!, $elo: Int!) {
    updatePlayersRatingByGameIdAndPlayerId(
      input: {
        playersRatingPatch: { elo: $elo }
        gameId: $gameId
        playerId: $playerId
      }
    ) {
      clientMutationId
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_PLAYER = gql`
  query getPlayer($gameId: String!, $userId: UUID!) {
    playerByGameIdAndUserId(gameId: $gameId, userId: $userId) {
      username
    }
  }
`;

export const CREATE_PLAYER = gql`
  mutation createPlayer(
    $gameId: String!
    $userId: UUID!
    $username: String!
    $tag: String!
  ) {
    createPlayer(
      input: {
        player: {
          gameId: $gameId
          userId: $userId
          username: $username
          tag: $tag
        }
      }
    ) {
      player {
        id
      }
    }
  }
`;

export const UPDATE_PLAYER_USERNAME = gql`
  mutation updatePlayersUsername(
    $gameId: String!
    $userId: UUID!
    $username: String!
    $tag: String!
  ) {
    updatePlayerByGameIdAndUserId(
      input: {
        playerPatch: { username: $username, tag: $tag }
        gameId: $gameId
        userId: $userId
      }
    ) {
      clientMutationId
    }
  }
`;

export const ACTIVE_PLAYER = gql`
  mutation setActivePlayer($gameId: String!, $userId: UUID!) {
    updatePlayerByGameIdAndUserId(
      input: { playerPatch: { active: true }, gameId: $gameId, userId: $userId }
    ) {
      clientMutationId
    }
  }
`;

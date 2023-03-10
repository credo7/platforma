import { gql } from "@apollo/client";

export const FIND_FRIEND = gql`
  query findFriend($userId: UUID!, $friendId: UUID!) {
    allFriends(
      filter: { userId: { in: [$userId] }, friendId: { in: [$friendId] } }
    ) {
      nodes {
        id
        accepted
        blocked
        friendId
        userId
      }
    }
  }
`;
export const ADD_FRIEND = gql`
  mutation addFriend(
    $userId: UUID!
    $friendId: UUID!
    $updatedAt: Datetime!
    $createdAt: Datetime!
    $active: Boolean!
  ) {
    createFriend(
      input: {
        friend: {
          userId: $userId
          friendId: $friendId
          updatedAt: $updatedAt
          createdAt: $createdAt
          active: $active
        }
      }
    ) {
      friend {
        id
      }
    }
  }
`;

export const DELETE_FRIEND = gql`
  mutation deleteFriend($userId: UUID!, $friendId: UUID!) {
    deleteFriendByUserIdAndFriendId(
      input: { userId: $userId, friendId: $friendId }
    ) {
      clientMutationId
    }
  }
`;

export const GET_FRIENDS_BY_USER_ID = gql`
  query getFriends($userId: UUID!, $gameId: String!, $friendId: UUID!) {
    allFriends(condition: { userId: $userId }) {
      nodes {
        id
        userId
        friendId
        user: userByFriendId {
          username
          online
          image
          rotate
          players: playersByUserId(condition: { gameId: $gameId }) {
            nodes {
              gameId
              ratings: playersRatingsByPlayerId {
                nodes {
                  elo
                }
              }
            }
          }
          friend: friendsByUserId(condition: { friendId: $friendId }) {
            totalCount
          }
          chatRooms: chatRoomsByChatRoomsUserUserIdAndRoomId {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_FRIENDS_ON_TEAM = gql`
  query getFriends($userId: UUID!, $gameId: String!) {
    allFriends(
      condition: { userId: $userId }
      filter: {
        userByFriendId: {
          teamsPlayersByPlayerIdExist: false
          teamsInvitesByPlayerIdExist: false
        }
      }
    ) {
      nodes {
        id
        userId
        friendId
        user: userByFriendId {
          username
          online
          image
          rotate
          players: playersByUserId(condition: { gameId: $gameId }) {
            nodes {
              gameId
              rating: playersRatingsByPlayerId {
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
`;

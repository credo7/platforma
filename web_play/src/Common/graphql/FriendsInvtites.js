import { gql } from "@apollo/client";

export const GET_FRIENDS_INVITES_BY_USER = gql`
  query getFriendsInvites($userId: UUID!) {
    allFriendsInvites(
      condition: { userId: $userId, status: "INVITED" }
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        id
        userId
        friendId
        user: userByFriendId {
          id
          username
          image
          players: playersByUserId {
            nodes {
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

export const GET_FRIENDS_INVITES_BY_FRIEND = gql`
  query getFriendsInvites($friendId: UUID!) {
    allFriendsInvites(
      condition: { friendId: $friendId, status: "INVITED" }
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        id
        userId
        friendId
        user: userByUserId {
          id
          username
          image
          players: playersByUserId {
            nodes {
              gameId
              rating: playersRatingsByPlayerId {
                nodes {
                  elo
                }
              }
              stats: playersStatsByPlayerId {
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

export const DELETE_FRIENDS_INVITE = gql`
  mutation deleteFriendsInvite($userId: UUID!, $friendId: UUID!) {
    deleteFriendsInviteByUserIdAndFriendId(
      input: { userId: $userId, friendId: $friendId }
    ) {
      clientMutationId
    }
  }
`;

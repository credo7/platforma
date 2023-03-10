import { gql } from "@apollo/client";

export const CREATE_USER_FROM_AUTH = gql`
  mutation createUserFromAuth($id: UUID!, $username: String!, $email: String!) {
    node: createUser(
      input: { user: { id: $id, username: $username, email: $email } }
    ) {
      user {
        id
      }
    }
  }
`;

export const UPDATE_USER_FROM_AUTH = gql`
  mutation updateUserFromAuth($id: UUID!, $username: String!, $email: String!) {
    node: updateUserById(
      input: { id: $id, userPatch: { username: $username, email: $email } }
    ) {
      user {
        id
      }
    }
  }
`;

// ----------------------------------------------------------------------------

export const FRAGMENT_USER = gql`
  fragment User on User {
    id
    username
    email
    image
    rotate
    language
    blockChat
    online
    gameId

    game: gameByGameId {
      image
    }

    players: playersByUserId {
      nodes {
        id
        username
      }
    }

    teams: teamsByOwnerId {
      nodes {
        id
        name
        teamsPlayers: teamsPlayersByTeamId {
          totalCount
        }
      }
    }

    teamsPlayers: teamsPlayersByPlayerId {
      totalCount
    }

    wallet: walletByUserId {
      walletsTransaction: walletsTransactionsByWalletId {
        balance: aggregates {
          sum {
            amount
          }
        }
      }
    }

    notification: notificationsByUserId(condition: { read: false }) {
      totalCount
    }

    notificationTournaments: notificationsTournamentsByUserId(
      condition: { read: false }
    ) {
      totalCount
    }

    messages: chatRostersByToUserId(condition: { read: false }) {
      totalCount
    }
    friendsInvited
    teamsInvited
  }
`;

export const GET_USER_ID = gql`
  query getUserId($email: String!) {
    node: userByEmail(email: $email) {
      id
    }
  }
`;

export const GET_USER = gql`
  ${FRAGMENT_USER}
  query getUserById($userId: UUID!) {
    node: userById(id: $userId) {
      ...User
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  ${FRAGMENT_USER}
  query getUserByEmail($email: String!) {
    node: userByEmail(email: $email) {
      ...User
    }
  }
`;

export const SUB_USER_BY_ID = gql`
  ${FRAGMENT_USER}
  subscription subUserById($userId: UUID!) {
    node: userById(id: $userId) {
      ...User
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query getUserByUsername($username: String!, $playerId: UUID!) {
    userByUsername(username: $username) {
      id
      username
      image
      rotate
      language
      blockChat
      players: playersByUserId {
        nodes {
          gameId
          username
        }
      }
      friend: friendsByUserId(condition: { friendId: $playerId }) {
        totalCount
      }
      playInTeam: teamsByTeamsPlayerPlayerIdAndTeamId {
        nodes {
          name
        }
      }
    }
    chatRooms: allChatRooms(
      filter: {
        chatRoomsUsersByRoomId: {
          some: { userByUserId: { username: { equalTo: $username } } }
        }
        or: {
          chatRoomsUsersByRoomId: { some: { userId: { equalTo: $playerId } } }
        }
      }
    ) {
      nodes {
        id
        name
        chatRoomsUsers: chatRoomsUsersByRoomId {
          totalCount
        }
      }
    }
  }
`;

// CUSTOM
export const UPDATE_USER_ONLINE = gql`
  mutation updateUserOnline($userId: UUID!, $online: Boolean!) {
    node: updateUserById(
      input: { userPatch: { online: $online }, id: $userId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_USER_IMAGE = gql`
  mutation updateUserImage($userId: UUID!, $image: Upload, $rotate: Int!) {
    node: updateUserById(
      input: { userPatch: { image: $image, rotate: $rotate }, id: $userId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_USER_ROTATE = gql`
  mutation updateUserRotate($userId: UUID!, $rotate: Int!) {
    node: updateUserById(
      input: { userPatch: { rotate: $rotate }, id: $userId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_USER_GAMEID = gql`
  mutation updateUserGameId($userId: UUID!, $gameId: String!) {
    node: updateUserById(
      input: { userPatch: { gameId: $gameId }, id: $userId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: UUID!, $userPatch: UserPatch = {}) {
    node: updateUserById(input: { userPatch: $userPatch, id: $id }) {
      clientMutationId
    }
  }
`;

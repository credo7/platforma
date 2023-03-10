import { gql } from "@apollo/client";

export const GET_CHAT_ROOM_BY_NAME = gql`
  query getChatRoom($name: String!, $userId: UUID!) {
    chatRooms: allChatRooms(
      condition: { name: $name }
      filter: {
        chatRoomsUsersByRoomId: { some: { userId: { equalTo: $userId } } }
      }
    ) {
      nodes {
        id
        enc
        chatRoomsUsers: chatRoomsUsersByRoomId {
          nodes {
            user: userByUserId {
              id
              username
            }
          }
        }
      }
    }
  }
`;

export const CHAT_ROOMS = gql`
  fragment ChatRoomsFields on ChatRoom {
    name
    id
    chatRoomsUsers: chatRoomsUsersByRoomId {
      nodes {
        userId
        user: userByUserId {
          username
        }
      }
    }
    chatRosters: chatRostersByRoomId(
      condition: { read: false }
      filter: {
        fromUserId: { notEqualTo: $userId }
        toUserId: { equalTo: $userId }
      }
    ) {
      totalCount
    }
  }
`;

export const SUB_CHAT_ROOMS_BY_USER = gql`
  ${CHAT_ROOMS}
  subscription subChatRooms($userId: UUID!) {
    chatRooms: allChatRooms(
      filter: {
        chatRoomsUsersByRoomId: { some: { userId: { equalTo: $userId } } }
      }
    ) {
      nodes {
        ...ChatRoomsFields
      }
    }
  }
`;

export const GET_CHAT_ROOMS_BY_USER = gql`
  ${CHAT_ROOMS}
  query getChatRooms($userId: UUID!) {
    chatRooms: allChatRooms(
      filter: {
        chatRoomsUsersByRoomId: { some: { userId: { equalTo: $userId } } }
      }
    ) {
      nodes {
        ...ChatRoomsFields
      }
    }
  }
`;

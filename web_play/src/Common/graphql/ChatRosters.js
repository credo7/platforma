import { gql } from "@apollo/client";

export const CHAT_ROSTER = gql`
  fragment ChatRosterFields on ChatRoster {
    createdAt
    message: chatMessageByMessageId {
      id
      text
      createdAt
    }
    user: userByFromUserId {
      id
      username
      image
      rotate
    }
  }
`;

export const SUB_CHAT_ROSTER = gql`
  ${CHAT_ROSTER}
  subscription subChatRoster($roomId: UUID!, $userId: UUID!, $read: Boolean!) {
    roster: allChatRosters(
      orderBy: CREATED_AT_ASC
      condition: { toUserId: $userId, roomId: $roomId, read: $read }
    ) {
      nodes {
        ...ChatRosterFields
      }
    }
  }
`;

export const GET_CHAT_ROSTER = gql`
  ${CHAT_ROSTER}
  query getChatRoster(
    $roomId: UUID!
    $userId: UUID!
    $limit: Int! = 50
    $offset: Int! = 0
  ) {
    roster: allChatRosters(
      orderBy: CREATED_AT_DESC
      condition: { toUserId: $userId, roomId: $roomId }
      first: $limit
      offset: $offset
    ) {
      nodes {
        ...ChatRosterFields
      }
    }
  }
`;

export const GET_CHAT_ROSTER_NEW = gql`
  ${CHAT_ROSTER}
  query getChatRoster($roomId: UUID!, $userId: UUID!) {
    roster: allChatRosters(
      orderBy: CREATED_AT_DESC
      condition: { toUserId: $userId, roomId: $roomId, read: false }
    ) {
      nodes {
        ...ChatRosterFields
      }
    }
  }
`;

export const CHAT_ROSTER_READ = gql`
  mutation chatRosterRead($userId: UUID!, $roomId: UUID!) {
    chatRosterRead(input: { userId: $userId, roomId: $roomId }) {
      boolean
    }
  }
`;

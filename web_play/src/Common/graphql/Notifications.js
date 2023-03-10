import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query getNotifications($userId: UUID!) {
    allNotifications(condition: { userId: $userId, read: false }) {
      nodes {
        id
        message
        title
      }
    }
    allNotificationsTournaments(condition: { userId: $userId, read: false }) {
      nodes {
        id
        tournament: tournamentByTournamentId {
          id
          name
          status
        }
      }
    }
  }
`;

export const READ_NOTIFICATION = gql`
  mutation readNotification($id: UUID!) {
    updateNotificationById(
      input: { notificationPatch: { read: true }, id: $id }
    ) {
      clientMutationId
    }
  }
`;

export const CREATE_NOTIFICATIONS = gql`
  mutation createNotification(
    $userId: UUID!
    $title: String!
    $message: String!
  ) {
    createNotification(
      input: {
        notification: { userId: $userId, message: $message, title: $title }
      }
    ) {
      notification {
        id
      }
    }
  }
`;

export const CREATE_ADMIN_NOTIFICATION = gql`
  mutation createAdminNotification($title: String!, $message: String!) {
    adminNotifications(input: { title: $title, message: $message }) {
      success
    }
  }
`;

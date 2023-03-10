import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_TOURNAMENT = gql`
  mutation createNotificationTournament($userId: UUID!, $tournamentId: UUID!) {
    createNotificationsTournament(
      input: {
        notificationsTournament: {
          userId: $userId
          tournamentId: $tournamentId
        }
      }
    ) {
      clientMutationId
    }
  }
`;

export const READ_NOTIFICATION_TOURNAMENT = gql`
  mutation readNotificationTournament($id: UUID!) {
    updateNotificationsTournamentById(
      input: { notificationsTournamentPatch: { read: true }, id: $id }
    ) {
      clientMutationId
    }
  }
`;

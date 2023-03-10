import { gql } from "@apollo/client";

export const GET_USERS_SOCIAL = gql`
  query getUsersSocial($userId: UUID!) {
    node: usersSocialByUserId(userId: $userId) {
      discord
      facebook
      instagram
      twitch
      vk
      youtube
    }
  }
`;

export const CREATE_USERS_SOCIAL = gql`
  mutation createUsersSocial($usersSocial: UsersSocialInput!) {
    node: createUsersSocial(input: { usersSocial: $usersSocial }) {
      clientMutationId
    }
  }
`;

export const UPDATE_USERS_SOCIAL = gql`
  mutation updateUsersSocial($userId: UUID!, $usersSocial: UsersSocialPatch!) {
    node: updateUsersSocialByUserId(
      input: { userId: $userId, usersSocialPatch: $usersSocial }
    ) {
      clientMutationId
    }
  }
`;

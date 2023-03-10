import { gql } from "@apollo/client";

export const FRAGMENT_AUTH = gql`
  fragment Auth on User {
    id
    email
    role
    updatedAt
    emailVerified
    username
  }
`;

export const GET_AUTH_ID = gql`
  query getAuthId {
    node: userId
  }
`;

export const GET_AUTH = gql`
  ${FRAGMENT_AUTH}
  query getAuth($authId: UUID!) {
    node: userById(id: $authId) {
      ...Auth
    }
  }
`;

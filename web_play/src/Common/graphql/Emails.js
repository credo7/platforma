import { gql } from "@apollo/client";

export const SEND_EMAIL = gql`
  mutation sendEmail($email: String!, $type: EmailType!) {
    node: sendEmail(input: { type: $type, email: $email }) {
      code
    }
  }
`;

export const GET_EMAIL = gql`
  query getEmail($email: String!, $type: EmailType!) {
    email: emailByEmailAndType(email: $email, type: $type) {
      id
      updatedAt
      email
    }
  }
`;

export const GET_CHECK_EMAIL = gql`
  query getCheckEmail($email: String!, $code: String!) {
    node: allEmails(condition: { email: $email, code: $code }) {
      totalCount
    }
  }
`;

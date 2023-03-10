import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const EMAIL_VERIFY = gql`
  fragment EmailVerify on EmailVerify {
    email
    emailAt
    emailCode
    success
    info
  }
`;

export const USER_EMAIL = gql`
  ${EMAIL_VERIFY}
  mutation userEmail($email: String!, $test: Boolean) {
    node: userEmail(input: { email: $email, test: $test }) {
      emailVerify {
        ...EmailVerify
      }
    }
  }
`;

// ! Для тестирования кода без отправки.
const EMAIL_TEST = true;

export const useUserEmail = () => {
  const [userEmail, { data, loading }] = useMutation(USER_EMAIL);
  const email = useMemo(() => data?.node?.emailVerify, [data]);

  const handleEmail = ({ email }) => {
    email && userEmail({ variables: { email, test: EMAIL_TEST } });
  };

  return { loading, email, handleEmail };
};

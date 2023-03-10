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

export const USER_EMAIL_CODE = gql`
  ${EMAIL_VERIFY}
  mutation userEmailCode($email: String!, $test: Boolean) {
    node: userEmailCode(input: { email: $email, test: $test }) {
      emailVerify {
        ...EmailVerify
      }
    }
  }
`;

export const useUserEmailCode = () => {
  const [userEmailCode, { data, loading }] = useMutation(USER_EMAIL_CODE);

  const emailVerify = useMemo(() => data?.node?.emailVerify, [data]);

  const emailSended = useMemo(
    () => emailVerify && (emailVerify?.success || emailVerify?.emailCode),
    [emailVerify]
  );

  const handleEmailCode = ({ email, test = false }) => {
    email &&
      userEmailCode({
        // ! test: true - без отправки письма
        variables: { email, test },
      });
  };

  return {
    loading,
    emailVerify,
    emailSended,
    handleEmailCode,
  };
};

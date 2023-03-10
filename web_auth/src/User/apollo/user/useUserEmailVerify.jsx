import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { GET_USER } from "./useUser";

export const USER_EMAIL_VERIFY = gql`
  mutation userEmailVerify(
    $email: String!
    $code: String!
    $recover: Boolean!
  ) {
    node: userEmailVerify(
      input: { email: $email, code: $code, recover: $recover }
    ) {
      success
    }
  }
`;

export const useUserEmailVerify = () => {
  const [userEmailVerify, { data }] = useMutation(USER_EMAIL_VERIFY);
  const emailVerified = useMemo(() => data?.node?.success, [data]);

  const handleEmailVerify = ({ isAuth, user, data }) => {
    userEmailVerify({
      variables: { ...data, recover: !isAuth },
      refetchQueries: user && [
        { query: GET_USER, variables: { userId: user.id } },
      ],
    });
  };

  return { handleEmailVerify, emailVerified };
};

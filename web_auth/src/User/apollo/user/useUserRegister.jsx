import { useMemo, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const USER_REGISTER = gql`
  mutation userRegister(
    $email: String!
    $username: String!
    $password: String!
  ) {
    node: userRegister(
      input: { email: $email, username: $username, password: $password }
    ) {
      success
    }
  }
`;

export const useUserRegister = () => {
  const [userRegister, { data, error }] = useMutation(USER_REGISTER);
  const isRegister = useMemo(() => data?.node?.success, [data]);
  const isRegisterError = useCallback(
    (rule) => error && error.message?.indexOf(rule) !== -1,
    [error]
  );

  const handleRegister = (data) => {
    userRegister({ variables: data });
  };

  return { handleRegister, isRegister, isRegisterError };
};

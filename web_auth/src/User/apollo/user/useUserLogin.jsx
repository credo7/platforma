import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  mutation userLogin($email: String!, $password: String!) {
    node: userLogin(input: { email: $email, password: $password }) {
      token {
        id
        role
        exp
      }
    }
  }
`;

export const useUserLogin = () => {
  const [userLogin, { data }] = useMutation(USER_LOGIN);
  const userToken = useMemo(() => data?.node?.token, [data]);

  const handleLogin = (data) => {
    userLogin({ variables: data });
  };

  return { userToken, handleLogin };
};

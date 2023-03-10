import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

// ! СДЕЛАТЬ ОТДЕЛЬНУЮ ТАБЛИЦУ

export const USER_LOGIN_ATTEMTS = gql`
  mutation userLoginAttemts($email: String!) {
    node: userLoginAttemts(input: { _email: $email }) {
      loginAttemt {
        attemts
        attemtsAt
      }
    }
  }
`;

export const useUserLoginAttemts = () => {
  const [userLoginAttemts, { data }] = useMutation(USER_LOGIN_ATTEMTS);
  const loginAttemt = useMemo(() => data?.node?.loginAttemt, [data]);

  const handleLoginAttemts = (data) => {
    userLoginAttemts({ variables: data });
  };

  return { loginAttemt, handleLoginAttemts };
};

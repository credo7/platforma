import { useMemo, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useStore } from "Common/hooks/store";

import { GET_USER } from "./useUser";

export const USER_UPDATE = gql`
  mutation userUpdate(
    $email: String!
    $password: String!
    $field: String!
    $value: String!
  ) {
    node: userUpdate(
      input: {
        email: $email
        password: $password
        field: $field
        value: $value
      }
    ) {
      success
    }
  }
`;

export const useUserUpdate = () => {
  const { store } = useStore();
  const { user, userId } = store;

  const [userUpdate, { data, error }] = useMutation(USER_UPDATE, {});
  const isUserUpdate = useMemo(() => data?.node?.success, [data]);
  const isUserUpdateError = useCallback(
    (rule) => error && error.message?.indexOf(rule) !== -1,
    [error]
  );

  const handleUserUpdate = (data) => {
    userUpdate({
      variables: { email: user.email, ...data },
      refetchQueries: [{ query: GET_USER, variables: { userId } }],
    });
  };

  return { handleUserUpdate, isUserUpdate, isUserUpdateError };
};

import { useMemo, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useStore } from "Common/hooks/store";

export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    email
    role
    updatedAt
    emailVerified
    emailAt
    username
  }
`;

export const GET_USER = gql`
  ${USER_FRAGMENT}
  query getUser($userId: UUID!) {
    node: userById(id: $userId) {
      ...User
    }
  }
`;

export const useUser = () => {
  const { store, setStore } = useStore();
  const { userId, isAuth } = store;

  const [getUser, { data }] = useLazyQuery(GET_USER);
  const user = useMemo(() => data?.node, [data]);

  useEffect(() => {
    userId && getUser({ variables: { userId } });
  }, [userId, getUser]);

  useEffect(() => {
    user &&
      setStore((prev) => ({
        ...prev,
        user,
        isAdmin: user.role === "ADMIN",
      }));

    setStore((prev) => ({ ...prev, loading: false }));
  }, [user, setStore, isAuth]);

  return { user };
};

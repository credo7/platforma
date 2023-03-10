import { useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useStore } from "Common/hooks/store";
import { gql } from "@apollo/client";

export const USER_ID = gql`
  query userId {
    node: userId
  }
`;

export const useUserId = () => {
  const { setStore } = useStore();

  const { data } = useQuery(USER_ID);
  const userId = useMemo(() => data?.node, [data]);

  useEffect(() => {
    setStore((prev) => ({ ...prev, userId, isAuth: !!userId }));
  }, [userId, setStore]);

  return { userId };
};

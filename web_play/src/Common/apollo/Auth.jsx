import { useMemo, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

import { GET_AUTH_ID, GET_AUTH } from "Common/graphql/Auth";

import { useStore } from "Common/hooks/store";

// FROM AUTH
export const useGetAuthId = () => {
  const { setStore } = useStore();

  const { data } = useQuery(GET_AUTH_ID, { context: { hasClient: "AUTH" } });
  const authId = useMemo(() => data?.node, [data]);

  useEffect(() => {
    authId && setStore((prev) => ({ ...prev, authId, isAuth: !!authId }));
  }, [authId, setStore]);
};

export const useGetAuth = () => {
  const { store, setStore } = useStore();
  const { authId, isAuth } = store;

  const [get, { data }] = useLazyQuery(GET_AUTH, {
    context: { hasClient: "AUTH" },
  });
  const auth = useMemo(() => data?.node, [data]);

  useEffect(() => {
    authId && get({ variables: { authId } });
  }, [authId, get]);

  useEffect(() => {
    auth &&
      setStore((prev) => ({
        ...prev,
        auth,
        isAdmin: auth.role === "ADMIN",
      }));
  }, [auth, setStore, isAuth]);
};

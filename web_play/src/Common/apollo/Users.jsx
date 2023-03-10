import { useMemo, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  CREATE_USER_FROM_AUTH,
  UPDATE_USER_FROM_AUTH,
  GET_USER,
  UPDATE_USER_ONLINE,
  // SUB_USER_BY_ID,
} from "Common/graphql/Users";

import { useStore } from "Common/hooks/store";

export const useCreateUserFromAuth = () => {
  const { store, setStore } = useStore();
  const { auth, user } = store;

  const [create, { data }] = useMutation(CREATE_USER_FROM_AUTH);
  const userId = useMemo(() => data?.node?.user?.id, [data]);

  useEffect(() => {
    auth && !user && create({ variables: auth });
  }, [auth, user, create]);

  useEffect(() => {
    userId && setStore((prev) => ({ ...prev, userId }));
  }, [userId, setStore]);
};

export const useUpdateUserFromAuth = () => {
  const { store } = useStore();
  const { auth, user } = store;

  const [update] = useMutation(UPDATE_USER_FROM_AUTH);

  useEffect(() => {
    auth && user && update({ variables: auth });
  }, [auth, user, update]);
};

export const useGetUser = () => {
  const { store, setStore } = useStore();
  const { authId } = store;

  // subscribeToMore: subUserById
  const [get, { data }] = useLazyQuery(GET_USER, {
    pollInterval: 15000,
  });
  const user = useMemo(() => data?.node, [data]);

  useEffect(() => {
    authId && get({ variables: { userId: authId } });
  }, [authId, get]);

  useEffect(() => {
    if (user) {
      const bells = {
        notifications: user.notification?.totalCount > 0,
        notificationsTournaments: user?.notificationTournaments?.totalCount > 0,
        messages: user.messages.totalCount > 0,
        balance: user.wallet?.walletsTransaction?.balance.sum.amount > 0,
        friendsInvited: user.friendsInvited > 0,
        teamsInvited: user.teamsInvited > 0,
      };

      setStore((prev) => ({
        ...prev,
        user,
        userId: user.id,
        gameId: user.gameId,
        game: user.game,
        player: user.players?.nodes[0],
        team: user.teams?.nodes[0],
        bells: {
          ...bells,
          all:
            bells.notifications ||
            bells.notificationsTournaments ||
            bells.messages ||
            bells.balance ||
            bells.friendsInvited ||
            bells.teamsInvited,
          notify:
            bells.notifications ||
            bells.notificationsTournaments ||
            bells.friendsInvited ||
            bells.teamsInvited,
        },
      }));
    }
  }, [user, setStore]);

  // useEffect(() => {
  //   userId &&
  //     subUserById &&
  //     subUserById({
  //       document: SUB_USER_BY_ID,
  //       variables: { userId },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev;
  //         return { ...prev, ...subscriptionData.data };
  //       },
  //     });
  // }, [subUserById, userId]);
};

export const useUpdateUserOnline = () => {
  const { store } = useStore();
  const { userId } = store;

  const [update] = useMutation(UPDATE_USER_ONLINE);

  useEffect(() => {
    userId &&
      document.addEventListener("visibilitychange", () => {
        update({ variables: { userId, online: !document.hidden } });
      });
  }, [userId, update]);
};

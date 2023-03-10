import { useMemo, useCallback, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";

import {
  GET_WALLET,
  GET_WALLET_INFO,
  CREATE_WALLET,
  UPDATE_WALLET,
  DELETE_WALLET,
} from "Wallets/graphql/Wallets";
import { GET_USER } from "Common/graphql/Users";

// getOptions
const getOptions = ({ wallet }, options = {}) => ({
  ...options,
  refetchQueries: [
    ...(options?.refetchQueries || []),
    {
      query: GET_WALLET,
      variables: { userId: wallet.userId },
    },
    { query: GET_USER, variables: { userId: wallet.userId } },
  ],
});

// useGetWallet
export const useGetWallet = () => {
  const [get, { data }] = useLazyQuery(GET_WALLET);
  const wallet = useMemo(() => data?.node, [data]);

  const getWallet = useCallback(
    ({ userId }) => {
      userId && get({ variables: { userId } });
    },
    [get]
  );

  return { getWallet, wallet };
};

// useCreateWallet
export const useCreateWallet = () => {
  const [create, { data }] = useMutation(CREATE_WALLET);

  const createdWallet = useMemo(() => data?.node?.wallet, [data]);

  const createWallet = useCallback(
    ({ wallet }, options = {}) => {
      wallet &&
        create({ variables: { wallet }, ...getOptions({ wallet }, options) });
    },
    [create]
  );

  return { createWallet, createdWallet };
};

// useUpdateWallet
export const useUpdateWallet = () => {
  const [update, { data }] = useMutation(UPDATE_WALLET);

  const updatedWallet = useMemo(() => data?.node?.wallet, [data]);

  const updateWallet = useCallback(
    ({ wallet }, options = {}) => {
      wallet &&
        update({
          variables: { id: wallet.id, wallet },
          ...getOptions({ wallet }, options),
        });
    },
    [update]
  );

  return { updateWallet, updatedWallet };
};

// useDeleteWallet
export const useDeleteWallet = () => {
  const [del, { data }] = useMutation(DELETE_WALLET);

  const deletedWalletId = useMemo(() => data?.node?.deletedWalletId, [data]);

  const deleteWallet = useCallback(
    ({ wallet }, options = {}) => {
      wallet &&
        del({
          variables: { id: wallet.id },
          ...getOptions({ wallet }, options),
        });
    },
    [del]
  );

  return { deleteWallet, deletedWalletId };
};

// useGetWalletInfo
export const useGetWalletInfo = () => {
  const [get, { data }] = useLazyQuery(GET_WALLET_INFO, {
    pollInterval: 10000,
  });
  const walletInfo = useMemo(() => data?.node, [data]);

  const getWalletInfo = useCallback(
    ({ id }) => {
      id && get({ variables: { id } });
    },
    [get]
  );

  return { getWalletInfo, walletInfo };
};

// useWallet
export const useWallet = ({ userId }, options = {}) => {
  const { getWallet, wallet } = useGetWallet();
  const { getWalletInfo, walletInfo } = useGetWalletInfo();
  const { createWallet, createdWallet } = useCreateWallet();

  useEffect(() => {
    getWallet({ userId });
  }, [userId, getWallet]);

  useEffect(() => {
    wallet && getWalletInfo({ id: wallet.id });
  }, [wallet, getWalletInfo]);

  useEffect(() => {
    userId && wallet === null && createWallet({ wallet: { userId } }, options);
  }, [userId, wallet, createWallet, options]);

  return { wallet, mergedWallet: createdWallet, walletInfo };
};

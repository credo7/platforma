import { useEffect, useMemo, useCallback } from "react";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_WALLETS_TRANSACTION,
  GET_WALLETS_TRANSACTIONS,
  CREATE_WALLETS_TRANSACTION,
  UPDATE_WALLETS_TRANSACTION,
  GET_WALLETS_TRANSACTIONS_STATUSES,
  DELETE_WALLETS_TRANSACTION,
} from "Wallets/graphql/WalletsTransactions";
import { GET_WALLET_INFO } from "Wallets/graphql/Wallets";

// ! НЕ ОБНОВЛЯЮТСЯ ТРАНЗАКЦИИ
// getOptions
const getOptions = ({ walletsTransaction }, options = {}) => ({
  ...options,
  refetchQueries: [
    ...(options?.refetchQueries || []),
    {
      query: GET_WALLETS_TRANSACTIONS,
    },
    {
      query: GET_WALLET_INFO,
      variables: { id: walletsTransaction.walletId },
    },
  ],
});

// useGetWalletsTransaction
export const useGetWalletsTransaction = () => {
  const [get, { data }] = useLazyQuery(GET_WALLETS_TRANSACTION);

  const walletsTransaction = useMemo(() => data?.node, [data]);

  const getWalletsTransaction = useCallback(
    ({ walletId }) => {
      walletId && get({ variables: { walletId } });
    },
    [get]
  );

  return { getWalletsTransaction, walletsTransaction };
};

// useCreateWalletsTransaction
export const useCreateWalletsTransaction = () => {
  const [create, { data }] = useMutation(CREATE_WALLETS_TRANSACTION);

  const createdWalletsTransactions = useMemo(
    () => data?.node?.walletsTransaction,
    [data]
  );

  const createWalletsTransaction = useCallback(
    ({ walletsTransaction }, options = {}) => {
      walletsTransaction &&
        create({
          variables: { walletsTransaction },
          ...getOptions({ walletsTransaction }, options),
        });
    },
    [create]
  );

  return { createWalletsTransaction, createdWalletsTransactions };
};

// useUpdateWalletsTransaction
export const useUpdateWalletsTransaction = () => {
  const [update, { data }] = useMutation(UPDATE_WALLETS_TRANSACTION);

  const updatedWalletsTransaction = useMemo(
    () => data?.node?.walletsTransaction,
    [data]
  );

  const updateWalletsTransaction = useCallback(
    ({ walletsTransaction }, options = {}) => {
      walletsTransaction &&
        update({
          variables: { id: walletsTransaction.id, walletsTransaction },
          ...getOptions({ walletsTransaction }, options),
        });
    },
    [update]
  );

  return { updateWalletsTransaction, updatedWalletsTransaction };
};

// useDeleteWalletsTransaction
export const useDeleteWalletsTransaction = () => {
  const [del, { data }] = useMutation(DELETE_WALLETS_TRANSACTION);

  const deletedWalletsTransaction = useMemo(
    () => data?.node?.deletedWalletsTransactionId,
    [data]
  );

  const deleteWalletsTransaction = useCallback(
    ({ walletsTransaction }, options = {}) => {
      walletsTransaction &&
        del({
          variables: { id: walletsTransaction.id },
          ...getOptions({ walletsTransaction }, options),
        });
    },
    [del]
  );

  return { deleteWalletsTransaction, deletedWalletsTransaction };
};

// useGetWalletsTransactionsStatuses
export const useGetWalletsTransactionsStatuses = () => {
  const { data } = useQuery(GET_WALLETS_TRANSACTIONS_STATUSES);

  const walletsTransactionsStatuses = useMemo(
    () => data?.node?.nodes?.filter((item) => item !== "PROCESSED") || null,
    [data]
  );

  return { walletsTransactionsStatuses };
};

// useGetWalletsTransactions
export const useGetWalletsTransactions = ({
  gameId,
  condition,
  pagination,
}) => {
  const { offset, limit } = pagination;

  const [get, { data }] = useLazyQuery(GET_WALLETS_TRANSACTIONS);

  const walletsTransactions = useMemo(() => data?.node.nodes || null, [data]);
  const walletsTransactionsPageInfo = useMemo(
    () => data?.node.pageInfo,
    [data]
  );

  useEffect(() => {
    gameId && get({ variables: { gameId, condition, offset, limit } });
  }, [gameId, condition, offset, limit, get]);

  return {
    walletsTransactions,
    walletsTransactionsPageInfo,
  };
};

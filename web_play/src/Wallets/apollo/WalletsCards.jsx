import { useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

import {
  GET_WALLETS_CARD,
  CREATE_WALLETS_CARD,
  UPDATE_WALLETS_CARD,
  DELETE_WALLETS_CARD,
  GET_WALLETS_CARDS_WHERE,
} from "Wallets/graphql/WalletsCards";
import { GET_WALLET_INFO } from "Wallets/graphql/Wallets";

// getOptions
const getOptions = ({ walletsCard }, options = {}) => ({
  ...options,
  refetchQueries: [
    ...(options?.refetchQueries || []),
    {
      query: GET_WALLETS_CARD,
      variables: { walletId: walletsCard.walletId },
    },
    {
      query: GET_WALLET_INFO,
      variables: { id: walletsCard.walletId },
    },
  ],
});

// useGetWalletsCard
export const useGetWalletsCard = () => {
  const [get, { data }] = useLazyQuery(GET_WALLETS_CARD);

  const walletsCard = useMemo(() => data?.node?.nodes[0] || null, [data]);

  const getWalletsCard = useCallback(
    ({ walletId }) => {
      walletId && get({ variables: { walletId } });
    },
    [get]
  );

  return { getWalletsCard, walletsCard };
};

// useCreateWalletsCard
export const useCreateWalletsCard = () => {
  const [create, { data }] = useMutation(CREATE_WALLETS_CARD);

  const createdWalletsCard = useMemo(() => data?.node?.walletsCard, [data]);

  const createWalletsCard = useCallback(
    ({ walletsCard }, options = {}) => {
      walletsCard &&
        create({
          variables: { walletsCard },
          ...getOptions({ walletsCard }, options),
        });
    },
    [create]
  );

  return { createWalletsCard, createdWalletsCard };
};

// useUpdateWalletsCard
export const useUpdateWalletsCard = () => {
  const [update, { data }] = useMutation(UPDATE_WALLETS_CARD);

  const updatedWalletsCard = useMemo(() => data?.node?.walletsCard, [data]);

  const updateWalletsCard = useCallback(
    ({ walletsCard }, options = {}) => {
      walletsCard &&
        update({
          variables: { id: walletsCard.id, walletsCard },
          ...getOptions({ walletsCard }, options),
        });
    },
    [update]
  );

  return { updateWalletsCard, updatedWalletsCard };
};

// useDeleteWalletsCard
export const useDeleteWalletsCard = () => {
  const [del, { data }] = useMutation(DELETE_WALLETS_CARD);

  const deletedWalletsCardId = useMemo(
    () => data?.node?.deletedWalletsCardId,
    [data]
  );

  const deleteWalletsCard = useCallback(
    ({ walletsCard }, options = {}) => {
      walletsCard &&
        del({
          variables: { id: walletsCard.id },
          ...getOptions({ walletsCard }, options),
        });
    },
    [del]
  );

  return { deleteWalletsCard, deletedWalletsCardId };
};

// useGetWalletsCardsWhere
export const useGetWalletsCardsWhere = () => {
  const { data } = useQuery(GET_WALLETS_CARDS_WHERE);

  const walletsCardsWhere = useMemo(() => data?.node?.nodes, [data]);

  return { walletsCardsWhere };
};

// useWalletsCard
export const useWalletsCard = ({ walletId }) => {
  const { getWalletsCard, walletsCard: currWalletsCard } = useGetWalletsCard();
  const { createWalletsCard, createdWalletsCard } = useCreateWalletsCard();
  const { updateWalletsCard, updatedWalletsCard } = useUpdateWalletsCard();
  const { deleteWalletsCard, deletedWalletsCardId } = useDeleteWalletsCard();

  useEffect(() => {
    getWalletsCard({ walletId });
  }, [walletId, getWalletsCard]);

  const mergeWalletsCard = useCallback(
    ({ walletsCard }) => {
      walletsCard && currWalletsCard === null
        ? createWalletsCard({ walletsCard })
        : updateWalletsCard({ walletsCard });
    },
    [currWalletsCard, createWalletsCard, updateWalletsCard]
  );

  const removeWalletsCard = useCallback(
    ({ walletsCard }) => {
      walletsCard && currWalletsCard && deleteWalletsCard({ walletsCard });
    },
    [currWalletsCard, deleteWalletsCard]
  );

  return {
    walletsCard: currWalletsCard,
    mergeWalletsCard,
    mergedWalletsCard: createdWalletsCard || updatedWalletsCard,
    removeWalletsCard,
    removedWalletsCard: deletedWalletsCardId,
  };
};

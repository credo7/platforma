import { useMemo } from "react";
import { useQuery } from "@apollo/client";

import { GET_WALLETS_BANKS } from "Wallets/graphql/WalletsBanks";

// useGetWalletsBanks
export const useGetWalletsBanks = () => {
  const { data } = useQuery(GET_WALLETS_BANKS);

  const walletsBanks = useMemo(() => data?.node.nodes, [data]);

  return { walletsBanks };
};

import { gql } from "@apollo/client";

export const WALLETS_BANK = gql`
  fragment walletsBank on WalletsBank {
    id
    name
  }
`;

export const GET_WALLETS_BANKS = gql`
  ${WALLETS_BANK}
  query getWalletsBanks {
    node: allWalletsBanks(orderBy: ORDER_ASC) {
      nodes {
        ...walletsBank
      }
    }
  }
`;

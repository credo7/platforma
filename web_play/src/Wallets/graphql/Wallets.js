import { gql } from "@apollo/client";

// QUERY
export const WALLET = gql`
  fragment wallet on Wallet {
    id
  }
`;

export const GET_WALLET = gql`
  ${WALLET}
  query getWallet($userId: UUID!) {
    node: walletByUserId(userId: $userId) {
      ...wallet
    }
  }
`;

// MUTATION
export const CREATE_WALLET = gql`
  ${WALLET}
  mutation createWallet($wallet: WalletInput!) {
    node: createWallet(input: { wallet: $wallet }) {
      wallet {
        ...wallet
      }
    }
  }
`;

export const UPDATE_WALLET = gql`
  ${WALLET}
  mutation updateWallet($id: UUID!, $wallet: WalletPatch!) {
    node: updateWalletById(input: { walletPatch: $wallet, id: $id }) {
      wallet {
        ...wallet
      }
    }
  }
`;

export const DELETE_WALLET = gql`
  mutation deleteWallet($id: UUID!) {
    node: deleteWalletById(input: { id: $id }) {
      deletedWalletId
    }
  }
`;

// QUERY INFO
export const WALLET_INFO = gql`
  ${WALLET}
  fragment walletInfo on Wallet {
    ...wallet
    walletsCard: walletsCardsByWalletId {
      totalCount
    }
    walletsTransaction: walletsTransactionsByWalletId {
      totalCount
      balance: aggregates {
        sum {
          amount
        }
      }
    }
  }
`;

export const GET_WALLET_INFO = gql`
  ${WALLET_INFO}
  query getWalletInfo($id: UUID!) {
    node: walletById(id: $id) {
      ...walletInfo
    }
  }
`;

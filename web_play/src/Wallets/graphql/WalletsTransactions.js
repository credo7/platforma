import { gql } from "@apollo/client";

export const WALLETS_TRANSACTION = gql`
  fragment walletsTransaction on WalletsTransaction {
    id
    walletId
    createdAt
    amount
    comment
    status
  }
`;

export const GET_WALLETS_TRANSACTION = gql`
  ${WALLETS_TRANSACTION}
  query getWalletsTransaction($walletId: UUID!) {
    node: allWalletsTransactions(condition: { walletId: $walletId }, first: 1) {
      nodes {
        ...walletsTransaction
      }
    }
  }
`;

export const CREATE_WALLETS_TRANSACTION = gql`
  ${WALLETS_TRANSACTION}
  mutation createWalletsTransaction(
    $walletsTransaction: WalletsTransactionInput!
  ) {
    node: createWalletsTransaction(
      input: { walletsTransaction: $walletsTransaction }
    ) {
      walletsTransaction {
        ...walletsTransaction
      }
    }
  }
`;

export const UPDATE_WALLETS_TRANSACTION = gql`
  ${WALLETS_TRANSACTION}
  mutation updateWalletsTransactions(
    $id: UUID!
    $walletsTransaction: WalletsTransactionPatch!
  ) {
    node: updateWalletsTransactionById(
      input: { walletsTransactionPatch: $walletsTransaction, id: $id }
    ) {
      walletsTransaction {
        ...walletsTransaction
      }
    }
  }
`;

export const GET_WALLETS_TRANSACTIONS_STATUSES = gql`
  query getWalletsTransactionsStatuses {
    node: getEnum(_typname: "walletsTransactionsStatus") {
      nodes
    }
  }
`;

export const DELETE_WALLETS_TRANSACTION = gql`
  mutation deleteWalletsTransaction($id: UUID!) {
    node: deleteWalletsTransactionById(input: { id: $id }) {
      deletedWalletsTransactionId
    }
  }
`;

// custom
export const GET_WALLETS_TRANSACTIONS = gql`
  ${WALLETS_TRANSACTION}
  query getWalletsTransactions(
    $gameId: String
    $condition: WalletsTransactionCondition
    $offset: Int = 0
    $limit: Int = 5
  ) {
    node: allWalletsTransactions(
      orderBy: CREATED_AT_DESC
      offset: $offset
      first: $limit
      condition: $condition
    ) {
      nodes {
        ...walletsTransaction
        wallet: walletByWalletId {
          walletsCard: walletsCardsByWalletId(first: 1) {
            nodes {
              number
              where
              name
              walletBank: walletsBankByBankId {
                name
              }
            }
          }
          user: userByUserId {
            username
            players: playersByUserId(condition: { gameId: $gameId }) {
              nodes {
                username
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

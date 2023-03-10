import { gql } from "@apollo/client";

export const WALLETS_CARD = gql`
  fragment walletsCard on WalletsCard {
    id
    walletId
    number
    bankId
    where
    name
  }
`;

export const GET_WALLETS_CARD = gql`
  ${WALLETS_CARD}
  query getWalletsCard($walletId: UUID!) {
    node: allWalletsCards(condition: { walletId: $walletId }, first: 1) {
      nodes {
        ...walletsCard
      }
    }
  }
`;

export const CREATE_WALLETS_CARD = gql`
  ${WALLETS_CARD}
  mutation createWalletsCard($walletsCard: WalletsCardInput!) {
    node: createWalletsCard(input: { walletsCard: $walletsCard }) {
      walletsCard {
        ...walletsCard
      }
    }
  }
`;

export const UPDATE_WALLETS_CARD = gql`
  ${WALLETS_CARD}
  mutation updateWalletsCard($id: UUID!, $walletsCard: WalletsCardPatch!) {
    node: updateWalletsCardById(
      input: { walletsCardPatch: $walletsCard, id: $id }
    ) {
      walletsCard {
        ...walletsCard
      }
    }
  }
`;

export const DELETE_WALLETS_CARD = gql`
  mutation deleteWalletsCard($id: UUID!) {
    node: deleteWalletsCardById(input: { id: $id }) {
      deletedWalletsCardId
    }
  }
`;

export const GET_WALLETS_CARDS_WHERE = gql`
  query getWalletsCardsWhere {
    node: getEnum(_typname: "walletsCardsWhere") {
      nodes
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_GAME = gql`
  query getGame($gameId: String!) {
    gameById(id: $gameId) {
      name
      image
      icon
      teamLimit
    }
  }
`;

export const GET_GAMES = gql`
  query getGames {
    games: allGames(orderBy: POSITION_ASC) {
      nodes {
        id
        name
        image
        status
      }
    }
  }
`;

export const GET_GAMES_PUBLISHED = gql`
  query getGamesPublished {
    games: allGames(condition: { status: "published" }, orderBy: POSITION_ASC) {
      nodes {
        id
        name
        image
        status
      }
    }
  }
`;

export const GET_GAME_HISTORY = gql`
  query getGameHistory($name: String!) {
    game: gameById(id: $name) {
      id
      name
      image
      tournaments: tournamentsByGameId(condition: { status: "FINISHED" }) {
        nodes {
          id
          gameId
          name
          slots
          liveStartAt
          prize
          players: tournamentsPlayersByTournamentId {
            totalCount
          }
        }
      }
    }
  }
`;

export const CREATE_GAME = gql`
  mutation createGame($input: CreateGameInput!) {
    createGame(input: $input) {
      game {
        id
      }
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation updateGame($input: UpdateGameByIdInput!) {
    updateGameById(input: $input) {
      clientMutationId
    }
  }
`;

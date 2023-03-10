import { gql } from "@apollo/client";

export const GET_ANONCES = gql`
  query getAnonces($status: TournamentStatus!, $first: Int!) {
    allTournaments(
      condition: { status: $status }
      first: $first
      orderBy: LIVE_START_AT_DESC
    ) {
      nodes {
        id
        name
        liveStartAt
        prize
        image
        gameByGameId {
          image
        }
      }
    }
  }
`;

export const GET_TOURNAMENTS = gql`
  query getTournaments($gameId: String!, $status: [TournamentStatus!]) {
    tournaments: allTournaments(
      condition: { gameId: $gameId }
      orderBy: LIVE_START_AT_DESC
      filter: { status: { in: $status } }
    ) {
      nodes {
        id
        gameId
        name
        slots
        liveStartAt
        prize
        teamSize
        status
        format
        players: tournamentsPlayersByTournamentId {
          totalCount
        }
        game: gameByGameId {
          id
          name
          image
          icon
        }
      }
    }
  }
`;

export const SUB_TOURNAMENT = gql`
  subscription subTournament($tournamentId: UUID!) {
    tournamentById(id: $tournamentId) {
      name
      confirmationEndAt
      confirmationStartAt
      cost
      createdAt
      description
      format
      gameId
      id
      image
      liveEndAt
      liveStartAt
      nodeId
      paid
      premium
      prize
      prizeCurrency
      registrationOpen
      registrationStartAt
      seedCreated
      slots
      status
      teamSize
      updatedAt
      viewSlots
      vpaid
      prizes: tournamentsPrizesByTournamentId(orderBy: PLACE_ASC) {
        nodes {
          id
          addtlImage
          addtlText
          currency
          points
          image
          place
          type
          amount
        }
      }
      rules: tournamentsRulesByTournamentId {
        nodes {
          name
          text
        }
      }
      round: tournamentsRoundByTournamentId {
        lobbyName
      }
    }
  }
`;

export const GET_TOURNAMENT = gql`
  query getTournament($tournamentId: UUID!) {
    tournamentById(id: $tournamentId) {
      name
      confirmationEndAt
      confirmationStartAt
      cost
      createdAt
      description
      format
      gameId
      id
      image
      liveEndAt
      liveStartAt
      nodeId
      paid
      premium
      prize
      prizeCurrency
      registrationOpen
      registrationStartAt
      seedCreated
      slots
      status
      teamSize
      updatedAt
      viewSlots
      vpaid
      prizes: tournamentsPrizesByTournamentId(orderBy: PLACE_ASC) {
        nodes {
          id
          addtlImage
          addtlText
          currency
          points
          image
          place
          type
          amount
        }
      }
      rules: tournamentsRulesByTournamentId {
        nodes {
          name
          text
        }
      }
      round: tournamentsRoundByTournamentId {
        lobbyName
      }
    }
  }
`;

export const GET_TOURNAMENTS_HISTORY = gql`
  query getTournamentsHistory(
    $playerId: UUID!
    $gameId: String!
    $status: [TournamentStatus!]
  ) {
    allTournamentsPlayers(
      condition: { playerId: $playerId }
      filter: {
        tournamentByTournamentId: {
          status: { in: $status }
          gameId: { equalTo: $gameId }
        }
      }
    ) {
      nodes {
        tournamentByTournamentId {
          name
          tournamentsPlayersByTournamentId {
            totalCount
          }
          prize
          liveStartAt
          id
          slots
          game: gameByGameId {
            icon
          }
          format
          teamSize
        }
      }
    }
  }
`;

export const GET_NEAREST_TOURNAMENTS = gql`
  query getNearestTournaments(
    $userId: UUID!
    $gameId: String!
    $status: [TournamentStatus!]
  ) {
    allTournamentsPlayers(
      condition: { playerId: $userId }
      filter: {
        tournamentByTournamentId: {
          status: { in: $status }
          gameId: { equalTo: $gameId }
        }
      }
    ) {
      nodes {
        tournamentByTournamentId {
          id
          name
          gameId
          liveStartAt
        }
      }
    }
    allTournamentsTeamsPlayers(
      condition: { playerId: $userId }
      filter: { tournamentByTournamentId: { status: { in: $status } } }
    ) {
      nodes {
        tournamentByTournamentId {
          id
          name
          gameId
          liveStartAt
        }
      }
    }
  }
`;

export const CREATE_TOURNAMENT = gql`
  mutation createTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      tournament {
        id
      }
    }
  }
`;

export const UPDATE_TOURNAMENT = gql`
  mutation updateTournament($input: UpdateTournamentByIdInput!) {
    updateTournamentById(input: $input) {
      tournament {
        id
      }
    }
  }
`;

export const DELETE_TOURNAMENT = gql`
  mutation deleteTournament($id: Int!) {
    deleteTournamentById(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export const SET_STATUS = gql`
  mutation setStatus($tournamentId: UUID!, $status: TournamentStatus!) {
    updateTournamentById(
      input: { tournamentPatch: { status: $status }, id: $tournamentId }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_TOURNAMENT_IMAGE = gql`
  mutation updateTournamentImage($tournamentId: UUID!, $image: Upload) {
    updateTournamentById(
      input: { tournamentPatch: { image: $image }, id: $tournamentId }
    ) {
      tournament {
        image
      }
    }
  }
`;

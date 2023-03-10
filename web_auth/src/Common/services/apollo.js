import sha256 from "crypto-js/sha256";

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  from,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { RetryLink } from "@apollo/client/link/retry";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const DEV = process.env.NODE_ENV !== "production";
const API_URL = process.env.REACT_APP_API_URL + "/graphql";
const WS_URL =
  process.env.REACT_APP_API_URL.replace(/^http/i, "ws") + "/graphql";

// ! ПЕРЕПИСАТЬ
const batchHttpLink = new BatchHttpLink({
  uri: API_URL,
  batchMax: 5,
  batchInterval: 5000,
});

// retry
const retryLink = new RetryLink();

// hash
const persistedQueriesLink = createPersistedQueryLink({ sha256 });

// ERROR
const errorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, path }) => {
    DEV && console.error(`[GraphQL]: ${path}: ${message}`);
  });

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// USER
const userLink = new ApolloLink(async (operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // "x-access-token": process.env.ACCESS_TOKEN,
    },
  }));

  return forward(operation);
});

// WSS
const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    lazy: true,
  },
});

// UPLOAD == HTTP
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include",
});

// SPLIT
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  uploadLink
);

// CONCAT
const link = concat(
  userLink,
  from([errorLink, splitLink]),
  retryLink,
  batchHttpLink,
  persistedQueriesLink
);

// OPTIONS
const defaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  },
  mutate: {
    errorPolicy: "all",
  },
  subscribe: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  },
};

// client
const client = new ApolloClient({
  defaultOptions,
  link,
  cache: new InMemoryCache(),
  connectToDevTools: false,
});

export default client;

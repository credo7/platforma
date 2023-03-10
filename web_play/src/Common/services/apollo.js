// import sha256 from "crypto-js/sha256";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  // concat,
  from,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
// import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

// CONST
const DEV = process.env.NODE_ENV !== "production";
const API_URL = process.env.REACT_APP_API + "/graphql";
const WS_URL = API_URL.replace(/^http/i, "ws");
const AUTH_URL = process.env.REACT_APP_AUTH_API + "/graphql";

// teaminated links
// apiAuthLink
const apiAuthLink = new HttpLink({
  uri: AUTH_URL,
  credentials: "include",
});

// apiLink
const apiLink = new HttpLink({
  uri: API_URL,
  credentials: "include",
});

// apiBatchLink
const apiBatchLink = new BatchHttpLink({
  uri: API_URL,
  credentials: "include",
  batchMax: 5,
  batchInterval: 1000,
});

// apiWsLink
const apiWsLink = new WebSocketLink({
  uri: WS_URL,
  options: { reconnect: true, lazy: true },
});

// apiUploadLink
const apiUploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include",
});

// -- split
// splitLink
const splitLink = split(
  // if hasClient AUTH or other
  (operation) => operation.getContext().hasClient === "AUTH",
  apiAuthLink,
  split(
    // if query subscription or other
    ({ query }) =>
      getMainDefinition(query).kind === "OperationDefinition" &&
      getMainDefinition(query).operation === "subscription",
    apiWsLink,
    split(
      // if operation hasUpload or other
      (operation) => operation.getContext().hasUpload,
      apiUploadLink,
      split(
        // if operation hasBatch or apiLink
        (operation) => operation.getContext().hasBatch,
        apiBatchLink,
        apiLink
        // apiBatchLink
      )
    )
  )
);

// -- links
// retryLink
const retryLink = new RetryLink();

// createPersistedQueryLink
// const persistedQueriesLink = createPersistedQueryLink({ sha256 });

// contextLink
const contextLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // "x-access-token": process.env.ACCESS_TOKEN,
    },
  }));

  if (operation.variables) {
    // if not hasUpload remove __typename
    const hasUpload = operation.getContext().hasUpload;
    if (!hasUpload) {
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        (key, value) => (key === "__typename" ? undefined : value)
      );
    }

    // if removeFields from object
    const removeFields = operation.getContext().removeFields;
    if (removeFields instanceof Array) {
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        (key, value) => (removeFields.includes(key) ? undefined : value)
      );
    }
  }

  return forward(operation);
});

// errorLink
const errorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, path }) => {
    DEV && console.error(`[GraphQL]: ${path}: ${message}`);
  });

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// client
const client = new ApolloClient({
  defaultOptions: {
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
  },
  link: from([contextLink, retryLink, errorLink, splitLink]),
  cache: new InMemoryCache(),
  connectToDevTools: false,
});

export default client;

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { useHistory } from "react-router";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";


const TOKEN = "token";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  window.location.reload();
  window.location.href = "/";
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};


export const disabledDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};


const uploadHttpLink = createUploadLink({
  uri: "http://localhost:7000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:7000/graphql",
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: localStorage.getItem(TOKEN),
    }),
  },
});

const httpLink = createUploadLink({
  uri: "http://localhost:7000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQL Error", graphQLErrors);
  } else if (networkError) {
    console.log("Network Error", networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
    User: {
      keyFields: (obj) => `User:${obj.username}`,
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

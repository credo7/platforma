import { Pool } from "pg";
import { postgraphile, makePluginHook } from "postgraphile";
import OperationHooks from "@graphile/operation-hooks";

import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import PgManyToManyPlugin from "@graphile-contrib/pg-many-to-many";
import PgSubscriptionsLdsPlugin from "@graphile/subscriptions-lds";
import PostGraphileUploadFieldPlugin from "postgraphile-plugin-upload-field";
import PgAggregatesPlugin from "@graphile/pg-aggregates";

import UploadPlugin from "./UploadYandexS3Plugin";

import AuthPlugin, { getAuthSettings, additionalAuth } from "./AuthPlugin";

const { DEV, DATABASE_URL } = process.env;

const DATABASE_URL_MANUAL = "postgresql://postgres:root@users_db:5432/users_db";

const pgPool = new Pool({
  connectionString: DATABASE_URL_MANUAL,
  max: 300,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const postgraphileApp = (schema) =>
  postgraphile(pgPool, schema, {
    // exportGqlSchemaPath: `${__dirname}/schema.graphql`,
    ownerConnectionString: DATABASE_URL_MANUAL,
    watchPg: true,
    graphiql: !!DEV,
    graphqlRoute: `/${schema}/graphql`,
    graphiqlRoute: `/${schema}/graphiql`,
    enhanceGraphiql: DEV,
    graphiqlCredentials: "include",
    pluginHook: makePluginHook([OperationHooks]),
    appendPlugins: [
      ConnectionFilterPlugin,
      PgManyToManyPlugin,
      PgSubscriptionsLdsPlugin,
      PgAggregatesPlugin,
      PostGraphileUploadFieldPlugin,
      AuthPlugin,
    ],
    graphileBuildOptions: {
      connectionFilterRelations: true,
      connectionFilterPolymorphicForward: true,
      connectionFilterPolymorphicBackward: true,
      uploadFieldDefinitions: [UploadPlugin],
    },
    pgSettings: async (req, res) => getAuthSettings(req, res),
    additionalGraphQLContextFromRequest: async (req, res) =>
      additionalAuth(req, res),
    ignoreRBAC: false,
    dynamicJson: true,
    disableQueryLog: true,
    subscriptions: true,
    subscriptionEventEmitterMaxListeners: 20,
    live: true,
    retryOnInitFail: true,
    setofFunctionsContainNulls: false,
    enableQueryBatching: true,
    legacyRelations: "omit",
    showErrorStack: !!DEV,
    extendedErrors: !!DEV ? ["hint", "detail", "errcode"] : ["errcode"],
    disableDefaultMutations: !(schema === "play"),
  });

export default postgraphileApp;

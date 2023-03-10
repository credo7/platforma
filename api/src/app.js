import config from "./config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { graphqlUploadExpress } from "graphql-upload";

import postgraphile from "./postgraphile";

const { CORS, TOKEN_SECRET, NODE_ENV, API_HOST, API_PORT, API_URL } =
  process.env;
const { postgres_schemas } = global.config;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      return origin?.match(new RegExp(CORS, "ig")) || !origin
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser(TOKEN_SECRET));
app.use(graphqlUploadExpress());

// app.use((req, res, next) => {
//   next();
// });

postgres_schemas?.map((schema) => {
  app.use(postgraphile(schema));
});

app.listen(API_PORT, API_HOST, () => {
  console.info(`----------------------------------------`);
  console.info(`Server running in ${NODE_ENV.toUpperCase()} mode on `);
  postgres_schemas?.map((schema) => {
    console.log(
      `- http://${API_HOST}:${API_PORT}/${schema} OR ${API_URL}/${schema}`
    );
  });
  console.info(`----------------------------------------`);
});

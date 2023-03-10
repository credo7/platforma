import "dotenv/config";

const { NODE_ENV, POSTGRES_SCHEMAS } = process.env;

process.env.DEV = NODE_ENV !== "production";

const postgres_schemas = POSTGRES_SCHEMAS?.split(" ");

export default global.config = {
  postgres_schemas,
};

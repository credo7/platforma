import dotenv from "dotenv";
import { URL } from "url";
import { migrate } from "postgres-migrations";

dotenv.config({ path: `${process.cwd()}/../.env` });

const url = new URL(process.env.DATABASE_URL);

async () => {
  const dbConfig = {
    database: url.pathname.replace("/", ""),
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port,
    // defaultDatabase: "postgres",
    // ensureDatabaseExists: false,
  };

  await migrate(dbConfig, `${process.cwd()}/migrations/old`);
};

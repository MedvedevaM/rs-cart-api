import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWD } = process.env;

export const сlient = new Client({
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWD,
    ssl: {
        rejectUnauthorized: false
    }
});

сlient
  .connect()
  .then(() => console.log("Successfully connected to PostgreSQL"))
  .catch((error) =>
    console.error("Failed to connect to PostgreSQL", error.stack)
  );
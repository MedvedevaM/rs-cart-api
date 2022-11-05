import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWD } = process.env;
let client;
export const getClient = async () => {
  try {
    if (!client) {
      client = new Client({
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DATABASE,
        user: PG_USER,
        password: PG_PASSWD,
        ssl: {
          rejectUnauthorized: false
        }
      });
      await client.connect();

    }
    return client;
  } catch (error) {
    console.error("Failed to connect to PostgreSQL", error, error.stack)
  }
}
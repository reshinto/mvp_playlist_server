import * as pg from "pg";
import * as url from "url";

// Initialise postgres client
let configs;
if ( process.env.DATABASE_URL ) {
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(":");

  configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split("/")[1],
    ssl: true,
  };
} else {
  configs = {
    user: "springfield",
    host: "127.0.0.1",
    database: "project2",
    port: 5432,
  };
}

const pool = new pg.Pool(configs);

export default pool;

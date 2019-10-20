import app from './app';
import pool from "./config/db";

const { PORT = 8080 } = process.env;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // eslint-disable-line no-console

const onClose = function() {
  console.log("closing");

  server.close(() => {
    console.log("Process terminated");

    pool.end(() => console.log("Shut down db connection pool"));
  });
};

process.on("SIGTERM", onClose);
process.on("SIGINT", onClose);

import "dotenv/config";
import cors from "cors";
import express from 'express';
import path from 'path';
import logger from 'morgan';
import errorHandler from "./handlers/error";
import routes from './routes';
import pool from "./config/db";

// Initialise postgres client
pool.on("error", function(err) {
  console.log("idle client error", err.message, err.stack);
});

const app = express();
app.use(cors());
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/users', routes.user);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

export default app;

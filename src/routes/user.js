import {Router as route} from "express";
import {sha256} from "js-sha256";
import pool from "../config/db";

const router = route();
const SALT = process.env.SALT;
/**
 * GET home page
 */
router.get('/', (req, res) => {
  const queryText = "SELECT * FROM users;";
  pool.query(queryText, (err, result) => {
    if (!err) {
      const data = {
        users: result.rows
      }
      res.send(data);
    }
  })
  // const data = {
  //   userData: "from the server"
  // }
  // res.send(data)
});

export default router;

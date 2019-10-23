import {Router as route} from "express";
import {sha256} from "js-sha256";
import pool from "../config/db";
import {validation, checkBlanks, validateEmail} from "../handlers/utils";

const router = route();
const SALT = process.env.SALT;
/**
 * GET home page
 */
router.get('/user', async (req, res) => {
  const user_id = await validation(pool, req, res);
  const queryText = "SELECT id, username, email, created_at FROM users WHERE id=$1;";
  const values = [user_id];
  pool.query(queryText, values, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  })
});

router.post("/register", (req, res) => {
  const {username, email, password} = req.body;
  const getBlanks = checkBlanks(req);
  if (getBlanks !== null) {
    return res.status(403).send({message: `${getBlanks} cannot be blank!`})
  }
  if (validateEmail(email) === false) {
    return res.status(403).send({message: "Invalid email!"})
  }
  const hashedPassword = sha256(password + SALT);
  let queryText = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
  let values = [username, email, hashedPassword];

  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.error("query error:", err.stack);
      const errMsg = {
        message: err.detail
      }
      res.status(403).send(errMsg);
    } else {
      queryText = "SELECT id FROM users WHERE username=$1;";
      values = [username]
      pool.query(queryText, values, (err, result) => {
        const user_id = result.rows[0].id;
        const token = sha256(user_id + SALT);
        res.status(200).send({bearer: token});
      })
    }
  });
});

router.post("/login", (req, res) => {
  const {username, password} = req.body;
  const queryText = `SELECT * from users WHERE username='${username}'`;
  pool.query(queryText, (err, result) => {
    if (err) {
      console.error("query error:", err.stack);
      res.send( "query error" );
    } else {
      console.log("query result:", result.rows);
      // if this user exists in the db
      if ( result.rows.length > 0 ) {
        const hashedRequestPassword = sha256( password + SALT );
        // check to see if the password in request.body matches what's in the db
        if ( hashedRequestPassword === result.rows[0].password ) {
          const user_id = result.rows[0].id;
          const token = sha256(user_id + SALT);
          res.status(200).send({bearer: token});
        } else {
          res.status(403).send({message: "Invalid password!"});
        }
      } else {
        res.status(403).send({message: "Invalid username!"});
      }
    }
  });
});

export default router;

import {Router as route} from "express";
import pool from "../config/db";
import {
  validation,
  checkPlaylistDuplicates,
} from "../handlers/utils";

const router = route();

router.get("/playlists", async (req, res) => {
  const user_id = await validation(pool, req, res);
  const queryText =
    "SELECT * FROM playlists WHERE user_id=$1 ORDER BY created_at DESC;";
  const values = [user_id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.status(401).send({message: "Invalid user!"});
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.get("/playlist", async (req, res) => {
  const {id} = req.query;
  const user_id = await validation(pool, req, res);
  const queryText =
    "SELECT * FROM playlists WHERE user_id=$1 AND playlist_id=$2;";
  const values = [user_id, id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.status(401).send({message: "Invalid user!"});
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.post("/playlist", async (req, res) => {
  const user_id = await validation(pool, req, res);
  let {name} = req.body;
  if (name === "") name = "Unknown Playlist";
  const isDuplicate = await checkPlaylistDuplicates(pool, user_id, name);
  if (!isDuplicate) {
    const queryText =
      "INSERT INTO playlists (user_id, name) VALUES ($1, $2) RETURNING *";
    const values = [user_id, name];
    // console.log(values)
    pool.query(queryText, values, (err, result) => {
      if (err) {
        console.log("query error", err.message);
        res.send("query error");
      } else {
        res.status(200).send({message: "Created playlist successfully!"});
      }
    });
  } else res.status(403).send({message: "This playlist has already been created!"});
});

router.put("/playlist", async (req, res) => {
  let {name, id} = req.body;
  const user_id = await validation(pool, req, res);
  let queryText;
  let values;
  queryText =
    "UPDATE playlists SET name=$1 WHERE user_id=$2 AND playlist_id=$3";
  values = [name, user_id, parseInt(id)];
  await pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res.status(200).send({message: "Updated playlist successfully!"});
    }
  });
});

router.delete("/playlist", async (req, res) => {
  const {id} = req.body;
  const user_id = await validation(pool, req, res);
  const queryText = "DELETE FROM playlists WHERE user_id=$1 AND playlist_id=$2";
  const values = [user_id, parseInt(id)];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res.status(200).send({message: "Deleted playlist successfully!"});
    }
  });
});

export default router;

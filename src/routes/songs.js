import {Router as route} from "express";
import pool from "../config/db";
import {validation, checkSongDuplicates} from "../handlers/utils";

const router = route();

router.get("/songs", async (req, res) => {
  const user_id = await validation(pool, req, res);
  const queryText = "SELECT * FROM songs WHERE user_id=$1";
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

router.post("/songs", async (req, res) => {
  const user_id = await validation(pool, req, res);
  const {title, artist, video_link} = req.body;
  const isDuplicate = await checkSongDuplicates(pool, user_id, video_link);
  if (!isDuplicate) {
    const queryText =
      "INSERT INTO songs (title, artist, video_link, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [title, artist, video_link, user_id];
    pool.query(queryText, values, (err, result) => {
      if (err) {
        console.log("query error", err.message);
        res.send("query error");
      } else {
        res.status(200).send({message: "Add song successfully!"});
      }
    });
  } else res.status(403).send({message: 'This song has already been added!'});
});

router.put("/songs", async (req, res) => {
  const {title, artist, video_link, favorite_id, id} = req.body;
  const user_id = await validation(pool, req, res);
  const queryText =
    "UPDATE songs SET title=$1, artist=$2, video_link=$3, favorite_id=$4 WHERE user_id=$5 AND id=$6";
  const values = [title, artist, video_link, favorite_id, user_id, id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res.status(200).send({message: "Updated song successfully!"});
    }
  });
});

router.delete("/songs", async (req, res) => {
  const {id} = req.body;
  const user_id = await validation(pool, req, res);
  const queryText = "DELETE FROM songs WHERE user_id=$1 AND id=$2";
  const values = [user_id, id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res.status(200).send({message: "Deleted song successfully!"});
    }
  });
});

export default router;

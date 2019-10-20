import {Router as route} from "express";
import pool from "../config/db";

const router = route();

router.get('/songs', (req, res) => {
  const queryText = "SELECT * FROM songs WHERE user_id=$1";
  const user_id = req.cookies["user_id"];
  const values = [user_id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send( "query error" );
    } else {
      res.status(200).send(result.rows);
    }
  })
});


router.post("/songs", (req, res) => {
  const {title, artist, video_link} = req.body;
  const user_id = req.cookies["user_id"];
  const queryText = "SELECT * FROM songs WHERE user_id=$1 AND video_link=$2";
  const values = [user_id, video_link];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send( "query error" );
    } else {
      if (result.rows.length !== 0) {
        res.status(403).send({message: 'This song has already been added!'});
      } else {
        const queryText = "INSERT INTO songs (title, artist, video_link, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [title, artist, video_link, user_id];
        pool.query(queryText, values, (err, result) => {
          if (err) {
            console.log("query error", err.message);
            res.send( "query error" );
          } else {
            res.status(200).send({message: 'Add song successfully!'});
          }
        });
      }
    }
  })
});

// TODO: prevent user from updating existing songs
router.put("/songs", (req, res) => {
  const queryText = "UPDATE songs SET title=$1, artist=$2, video_link=$3, favorite_id=$4 WHERE user_id=$5";
  const user_id = req.cookies["user_id"];
  const {title, artist, video_link, favorite_id} = req.body;
  const values = [title, artist, video_link, favorite_id, user_id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send( "query error" );
    } else {
      res.status(200).send({message: 'Updated song successfully!'});
    }
  });
});

router.delete("/songs", (req, res) => {
  const queryText = "DELETE FROM songs WHERE user_id=$1 AND id=$2";
  const user_id = req.cookies["user_id"];
  const {id} = req.body;
  const values = [user_id, id];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send( "query error" );
    } else {
      res.status(200).send({message: 'Deleted song successfully!'});
    }
  });
});

export default router;

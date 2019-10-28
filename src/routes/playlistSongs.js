import {Router as route} from "express";
import pool from "../config/db";
import {validation, checkPlaylistDuplicates} from "../handlers/utils";

const router = route();

router.get("/playlistsongs", async (req, res) => {
  const {id} = req.query;
  const user_id = await validation(pool, req, res);
  const queryText =
    "SELECT * FROM playlist_songs INNER JOIN playlists ON (playlist_songs.playlist_id = playlists.playlist_id) INNER JOIN songs ON (playlist_songs.song_id = songs.song_id) WHERE playlist_songs.user_id=$1 AND playlist_songs.playlist_id=$2 ORDER BY updated_at DESC;";
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

router.get("/playlistsong", async (req, res) => {
  const {id} = req.query;
  const user_id = await validation(pool, req, res);
  const queryText =
    "SELECT * FROM playlist_songs INNER JOIN playlists ON (playlist_songs.playlist_id = playlists.playlist_id) INNER JOIN songs ON (playlist_songs.song_id = songs.song_id) WHERE playlist_songs.user_id=$1 AND playlist_songs.playlist_songs_id=$2 ORDER BY updated_at DESC;";
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

router.post("/playlistsong", async (req, res) => {
  const user_id = await validation(pool, req, res);
  if (user_id === "") res.status(401).send({message: "Invalid user!"});
  let {playlist_id, songs_list} = req.body;
  const queryText = `INSERT INTO playlist_songs (playlist_id, user_id, song_id) SELECT ${parseInt(playlist_id)} playlist_id, ${parseInt(user_id)} user_id, song_id FROM UNNEST(ARRAY${JSON.stringify(
    songs_list,
  )}) song_id;`;
  pool.query(queryText, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res
        .status(200)
        .send({message: "Added songs into playlist successfully!"});
    }
  });
});

router.delete("/playlistsong", async (req, res) => {
  const {id} = req.body;
  const user_id = await validation(pool, req, res);
  const queryText = "DELETE FROM playlist_songs WHERE user_id=$1 AND playlist_songs_id=$2";
  const values = [user_id, parseInt(id)];
  pool.query(queryText, values, (err, result) => {
    if (err) {
      console.log("query error", err.message);
      res.send("query error");
    } else {
      res.status(200).send({message: "Deleted song from playlist successfully!"});
    }
  });
});

export default router;

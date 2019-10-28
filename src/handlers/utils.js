import {sha256} from "js-sha256";

const SALT = process.env.SALT;

function checkBlanks(req) {
  const keys = Object.keys(req.body);
  for (let i = 0; i < keys.length; i++) {
    if (req.body[keys[i]] === "") return keys[i];
  }
  return null;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

async function validation(pool, req, res) {
  const getUserId = req.headers.authorization;
  let queryText = "SELECT user_id FROM users";
  const result = await pool.query(queryText);
  return verifyUser(getUserId, result);
}

function verifyUser(hashedId, result) {
  for (let i = 0; i < result.rows.length; i++) {
    const id = result.rows[i].user_id;
    const checkHashedUser = sha256(id + SALT);
    // console.log(hashedId === checkHashedUser);
    if (hashedId === checkHashedUser) return parseInt(id);
  }
  return "";
}

async function checkSongDuplicates(pool, user_id, checkValue) {
  const queryText = "SELECT * FROM songs WHERE user_id=$1 AND video_link=$2";
  const values = [user_id, checkValue];
  const result = await pool.query(queryText, values);
  if (result.rows.length !== 0) return true;
  else return false;
}

async function checkPlaylistDuplicates(pool, user_id, checkValue) {
  const queryText = "SELECT * FROM playlists WHERE user_id=$1 AND name=$2";
  const values = [user_id, checkValue];
  const result = await pool.query(queryText, values);
  if (result.rows.length !== 0) return true;
  else return false;
}

function getUrlId(url) {
  if (url.includes("youtube")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return "error";
    }
  } else if (url.includes("dailymotion")) {
    return url.slice(27);
  } else return url;
}

function embedURL(url) {
  const id = getUrlId(url);
  if (id !== "error") {
    if (id.includes("http")) return id;
    else if (id.includes("video"))
      return `https://www.dailymotion.com/embed${id}`;
    else return `https://www.youtube.com/embed/${id}`;
  } else return "error";
}

export {
  checkBlanks,
  validateEmail,
  validation,
  checkSongDuplicates,
  checkPlaylistDuplicates,
  getUrlId,
  embedURL,
};

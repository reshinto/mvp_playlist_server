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
  let queryText = "SELECT id FROM users";
  const result = await pool.query(queryText);
  return verifyUser(getUserId, result);
}

function verifyUser(hashedId, result) {
  console.log(result.rows)
  for (let i = 0; i < result.rows.length; i++) {
    const id = result.rows[i].id;
    const checkHashedUser = sha256(id + SALT);
    console.log(hashedId === checkHashedUser);
    if (hashedId === checkHashedUser) return id;
  }
  return "";
}

async function checkSongDuplicates(pool, user_id, checkValue) {
  const queryText = "SELECT * FROM songs WHERE user_id=$1 AND video_link=$2";
  const values = [user_id, checkValue];
  const result = await pool.query(queryText, values);
  console.log(result);
  if (result.rows.length !== 0) return true;
  else return false;
}

function getUrlId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return "error";
  }
}

function embedURL(url) {
  const id = getUrlId(url);
  console.log(id)
  if (id !== "error") return `https://www.youtube.com/embed/${id}`;
  else return "error";
}

export {checkBlanks, validateEmail, validation, checkSongDuplicates, embedURL};

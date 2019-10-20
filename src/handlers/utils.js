function checkBlanks(req) {
  const keys = Object.keys(req.body)
  for (let i=0; i<keys.length; i++) {
    if (req.body[keys[i]] === "") return keys[i]
  }
  return null;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export {checkBlanks, validateEmail};

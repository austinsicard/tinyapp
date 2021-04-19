const bcrypt = require('bcrypt');

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}
function getUserByEmail(email, users) {

  for (let elem in users) {
    if (users[elem].email === email) {
      return elem;
    }
  }
  return undefined;
}
function passwordChecker(email, password, users) {

  for (let elem in users) {
    if (users[elem].email === email && bcrypt.compareSync(password, users[elem].password)) {

      return users[elem];
    }
  }
  return false;
}
// Takes a userID (ex.UserRandom) and returns an object with all corresponding 
function urlsForUser (userID, urlDatabase) {
  const returnObject = {};

  for (let elem in urlDatabase) {
    if (urlDatabase[elem].userID === userID) {
      returnObject[elem] = {
        longURL: urlDatabase[elem].longURL,
        userID: urlDatabase[elem].userID
      };
    }
  }

  return returnObject;
}


module.exports = { generateRandomString, getUserByEmail, passwordChecker, urlsForUser}
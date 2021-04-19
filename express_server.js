const express = require("express");
const app = express();

const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')

const bcrypt = require('bcrypt');

// Require all our helper functions to be used
const { generateRandomString, getUserByEmail, passwordChecker, urlsForUser } = require('./helpers');

app.use(cookieSession({
  name: 'session',
  keys: ["key1"]
}))

app.use(bodyParser.urlencoded({ extended: true }));

// Database keeping track of our urls and shortUrls
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandom" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  skdoW1: { longURL: "https://www.google.ca", userID: "userRandom" },
  s7ahsk: { longURL: "https://www.gmail.ca", userID: "userRandom" }
};
// Database keeping track of our registered users
const users = {
  "userRandom": {
    id: "userRandom",
    email: "a@b.com",
    password: bcrypt.hashSync("abc", 10)
  },
};

app
  .set("view engine", "ejs");

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Renders the /urls page, if not logged in will redirect to the /login page
app.get("/urls", (req, res) => {
  const userid = req.session.user_id;

  if(!userid) {
    return res.redirect("/login");
  }
  res.render("urls_index", { urlObject: urlsForUser(userid, urlDatabase), user: users[userid] });
});

app.post("/urls", (req, res) => {
  const shortU = generateRandomString(); 

  urlDatabase[shortU] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }

  res
    .redirect(`/urls/${shortU}`);
});

// Renders the log in page
app.get("/login", (req, res) => {

  res.
    render("login");
})

app.post("/login", (req, res) => {

  const user = req.body;
  const checkUser = passwordChecker(user.email, user.password, users)
  if (checkUser) {

    req.session.user_id = checkUser.id
    return res.redirect("/urls");
  }
  return res
    .status(403)
    .send("Error, incorrect login !")
})



app.get("/urls/new", (req, res) => {
  const userid = req.session.user_id;
  const userObject = users[userid];

  if (userid) {
    // const templateVars = { user: userObject }
    return res.render("urls_new", {user: userObject});
  }
  return res.redirect("/login");

});

app.get("/urls/:shortURL", (req, res) => {
  const userid = req.session.user_id;
  // console.log("req:", req.session.user_id)

  // console.log(urlDatabase[req.params.shortURL].userID);
  // console.log("userid:", userid)
  if (userid) {
    const userObject = users[userid];
    if (userid === urlDatabase[req.params.shortURL].userID) {


      const templateVars =
        { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: userObject };

      return res.render("urls_show", templateVars);
    } else {
      return res
      .status(404)
      .send("Unathorized!")
    }
  } 
  res.redirect("/login");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

// Updates Long URL after providing a valid http website and clicking Submit
app.post("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL
  const userid = req.session.user_id;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userid
  }

  res
    .redirect(`/urls/${shortURL}`);
});

//Delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {

  const shortURL = req.params.shortURL; /* Declare shortURL with the value entered from req(:shortURL) 
                                           ex. /urls/b2sz8/delete (shortURL = b2sz8) */

  delete urlDatabase[shortURL]; /* Removes the key (:shortURL) and value associated 
                                   with it from urlDatabase object */
  res
    .redirect("/urls");        // Redirects to /url website after the post request to remove is complete
});

// Logs a User out
app.post("/logout", (req, res) => {
  req.session = null;
  res
    .redirect("/urls");
});

// Renders the register page
app.get("/register", (req, res) => {

  res.render("register");
});

// Registers a user into the database and avoids duplicate emails and incorrect input
app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();

  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send("Error email !")
  }
  if (getUserByEmail(req.body.email, users)) {
    return res
      .status(400)
      .send("Error code 400!")
  }

  // Update global users with newly registered information
  users[randomUserID] = {
    id: randomUserID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }
  req.session.user_id = randomUserID;
  res.redirect("/urls");
})

// APP.LISTEN'S

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// console.log(generateRandomString());


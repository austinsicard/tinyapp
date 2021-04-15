const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Generate Random String Function
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

function emailChecker(email) {

  for (let elem in users) {
    if (users[elem].email === email) {
      return true;
    }
  }
  return false;
}
function passwordChecker(email, password) {

  for (let elem in users) {
    if (users[elem].email === email && users[elem].password === password) {

      console.log(users[elem]);
      return users[elem];

    }
  }
  return false;
}

// Database which keeps tracks of our urls and shortUrls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Database keeping track of registered users
const users = {
  "userRandom": {
    id: "userRandom",
    email: "a@b.com",
    password: "abc"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// APP.SET
app
  .set("view engine", "ejs");

// APP.GET'S
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userid = req.cookies.user_id;
  const userObject = users[userid];

  const templateVars = { urls: urlDatabase, user: userObject }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userid = req.cookies.user_id;
  const userObject = users[userid];

  const templateVars = { user: userObject }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userid = req.cookies.user_id;
  const userObject = users[userid];
  const templateVars =
    { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: userObject };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/login", (req, res) => {

  res.
  render("login");
})
app.post("/login", (req, res) => {

  const user = req.body;
  const checkUser = passwordChecker(user.email, user.password)
  if (checkUser) {
    res
    .cookie("user_id", checkUser.id)
    .redirect("/urls")
  }
  return res
    .status(403)
    .send("Error, incorrect login !")
})

app.get("/register", (req, res) => {

  res.render("register");
});

// APP.POST'S

//Delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {

  const shortURL = req.params.shortURL; /* Declare shortURL with the value entered from req(:shortURL) 
                                           ex. /urls/b2sz8/delete (shortURL = b2sz8) */

  delete urlDatabase[shortURL]; /* Removes the key (:shortURL) and value associated 
                                   with it from urlDatabase object */
  res
    .redirect("/urls");        // Redirects to /url website after the post request to remove is complete
});

// Save a username with res.cookie and redirect to /url
// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   res
//     .cookie('userID', username)
//     .redirect(`/urls`)
// });

app.post("/urls", (req, res) => {
  const shortU = generateRandomString(); // Calling on our function that generates a random String

  urlDatabase[shortU] = req.body.longURL;

  res
    .redirect(`/urls/${shortU}`);
});

app.post("/logout", (req, res) => {
  res
    .clearCookie('user_id')
    .redirect("/urls");
});

app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  
  if (!req.body.email || !req.body.password) {
    return res
    .status(400)
    .send("Error email !")
  }
  if (emailChecker(req.body.email)) {
    return res
    .status(400)
    .send("Error code 400!")
  }
  
  // Update global users with newly registered information
  users[randomUserID] = {
    id: randomUserID,
    email: req.body.email,
    password: req.body.password
  }
  res
    .cookie("user_id", randomUserID)
    .redirect("/urls")
})
// Updates Long URL
app.post("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL
  urlDatabase[shortURL] = req.body.longURL;

  res
    .redirect(`/urls/${shortURL}`);
});

// APP.LISTEN'S

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// console.log(generateRandomString());


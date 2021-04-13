const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

// Generate Random String Function
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

// Database which keeps tracks of our urls and shortUrls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// APP.SET

app.set("view engine", "ejs");

// APP.GET'S

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = 
  { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// APP.POST'S

//Delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {

  const shortURL = req.params.shortURL; /* Declare shortURL with the value entered from req(:shortURL) 
                                           ex. /urls/b2sz8/delete (shortURL = b2sz8) */

  delete urlDatabase[shortURL]; /* Removes the key (:shortURL) and value associated 
                                   with it from urlDatabase object */
  res.redirect("/urls");        // Redirects to /url website after the post request to remove is complete
});

app.post("/urls", (req, res) => {

const shortU = generateRandomString(); // Calling on our function that generates a random String

urlDatabase[shortU] = req.body.longURL; 

  res.redirect(`/urls/${shortU}`);         
});

// Updates Long URL
app.post("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL
  console.log('Hello!......');
  urlDatabase[shortURL] = req.body.longURL; 
  
    res.redirect(`/urls/${shortURL}`);         
  });

// APP.LISTEN'S

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// console.log(generateRandomString());
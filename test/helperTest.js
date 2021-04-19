const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandom" },
  skdoW1: { longURL: "https://www.google.ca", userID: "userRandom" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  s7ahsk: { longURL: "https://www.gmail.ca", userID: "userRandom" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput)
  });
  it('should return undefined for a non-existent email', function() {
    const user = getUserByEmail("test@test.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput)
  });
});

describe('urlsForUser', function() {
  it('should return the correct list of urls for a given user', function() {
  const user = urlsForUser("userRandom", urlDatabase)
    const expectedOutput = { 
    b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandom" },
    skdoW1: { longURL: "https://www.google.ca", userID: "userRandom" },
    s7ahsk: { longURL: "https://www.gmail.ca", userID: "userRandom" }
    }
    assert.deepEqual(user, expectedOutput)
  });
  it('should return an empty object for a user with no urls', function() {
    const user = urlsForUser("testUser", urlDatabase)
      const expectedOutput = {}
  
      assert.deepEqual(user, expectedOutput)
    });
});
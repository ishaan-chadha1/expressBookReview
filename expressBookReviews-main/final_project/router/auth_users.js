const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // This function checks if the username is not empty and does not already exist
  return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password) => {
  // This function checks if the username and password match a user in the users array
  return users.some(user => user.username === username && user.password === password);
}
// Task 6: Register New user
regd_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  console.log('Request body:', req.body); // Log the request body
  console.log('Users before registration:', users); // Log the users array before registration
  if (isValid(username)) {
    users.push({ username, password });
    console.log('Users after registration:', users); // Log the users array after registration
    res.json({message: "Registered successfully"});
  } else {
    res.status(400).json({message: "Invalid username or already taken"});
  }
});
// Task 7: Login as a Registered user
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({username}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({message: "Logged in successfully"});
  } else {
    res.status(400).json({message: "Invalid username or password"});
  }
});

// Task 8: Add/Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const { username, review } = req.body;
  if (book && username === req.user.username) {
    book.reviews[username] = review;
    res.json({message: "Review added/modified successfully"});
  } else {
    res.status(400).json({message: "Invalid request"});
  }
});

// Task 9: Delete book review added by that particular user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const { username } = req.body;
  if (book && username === req.user.username) {
    delete book.reviews[username];
    res.json({message: "Review deleted successfully"});
  } else {
    res.status(400).json({message: "Invalid request"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

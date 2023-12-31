const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = Object.values(books).filter(book => book.author === req.params.author);
  res.json(booksByAuthor);
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksByTitle = Object.values(books).filter(book => book.title === req.params.title);
  res.json(booksByTitle);
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 6: Register New user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (isValid(username) && password) {
    users.push({ username, password });
    res.json({message: "User registered successfully"});
  } else {
    res.status(400).json({message: "Invalid username or password"});
  }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. You can now log in." });
});

// Task 1 & 10: Get the list of books available in the shop (Using Promises)
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });

  getBooks
    .then((booksList) => res.status(200).send(JSON.stringify(booksList, null, 4)))
    .catch((error) => res.status(500).json({ message: error }));
});

// Task 2 & 11: Get book details based on ISBN (Using Promises/Async-Await)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const bookDetails = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(`Book with ISBN ${isbn} not found.`);
      }
    });

    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
  
// Task 3 & 12: Get book details based on author (Using Promises)
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author.toLowerCase();

  new Promise((resolve, reject) => {
    let filteredBooks = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === authorName) {
        filteredBooks.push({ isbn: isbn, ...books[isbn] });
      }
    });

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject(`No books found by author: ${req.params.author}`);
    }
  })
    .then((matchingBooks) => res.status(200).json(matchingBooks))
    .catch((error) => res.status(404).json({ message: error }));
});

// Task 4 & 13: Get all books details based on title (Using Async-Await)
public_users.get('/title/:title', async function (req, res) {
  const titleName = req.params.title.toLowerCase();

  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      let filteredBooks = [];
      Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === titleName) {
          filteredBooks.push({ isbn: isbn, ...books[isbn] });
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(`No books found with title: ${req.params.title}`);
      }
    });

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

module.exports.general = public_users;

  
 

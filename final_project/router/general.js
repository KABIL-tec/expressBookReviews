const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: Get the book list available using Promise/Async-Await (Node/Axios style simulation)
public_users.get('/async', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/isbn/async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
    const book = await getBookByIsbn;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  let filteredBooks = [];
  const keys = Object.keys(books);
  
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({message: "Book not found for this author"});
});

// Task 12: Get book details based on author using Async-Await
public_users.get('/author/async/:author', async function (req, res) {
  const authorName = req.params.author;
  try {
    const getByAuthor = new Promise((resolve, reject) => {
      let filteredBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "Books not found for this author" });
      }
    });
    const result = await getByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  let filteredBooks = [];
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({message: "Book not found with this title"});
});

// Task 13: Get all books based on title using Async-Await
public_users.get('/title/async/:title', async function (req, res) {
  const titleName = req.params.title;
  try {
    const getByTitle = new Promise((resolve, reject) => {
      let filteredBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "Books not found with this title" });
      }
    });
    const result = await getByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;

  
 

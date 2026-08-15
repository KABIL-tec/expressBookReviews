const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // 1. Validate that both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // 2. Check if the username is already taken
    if (doesExist(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // 3. Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
  });

  router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Validate input payload
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // 2. Find user in the database
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // 3. Verify password against the stored hash from Exercise 6
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // 4. Generate JWT payload (Do NOT include sensitive data like passwords)
        const tokenPayload = {
            id: user.id,
            username: user.username
        };

        // 5. Sign the token with an expiration time
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        // 6. Return the token to the client
        return res.status(200).json({
            message: "Login successful.",
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
});

// Get the book list available in the shop
// Assuming books data is imported or defined above
// const books = require('./booksdb.js'); 

public_users.get('/', function (req, res) {
    // Check if books data exists and contains keys
    if (books && Object.keys(books).length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(300).json({ message: "No books found." });
    }
  });
  


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // 1. Extract the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // 2. Find the book in your local data store (e.g., a 'books' object)
    const book = books[isbn];
  
    // 3. Return the book if found, or a 404 error if not found
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const reqAuthor = req.params.author.toLowerCase();
    const booksByAuthor = [];
  
    // Iterate through the books object
    Object.keys(books).forEach(isbn => {
      if (books[isbn].author.toLowerCase() === reqAuthor) {
        booksByAuthor.push({ isbn: isbn, ...books[isbn] });
      }
    });
  
    // Check if any books were found
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const reqTitle = req.params.title.toLowerCase();
    const keys = Object.keys(books);
    const matchingBooks = [];
  
    keys.forEach(key => {
      if (books[key].title.toLowerCase() === reqTitle) {
        matchingBooks.push({ id: key, ...books[key] });
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // 1. Validate that the book exists
    if (!books || !books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // 2. Fetch the reviews
    const reviews = books[isbn].reviews;
  
    // 3. Handle cases where the book exists but has no reviews object
    if (!reviews || Object.keys(reviews).length === 0) {
      return res.status(200).json({ message: "No reviews found for this book", reviews: {} });
    }
  
    // 4. Return existing reviews
    return res.status(200).json(reviews);
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.auth?.username; // Assumes username is stored in session auth
  
    // 1. Check if user is authenticated
    if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  
    // 2. Check if the book exists in your database/object
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // 3. Check if the book has any reviews, and if this specific user has reviewed it
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      // Delete only this user's review
      delete books[isbn].reviews[username];
      return res.status(200).json({ 
        message: `Review for ISBN ${isbn} posted by user ${username} has been deleted.` 
      });
    } else {
      return res.status(404).json({ message: "No review found for this user on this book." });
    }
  });  
    
  // GET route to fetch and return the book list
router.get('/books', async (req, res) => {
    try {
      const response = await axios.get('https://example.com');
      // Sends the data back to the client making the request
      res.status(200).json(response.data); 
    } catch (error) {
      console.error('Error fetching books:', error.message);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });
  function getBookByIsbnPromise(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
        console.log("Book Details:", response.data);
      })
      .catch(error => {
        console.error("Error fetching book details:", error.message);
      });
    }
  // Function to get book details by author using async/await
async function getBooksByAuthor(authorName) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${authorName}`);
    console.log("Book details by Author:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}
const getBookByTitleAsync = async (title) => {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log("Book Details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching book by title:", error.message);
    }
  };
  
  module.exports = router;
          
module.exports.general = public_users;


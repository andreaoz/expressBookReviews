const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const newReview = req.body.review;

  // Check the isbn provided
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found!" });
  }

    // Ensure the reviews array exists
    if (!Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = []; 
    }
  
    // Add the new review to the array
    books[isbn].reviews.push(newReview);
  
  // Send response indicating user addition
  res.status(200).json({
    message: `${username}'s new review has been added.`,
    reviews: books[isbn].reviews // Return updated reviews
  });
  
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username; // Get username from session
  const isbn = req.params.isbn;
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found!" });
  }

  // Ensure the reviews array exists
  if (!Array.isArray(books[isbn].reviews) || books[isbn].reviews.length === 0) {
    return res.status(404).json({ message: "No reviews for this book" });
  }

  // Find the review to delete
  const reviewIndex = books[isbn].reviews.findIndex(review => review.username === username);

  // If no review by the current user is found
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found or you cannot delete other users' reviews" });
  }

  // Delete the review
  books[isbn].reviews.splice(reviewIndex, 1);

  // Send a response indicating success
  res.status(200).json({
    message: `${username}'s review has been deleted.`,
    reviews: books[isbn].reviews // Return updated reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const axios = require('axios');

const getBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/"); // Adjusted to match your route
      console.log("List of books:", response.data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };
  
  // Call the function
  //getBooks();

async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log("Book details:", response.data);
    } catch (error) {
        console.error("Error fetching book details:", error.message);
    }
}
//getBookByISBN(3); 

async function getBookByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log("Book details:", response.data);
    } catch (error) {
        console.error("Error fetching book details:", error.message);
    }
}

//getBookByAuthor("Jane Austen"); 


async function getBookByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log("Book details:", response.data);
    } catch (error) {
        console.error("Error fetching book details:", error.message);
    }
}

getBookByTitle("Fairy tales");
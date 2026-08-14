const express = require('express');
const router = express.Router();
const axios = require('axios');
const lodash = require('lodash');

require('dotenv').config();
const apiKeyBooks = process.env.API_KEY_BOOKS;


router.get('/book/:title', async (req, res) =>{
    try {
    const data = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.title}&key=${apiKeyBooks}`);
    console.log(req.params.title);
    const book = data.data.items[0].volumeInfo;
    res.json({
        bookTitle : book.title || 'Title not available',
        bookAuthor : book.authors ? book.authors.join(', ') : 'Author not available',
        bookCover : book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/150',
        book_isbn_10 : book.industryIdentifiers && book.industryIdentifiers.find(identifier => identifier.type === 'ISBN_10')
    });} 
    // catch(error){
    //     console.log("Error fetching the book:", error);
    // }
    catch (error) {
    console.log(
        "REAL ERROR:",
        error.response?.data || error.message
    );

    res.status(500).json({
        error: error.response?.data || error.message
    });
}
})



router.get('/genre/:subject', async (req, res) => {
    try {
        const subject = req.params.subject;

        console.log("Fetching Home genre:", subject);

        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&maxResults=10&key=${apiKeyBooks}`,
            {
                timeout: 15000
            }
        );

        const books = response.data.items || [];

        const shuffledBooks = lodash.shuffle(books);

        const genreBooks = shuffledBooks.map((book) => {

            const volumeInfo = book.volumeInfo;

            return {
                bookTitle: volumeInfo.title || 'Title not available',

                bookAuthor: volumeInfo.authors
                    ? volumeInfo.authors.join(', ')
                    : 'Author not available',

                bookCover: volumeInfo.imageLinks?.thumbnail
                    ? volumeInfo.imageLinks.thumbnail.replace(
                        'http://',
                        'https://'
                    )
                    : 'https://via.placeholder.com/150'
            };
        });

        console.log(
            `Books found for ${subject}:`,
            genreBooks.length
        );

        res.json(genreBooks);

    } catch (error) {

        console.error(
            "Home genre error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: 'Error fetching the books',
            details: error.message
        });
    }
});

router.get('/view/genre/:subject', async (req, res) => {
    try {
        const subject = req.params.subject;

        console.log("Fetching genre:", subject);

        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&maxResults=40&key=${apiKeyBooks}`,
            {
                timeout: 15000
            }
        );

        const books = response.data.items || [];

        const shuffledBooks = lodash.shuffle(books);

        const genreBooks = [];

        for (const book of shuffledBooks) {

            if (!book || !book.volumeInfo) {
                continue;
            }

            const volumeInfo = book.volumeInfo;

            genreBooks.push({
                bookTitle: volumeInfo.title || 'Title not available',

                bookAuthor: volumeInfo.authors
                    ? volumeInfo.authors.join(', ')
                    : 'Author not available',

                bookCover: volumeInfo.imageLinks?.thumbnail
                    ? volumeInfo.imageLinks.thumbnail.replace(
                        'http://',
                        'https://'
                    )
                    : 'https://via.placeholder.com/150'
            });
        }

        console.log(
            `Books found for ${subject}:`,
            genreBooks.length
        );

        res.json(genreBooks);

    } catch (error) {

        console.error(
            "Error fetching genre books:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: 'Error fetching the books',
            details: error.message
        });
    }
});

router.get('/view/book/:title', async (req, res) => {
    try {
        const title = req.params.title;

        console.log("Fetching book:", title);

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${apiKeyBooks}`;

        console.time("Google Books API");

        const response = await axios.get(url, {
            timeout: 10000
        });

        console.timeEnd("Google Books API");

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        const book = response.data.items[0].volumeInfo;

        res.json({
            bookTitle: book.title || 'Title not available',

            bookAuthor: book.authors
                ? book.authors.join(', ')
                : 'Author not available',

            bookCover: book.imageLinks?.thumbnail
                ? book.imageLinks.thumbnail.replace('http://', 'https://')
                : 'https://via.placeholder.com/150',

            bookDescription: book.description ||
                'Description not available',

            bookPublishedDate: book.publishedDate ||
                'Published date not available',

            bookPublisher: book.publisher ||
                'Not available',

            isbn10: book.industryIdentifiers?.[0]?.identifier ||
                'Not available',

            isbn13: book.industryIdentifiers?.[1]?.identifier ||
                'Not available',

            bookRating: book.averageRating || 'N/A',

            bookCategory: book.categories?.[0] ||
                'N/A'
        });

    } catch (error) {

        console.error("Error fetching the book:", error.message);

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({
                error: "Google Books API request timed out"
            });
        }

        return res.status(500).json({
            error: "Failed to fetch book",
            details: error.message
        });
    }
});


router.get('/search/:title', async(req, res) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.title}&maxResults=40&key=${apiKeyBooks}`);
        const books = response.data.items;
        const Books = [];
        const shuffledBooks = lodash.shuffle(books);

        for (let i = 0; i < shuffledBooks.length; i++) {
            try{
                const book = shuffledBooks[i];
                if (!book || !book.volumeInfo) continue;
                const volumeInfo = book.volumeInfo;
                Books.push({
                    bookTitle: volumeInfo.title || 'Title not available',
                    bookAuthor: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Author not available',
                    bookCover: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'
                });
            } catch(error){console.log("error shuffling books:", error)}
        }


        res.json(Books); 
    } catch (error) {
        console.log("Error fetching the books:", error);
        res.status(500).json({ error: 'Error fetching the books' });
    }  
});


router.get('/view/author/:author', async(req, res) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${req.params.author}&maxResults=40&key=${apiKeyBooks}`);
        const books = response.data.items;
        const Books = [];
        const shuffledBooks = lodash.shuffle(books);

        for (let i = 0; i < shuffledBooks.length; i++) {
            try{
                const book = shuffledBooks[i];
                if (!book || !book.volumeInfo) continue;
                const volumeInfo = book.volumeInfo;
                Books.push({
                    bookTitle: volumeInfo.title || 'Title not available',
                    bookAuthor: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Author not available',
                    bookCover: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'
                });
            } catch(error){console.log("error shuffling books:", error)}
        }


        res.json(Books); 
    } catch (error) {
        console.log("Error fetching the books:", error);
        res.status(500).json({ error: 'Error fetching the books' });
    }  
    
})


// new feed -->
// need to be implemented




module.exports = router;
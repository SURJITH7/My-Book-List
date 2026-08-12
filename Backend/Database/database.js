const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log(
    "SUPABASE KEY:",
    process.env.SUPABASE_KEY ? "Loaded" : "Missing"
);

const router = express.Router();
const supabase = createClient( process.env.SUPABASE_URL,  process.env.SUPABASE_KEY)



// Get username to show on the topbar
router.post('/get/username', async (req, res) => {
    const { data, error } = await supabase
        .from('user')
        .select('name')
        .eq('email', req.body.email)
        .single();

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ userName: data.name });
});

// Submit user data to DB
router.post('/submit/user', async (req, res) => {

    const { userName, email, password } = req.body;

    if (!password){
        return res.status(400).json({ error: 'Password is required' });
    }

    // Check if the name already exists
    const { data: nameCheck, error: nameError } = await supabase
        .from('user')
        .select('name')
        .eq('name', userName);

    if (nameError) {
        console.error('--- SUPABASE NAME CHECK FAILURE ---');
        console.error('Error Details:', nameError);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (nameCheck && nameCheck.length > 0) {
        return res.status(409).json({ error: 'Name already exists' });
    }

    // Check if the email already exists
    const { data: emailCheck, error: emailError } = await supabase
        .from('user')
        .select('email')
        .eq('email', email);

    if (emailError) {
        console.error('--- SUPABASE EMAIL CHECK FAILURE ---');
        console.error('Error Details:', emailError);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (emailCheck && emailCheck.length > 0) {
        return res.status(408).json({ error: 'Email already exists' });
    }

    
    // Insert new user
    const { error: insertError } = await supabase
        .from('user')
        .insert([{ 
            name: userName, 
            email:email,
            password: password
        }]);

    if (insertError) {
        console.error('--- SUPABASE INSERT FAILURE ---');
        console.error('Error Details:', insertError);
        console.error('Data Sent:', { userName, email, password: '[REDACTED]' });
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json({ message: 'Data inserted successfully' });
});

// Add book to DB
router.post('/submit/book', async (req, res) => {
    const title = req.body.title;
    const book = req.body.bookData;
    const score = req.body.score;
    const status = req.body.status;
    const thoughts = req.body.thoughts;

    // Insert new book
    const { data: bookData, error: bookInsertError } = await supabase
        .from('book')
        .insert([{
            title,
            author: book.bookAuthor,
            publisher: book.bookPublisher,
            publishDate: book.bookPublishedDate,
            isbn: book.isbn10 || book.isbn13,
            description: book.bookDescription,
            cover: book.bookCover,
            category: book.bookCategory
        }]).select();

    if (bookInsertError) {
        console.log(bookInsertError);
        return res.status(500).send('Error inserting book data');
    }

    const bookId = bookData[0].bookId; // Get the inserted bookId

    // Get the userId based on email
    const { data: userData, error: userSelectError } = await supabase
        .from('user')
        .select('userId')
        .eq('email', req.body.email)
        .single();

    if (userSelectError) {
        console.log(userSelectError);
        return res.status(500).send('Error fetching user data');
    }

    const userId = userData.userId;

    // Insert post
    const { error: postInsertError } = await supabase
        .from('post')
        .insert([{
            postedDate: new Date().toISOString(),
            score,
            status,
            thoughts,
            bookId,
            postedBy: userId
        }]);

    if (postInsertError) {
        console.log(postInsertError);
        return res.status(500).send('Error creating post');
    }

    res.status(200).send('Posted Successfully');
});

// Get community
router.get('/community', async (req, res) => {
    const { data, error } = await supabase
        .from('post')
        .select(`
            postId,
            postedDate,
            score,
            status,
            thoughts,
            book(title, cover, author),
            user(name)
        `);

    if (error) {
        return console.log(error);
    }
    return res.json(data);
});

// Get books by genre
router.get('/genre/:genre', async (req, res) => {
    const genre = req.params.genre;

    const { data, error } = await supabase
        .from('book')
        .select('bookTitle:title, bookAuthor:author, bookCover:cover')
        .eq('category', genre)
        .limit(10);

    if (error) {
        console.log('GENRE SUPABASE ERROR:', error);

        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }

    return res.json(data);
});



module.exports = router;

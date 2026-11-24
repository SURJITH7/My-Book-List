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
// router.post('/get/username', async (req, res) => {
//     const { data, error } = await supabase
//         .from('user')
//         .select('name')
//         .eq('email', req.body.email)
//         .single();

//     if (error) {
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     return res.status(200).json({ userName: data.name });
// });

// Get username to show on the topbar
router.post('/get/username', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        const { data, error } = await supabase
            .from('user')
            .select('name')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error('USERNAME FETCH ERROR:', error);

            return res.status(500).json({
                error: 'Failed to retrieve username'
            });
        }

        if (!data) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        return res.status(200).json({
            userName: data.name
        });

    } catch (error) {
        console.error('GET USERNAME SERVER ERROR:', error);

        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
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
    try {
        console.log("========== SUBMIT BOOK ==========");
        console.log("Request body:", req.body);

        const { title, bookData, score, status, thoughts, email } = req.body;

        if (!title || !bookData || !email) {
            return res.status(400).json({
                success: false,
                error: "Missing required data"
            });
        }

        // 1. Insert book
        const { data: insertedBook, error: bookInsertError } = await supabase
            .from('book')
            .insert([
                {
                    title: title,
                    author: bookData.bookAuthor,
                    publisher: bookData.bookPublisher,
                    publishDate: bookData.bookPublishedDate,
                    isbn: bookData.isbn10 || bookData.isbn13,
                    description: bookData.bookDescription,
                    cover: bookData.bookCover,
                    category: bookData.bookCategory
                }
            ])
            .select();

        console.log("Inserted book:", insertedBook);
        console.log("Book insert error:", bookInsertError);

        if (bookInsertError) {
            return res.status(500).json({
                success: false,
                step: "book insert",
                error: bookInsertError.message,
                details: bookInsertError
            });
        }

        if (!insertedBook || insertedBook.length === 0) {
            return res.status(500).json({
                success: false,
                step: "book insert",
                error: "Book was not inserted"
            });
        }

        const bookId = insertedBook[0].bookId;

        console.log("BOOK ID:", bookId);

        // 2. Find user
        const { data: userData, error: userSelectError } = await supabase
            .from('user')
            .select('userId')
            .eq('email', email)
            .single();

        console.log("User data:", userData);
        console.log("User error:", userSelectError);

        if (userSelectError) {
            return res.status(500).json({
                success: false,
                step: "user lookup",
                error: userSelectError.message,
                details: userSelectError
            });
        }

        const userId = userData.userId;

        console.log("USER ID:", userId);

        // 3. Insert post
        const { data: postData, error: postInsertError } = await supabase
            .from('post')
            .insert([
                {
                    postedDate: new Date().toISOString(),
                    score: score,
                    status: status,
                    thoughts: thoughts,
                    bookId: bookId,
                    postedBy: userId
                }
            ])
            .select();

        console.log("Inserted post:", postData);
        console.log("Post insert error:", postInsertError);

        if (postInsertError) {
            return res.status(500).json({
                success: false,
                step: "post insert",
                error: postInsertError.message,
                details: postInsertError
            });
        }

        console.log("========== BOOK SUBMITTED SUCCESSFULLY ==========");

        return res.status(200).json({
            success: true,
            message: "Posted Successfully"
        });

    } catch (error) {
        console.error("========== SERVER ERROR ==========");
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
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
        .ilike('category', `%${genre}%`)
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

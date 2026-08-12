const express = require('express');
const cors = require('cors');
const axios = require('axios');
const apiRoutes = require('./Backend/Routes/routes.api.js');
const dbRoutes = require('./Backend/Database/database.js');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'my-book-list', 'dist')));

// const PORT = 5000;
// const apiKey = process.env.API_KEY
const PORT = process.env.PORT || 5000;


app.use('/api', apiRoutes);
app.use('/db', dbRoutes);
// // app.use('/', routes);



app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'my-book-list', 'dist', 'index.html'));
});



app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

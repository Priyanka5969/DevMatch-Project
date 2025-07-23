const express = require('express');
const app = express();
const connectToDatabase = require('../config/database');

connectToDatabase()
.then(() => {
    console.log('Database connection established successfully');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((error) => {
    console.error('Failed to connect to the database', error);
})

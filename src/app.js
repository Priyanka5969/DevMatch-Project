const express = require('express');
const app = express();
const connectToDatabase = require('../config/database');
const authRouter = require('../routes/auth');
const profileRouter = require('../routes/profile');
const requestRouter = require('../routes/request');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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

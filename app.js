'use strict';

const express = require('express');
const app = express();
const middlewareAuth = require('./middleware/middleware');
const cors = require('cors');
const port = 3000;


// Connect to mongodb
require('./data/connection/connection');

// Add headers
const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Middleware of verification; Authorizartion token 
app.use((req, res, next) => {
    middlewareAuth(req, res, next);
});

//to prvent : Reason: CORS header ‘Access-Control-Allow-Origin’ missing - NOT WORKING!!!
app.use((req, res, next) => {
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

// Routes
app.use('/students', require('./route/studentRoute'));
app.use('/admin', require('./route/adminRoute'));
app.use('/books', require('./route/booksRoute'));

// Error handling
app.use((err, req, res, next) => {
    console.log(err.name);
    switch (err.name) {
        case 'Database Error':
            return res.status(500).json({
                message: 'Internal server error',
                description: 'Error in database operation'
            });
        case 'Validation Error':
            return res.status(400).json({
                message: 'Bad requst',
                description: err.message
            });
        case 'Data not available':
            return res.status(500).json({
                message: 'Unavailble data Entered.',
                description: err.message
            });
        default:
            return res.status(500).json({
                message: 'Internal server error',
                description: 'Internal server error'
            });
    }
});

app.listen(port, (err) => {
    if (err) {
        console.log("Error Occured : ", err);
    }
    else {
        console.log("server is listening to port: ", port);
    }
});


'use strict';
const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({ //schema
    userName: {
        type: String,
        required: true,
        unique: false //made username unique
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    subjects: {
        type: [String],
        required: true
    },
    role: {
        type: String,
        required: true
    },
    bookDetails: [{
        bookName: String,
        bookISBN: String, 
        bookID: String

    }]
});

module.exports = studentsSchema;
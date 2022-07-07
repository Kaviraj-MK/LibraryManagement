'use strict';

const mongoose = require('mongoose');

 const bookSchema = new mongoose.Schema({
     bookName: {
         type: String,
         required: true,
     },
     codeISBN: {
         type: String,
         required: true,
         unique: true
     },
     availability: {
         type: Boolean,
         required: true
     }
 });

 module.exports = bookSchema
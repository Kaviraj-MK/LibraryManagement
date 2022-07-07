'use strict';

const mongoose = require('mongoose');
const bookSchema = require('../data/schema/book');
const DatabaseError = require('../types/DatabaseError');
const ValidationError = require('../types/ValidationError');
const { validData, validateName } = require('./commonValidationUtil');

const books = mongoose.model('books', bookSchema);

const saveBook = async (bookData) => {
    try {
        const book = new books(bookData);
        const savedBook = await book.save();
        return savedBook;
    } catch (error) {
        throw new ValidationError("Data missing occured.Check whether all data is added.");
    }
}

const getBookList = async () => {
    try {
        const booklist = await books.find({});
        return booklist;    
    } catch (error) {
        throw new DatabaseError('Error occurerd while getting book list.')
    }
}

const findBookByName = async (bookName) => {
    try {
        const book = await books.findOne({ "bookName": bookName });
        return book;
    } catch (error) {
        throw new ValidationError("Enter the correct book name.");
    }
}

const findAndUpdateBookStatus = async (bookName, bookAvailability) => {
    try {
        const book = await books.findOneAndUpdate({ "bookName": bookName }, { $set: { "availability": bookAvailability } }, { returnDocument: "after" });
        return book;
    } catch (error) {
        throw new ValidationError("Enter the correct book name");
    }
}

module.exports = {
    saveBook: saveBook,
    getBookList: getBookList,
    findBookByName: findBookByName,
    findAndUpdateBookStatus: findAndUpdateBookStatus
}
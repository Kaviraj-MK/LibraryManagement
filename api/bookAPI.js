'use strict';
const { saveBook, findBookByName, findAndUpdateBookStatus, getBookList } = require("../util/bookUtil");
const { validateName } = require("../util/commonValidationUtil");
const dataAvailabilty = require("../util/dataAvailability");

const addBook = async (bookData, next) => {
    try {
        // await validData(bookData.bookName);
        // await validData(bookData.codeISBN);
        // await validData(bookData.availability);
        const newBook = await saveBook(bookData);
        return newBook;
    } catch (error) {
        throw (error);
    }
}

const getBookDetails = async () => {
    try {
        const book = await getBookList();
        return book;
    } catch (error) {
        throw (error);
    }
}

const searchBookName = async (bookName) => {
    try {
        await validateName(bookName);
        const searchedBook = await findBookByName(bookName);
        await dataAvailabilty(searchedBook);
        return searchedBook;
    } catch (error) {
        throw (error);
    }
}

const libraryBookAvailabilty = async (bookData) => {
    try {
        await dataAvailabilty(bookData);
        let bookAvailability = bookData.availability;
        return bookAvailability;
    } catch (error) {
        throw (error);
    }
}



module.exports = {
    addBook: addBook,
    getBookDetails: getBookDetails,
    libraryBookAvailabilty: libraryBookAvailabilty,
    searchBookName: searchBookName
}
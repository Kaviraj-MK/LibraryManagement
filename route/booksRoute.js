'use strict';

const express = require('express');
const { getBookDetails, searchBookName } = require('../api/bookAPI');
const { updatestudentBooks, reserveBook, returnBook } = require('../api/studentAPI');
const authorizeAdmin = require('../middleware/adminMiddleware');
const authorizeStudent = require('../middleware/studentMiddleware');
const { validateId, validateName } = require('../util/commonValidationUtil');
const router = express.Router();

router.get('/booklist', authorizeAdmin, async (req, res, next) => {
    try {
        const books = await getBookDetails();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }

});

router.post('/searchbook', authorizeAdmin, async (req, res, next) => {
    try {
        if (!req.is('application/json')) { //for getting content type as json format
            throw new ValidationError('reqst content type is invalid.');
        }
        const bookName = req.body.bookName;
        const book = await searchBookName(bookName, next);
        res.status(302).json(book)
    } catch (error) {
        next(error);
    }
});

router.patch('/reservebook', authorizeStudent, async (req, res, next) => {
    try {
        if (!req.is('application/json')) {
            throw new ValidationError('reqst content type is invalid.');
        }
        const studentId = req.body.studentId;
        const bookName = req.body.bookName;
        await validateId(studentId);
        await validateName(bookName);
        const reservedBook = await reserveBook(bookName, studentId, next);
        res.status(200).json({
            Status: reservedBook
        });
    } catch (error) {
        next(error);
    }

});

router.patch('/returnbook', authorizeStudent, async (req, res, next) => {
    try {
        if (!req.is('application/json')) {
            throw new ValidationError('reqst content type is invalid.');
        }
        const studentId = req.body.studentId;
        const bookName = req.body.bookName;
        await validateId(studentId);
        await validateName(bookName);
        const returnedBook = await returnBook(bookName, studentId);
        res.status().json({
            Status: returnedBook
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
'use strict';

const express = require('express');
const { createAdmin, loginAdmin, hashAdminPassword } = require('../api/adminAPI');
const { addBook } = require('../api/bookAPI');
const authorizeAdmin = require('../middleware/adminMiddleware');
const router = express.Router();

// create admin account
router.post('/profile', async (req, res, next) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        const hashedAdminPassword = await hashAdminPassword(password);
        const name = req.body.name;
        const adminData = {
            userName: userName,
            password: hashedAdminPassword,
            name: name,
            role: "admin"
        }
        const savedAdmin = await createAdmin(adminData);
        res.set('Access-Control-Allow-Origin', 'http://localhost:8080/');
        res.status(201).json({
            admin: savedAdmin
        });
    } catch (error) {
        next(error);
    }

});

// login admin account
router.post('/login', async (req, res) => {
    try {
        if(!req.is('application/json')) {
            throw new ValidationError('reqst content type is invalid.');
        }
        const userName = req.body.userName;
        const password = req.body.password;
        const adminToken = await loginAdmin(userName, password);
        res.status(200).json({
            adminToken: adminToken
        });
    } catch (error) {
        next (error);
    }
});

//add books
router.post('/addbooks', authorizeAdmin, async (req, res, next) => {
    try {
        if(!req.is('application/json')) {
            throw new ValidationError('reqst content type is invalid.');
        }
        const bookName = req.body.bookName;
        const codeISBN = req.body.codeISBN;
        const availability = req.body.availability;
        const bookData = {
            bookName: bookName,
            codeISBN: codeISBN,
            availability: availability
        }
        const savedBook = await addBook(bookData);
        res.status(201).json({
            bookData: savedBook
        });    
    } catch (error) {
        next (error);
    }
    
});

module.exports = router;
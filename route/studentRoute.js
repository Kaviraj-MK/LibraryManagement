'use strict';

const express = require('express');
const router = express.Router();
const studentUtil = require('../util/studentUtil');
const studentAPI = require('../api/studentAPI');
const { login, studentsList, searchbyQueriedName, searchByIdAndDelete, searchIdAndDisplay, patchStudentData, createAccount, hashPassword, findAndUpdateStudentData } = require('../api/studentAPI');
const { hashIt } = require('../util/userCredentialUtil');
const ValidationError = require('../types/ValidationError');
const authorizeStudent = require('../middleware/studentMiddleware');

//Display all data
router.get('/users', authorizeStudent, async (req, res) => {
    const studentList = await studentsList();
    console.log(studentList);
    res.status(200).json(studentList );
});

//query parameter
router.get('/profiles/name', authorizeStudent, async (req, res, next) => {
    const name = req.query.name;
    const queryStudent = await searchbyQueriedName(next, name);
    res.status(200).json(queryStudent);
});

//delete user
router.delete('/profiles/:id', authorizeStudent, async (req, res, next) => {
    const id = req.params.id;
    const deletedStudent = await searchByIdAndDelete(next, id);
    res.status(200).json(deletedStudent);
});

//update data - if searched ID is not found, create data to entered ID. /**ISSUE/ */
router.put('/profiles/:id', authorizeStudent, async (req, res,next) => {
    const id = req.params.id;   
    const name = req.body.name;
    const address = req.body.address;
    const age = req.body.age;
    const subjects = req.body.subjects;
    if(!req.is('application/json')) {
        throw new ValidationError('reqst content type is invalid.');
    }
    const studentData = {
        name: name,
        address: address,
        age: age,
        subjects: subjects
    }
    const savedStudent = findAndUpdateStudentData(id, studentData, next);
    res.status(201).json(savedStudent); //as a standard, neither put nor patch responds are not sent.
});

//search by ID and display
router.get('/profiles/:id', authorizeStudent, async (req, res, next) => {
    const id = req.params.id;
    const searchedSudent = await searchIdAndDisplay(next, id);
    res.status(200).json(searchedSudent);
});                        

//make partial updates without editing the whole data
router.patch('/profiles/:id', authorizeStudent, async (req, res, next) => {
    if(!req.is('application/json')) {
        throw new ValidationError('reqst content type is invalid.');
    }
    const id = req.params.id;
    const filterUser = await studentUtil.filterById(id);
    const name = req.body.name || filterUser.name;
    const address = req.body.address || filterUser.address;
    const age = req.body.age || filterUser.age;
    const subjects = req.body.subjects || filterUser.subjects;
    const studentData = {
        name: name,
        address: address,
        age: age,
        subjects: subjects
    }
    const patchedStudent = await patchStudentData(id, studentData, next);
    res.status(204).json(patchedStudent);
});

//create account
router.post('/profile', async (req, res) => {
    if(!req.is('application/json')) {
        throw new ValidationError('reqst content type is invalid.');
    }
    const userName = req.body.userName;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    const name = req.body.name;
    const address = req.body.address;
    const age = req.body.age;
    const subjects = req.body.subjects;
    const studentData = {
        userName: userName,
        password: hashedPassword,
        name: name,
        address: address,
        age: age,
        subjects: subjects,
        role: "student"
    }
    const savedStudent = await createAccount(userName, password, studentData);
    res.status(201).json({
        status: createAccount,                                                      //How to send Error here?
        CreatedData: savedStudent
    });
});

//to send JWTtokens in the response
//validate user and generate JWTtoken
router.post('/login', async (req, res) => {
    if(!req.is('application/json')) {
        throw new ValidationError('reqst content type is invalid.');
    }
    const userName = req.query.userName;
    const password = req.query.password;
    const token = await login(userName, password);
    return res.status(200).json({
        token: token
    });
});
module.exports = router;


//Error hadling 

/**
 * Role based authorization
 */
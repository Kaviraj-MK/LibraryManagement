'use strict';
const bcrypt = require('bcrypt');
const { findBookByName, findAndUpdateBookStatus } = require('../util/bookUtil');
const { validateId, validateName } = require('../util/commonValidationUtil');
const dataAvailabilty = require('../util/dataAvailability');
const createToken = require('../util/jwtUtil');
const studentUtil = require('../util/studentUtil');
const { searchByUsername, studentList, searchByName, deleteStudent, filterById, updateStudent, saveStudent, updateStudentBookRack } = require('../util/studentUtil');
const { sanitizeUserCredentials, compareHash, hashIt } = require('../util/userCredentialUtil');
const { getBooksInLibrary, libraryBookAvailabilty, searchBookName } = require('./bookAPI');

const login = async (userName, password) => {
    try {
        sanitizeUserCredentials(userName, password);
        const user = await searchByUsername(userName);
        console.log(user);
        const compareHashResult = await compareHash(password, user.password);
        //console.log('comaparehash result', compareHashResult);
        if (compareHashResult) {
            const student = await searchByUsername(userName);
            const role = student.role;
            console.log(role);
            return createToken(role);
        } else {
            throw new Error('invalid password!');
        }

    } catch (error) {
        console.error('Error occured:', error);
    }
}

const studentsList = () => {
    return studentList;
}

const searchbyQueriedName = async (next, name) => {
    try {
        validateName(name);
        const queryStudent = await searchByName(name);
        dataAvailabilty(queryStudent);
        return queryStudent;
    } catch (error) {
        throw (error);
    }

}

const searchByIdAndDelete = async (next, id) => {
    try {
        await validateId(id);
        const deletedStudent = await deleteStudent(id);
        dataAvailabilty(deletedStudent);
        return deletedStudent;
    } catch (error) {
        throw (error);
    }

}

const searchIdAndDisplay = async (next, id) => {
    try {
        await validateId(id);
        const searchedStudent = await filterById(id);
        await dataAvailabilty(searchedStudent);
        return searchedStudent;
    } catch (error) {
        throw (error);
    }
}

const findAndUpdateStudentData = async (id, studentData, next) => { //Issue
    try {
        await validateId(id);
        if (id) {
            const updatedStudent = await updateStudent(id, studentData);
            if (updatedStudent) {
                return updatedStudent;
            }
        }
    } catch (error) {
        throw (error);
    }
}

const patchStudentData = async (id, studentData, next) => {
    try {
        validateId(id);
        const patchedStudent = await updateStudent(id, studentData);
        dataAvailabilty(patchedStudent);
        return patchedStudent;
    } catch (error) {
        throw (error);
    }
}

const hashPassword = async (password) => {
    const hashedPassword = await hashIt(password);
    return hashedPassword;
}

const createAccount = async (userName, password, studentData) => {
    try {
        sanitizeUserCredentials(userName, password);
        const savedStudent = await saveStudent(studentData);
        return savedStudent;
    } catch (error) {
        console.error('error occured: ', error);
    }
}

const getStudentBooks = async (studentId) => {
    try {
        await validateId(studentId);
        const student = await filterById(studentId);
        await dataAvailabilty(student);
        const studentBookRack = student.bookDetails;
        console.log("student End Book details", studentBookRack);
        return studentBookRack;
    } catch (error) {
        throw (error);
    }
}

const reserveBook = async (bookName, studentId) => {
    try {
        const searchedBook = await searchBookName(bookName);
        const libraryEndBookAvailability = await libraryBookAvailabilty(searchedBook);
        if (libraryEndBookAvailability === true) {
            const studentBooks = await getStudentBooks(studentId);
            console.log(studentBooks);
            await updateStudentBooks(studentId, searchedBook, studentBooks);
            await findAndUpdateBookStatus(bookName, false);
            return ('Book reservation successfull');
        }
        else {
            return ('Book has been already lent by someone');
        }

    } catch (error) {
        throw (error);
    }
}
const returnBook = async (bookName, studentId) => {
    try {
        const searchedBook = await searchBookName(bookName);
        const libraryEndBookAvailability = await libraryBookAvailabilty(searchedBook);
        if (libraryEndBookAvailability == false) {
            const studentBooks = await getStudentBooks(studentId);
            await removeStudentBooks(studentId, searchedBook, studentBooks);
            await findAndUpdateBookStatus(bookName, true);
            return ('Book returning successfull.');
        }
        else {
            return ('Book is not in your possesion');
        }
    } catch (error) {
        throw (error);
    }
}

const removeStudentBooks = async (studentId, book, studentBooks) => {
    try {
        let studentBookList = studentBooks;
        console.log("remove st book",studentBookList);
        if (studentBookList && studentBookList.length > 0) {
            const removableBook = studentBookList.findIndex (object => {
                return object.bookName === book.bookName;
            });
            studentBookList.splice(removableBook, 1);
            console.log('remained student books', studentBookList);
        }
        else {
            return ('No books in your possesion');
        }
        const updatedStudentBookData =  await updateStudentBookRack(studentId, studentBookList);
        return updatedStudentBookData;
    } catch (error) {
        throw (error);
    }
}

const updateStudentBooks = async (studentId, book, studentBooks) => {
    try {
        const bookDetails = {
            bookName: book.bookName,
            bookISBN: book.codeISBN,
            bookID: book._id
        };
        //const studentBookList = await getStudentBooks(studentId);
        let studentBookList = studentBooks;
        if (studentBookList && studentBookList.length > 0) {
            studentBookList.push(bookDetails);
        }
        else {
            studentBookList = new Array(bookDetails);
        }
        console.log("------------------------------------------", studentBookList);
        const updatedStudentBookData = await updateStudentBookRack(studentId, studentBookList);
        return updatedStudentBookData;

    } catch (error) {
        throw (error);
    }
}

module.exports = {
    login: login,
    studentsList: studentsList,
    searchbyQueriedName: searchbyQueriedName,
    searchByIdAndDelete: searchByIdAndDelete,
    searchIdAndDisplay: searchIdAndDisplay,
    findAndUpdateStudentData: findAndUpdateStudentData,
    patchStudentData: patchStudentData,
    hashPassword: hashPassword,
    createAccount: createAccount,
    updatestudentBooks: updateStudentBooks,
    reserveBook: reserveBook,
    returnBook: returnBook
}
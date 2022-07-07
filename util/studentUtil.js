'use strict';

const mongoose = require('mongoose'); //import mongoose.
const studentsSchema = require('../data/schema/student');
const DataAvailabilityError = require('../types/DataAvailabilityError');
const DatabaseError = require('../types/DatabaseError');
const { findBookByName } = require('./bookUtil');
const { validData } = require('./commonValidationUtil');
const dataAvailabilty = require('./dataAvailability');

const students = mongoose.model('students', studentsSchema); //map the studentSchema to student collection

//filter data by searching ID
const filterById = async (id) => {
    try {
        const student = await students.findOne({ "_id": id });
        return student;
    } catch (error) {
        throw new DataAvailabilityError('Entered Id is not availale in database')
    }
}

const studentList = students.find({});

const searchByName = async (name) => {
    try {
        const student = await students.findOne({ "name": name });
        return student;
    } catch (error) {
        throw new DatabaseError('Error occured while find user by name', error.stack);
    }
};

const searchByUsername = async (userName) => {
    try {
        const student = await students.findOne({ "userName": userName });
        return student;
    } catch (error) {
        throw new DataAvailabilityError("Username is not available in database.");
    }
};

const searchBookLogs = async (bookISBN) => {
    try {
        await validData(bookISBN);
        const student = await students.findOne({"bookISBN": bookISBN});
        return student;
    } catch (error) {
        throw new DataAvailabilityError("Book ISBN is not availabale");
    }
}

const deleteStudent = async (id) => {
    try {
        const student = await students.findOneAndDelete({ "_id": id }, { returnDocument: "after" });
        return student;
    } catch (error) {
        throw new DataAvailabilityError('Id not found in database.');
    }
}

const updateStudent = async (id, studentData) => {
    try {
        const student = await students.findOneAndUpdate({ "_id": id }, { $set: studentData }, { returnDocument: "after" });
        return student;
    } catch (error) {
        throw new DataAvailabilityError('Id not found in database');
    }
}

const saveStudent = async (studentData) => {
    try {
        const student = new students(studentData);
        const savedStudent = await student.save(); // ********need await here?
        return savedStudent;
    } catch (error) {
        throw new DatabaseError('Cannot save data');
    }
}

const updateStudentBookRack = async (studentId, bookDetails) => {
    try {
        const updatedStudent = await students.findOneAndUpdate({"_id": studentId}, {$set: {"bookDetails": bookDetails}}, {returnDocument: "after"});
        return updatedStudent;
    } catch (error) {
        throw new DataAvailabilityError("Cannot find entered Student ID");
    }
    
}

module.exports = {
    students: students,
    studentList: studentList,
    filterById: filterById,
    searchByName: searchByName,
    deleteStudent: deleteStudent,
    updateStudent: updateStudent,
    saveStudent: saveStudent,
    searchByUsername: searchByUsername,
    searchBookLogs: searchBookLogs,
    updateStudentBookRack: updateStudentBookRack

}
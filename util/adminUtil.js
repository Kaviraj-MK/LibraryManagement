'use strict';

const mongoose = require('mongoose');
const adminsSchema = require('../data/schema/admin');
const DataAvailabilityError = require('../types/DataAvailabilityError');
const { validData } = require('./commonValidationUtil');

const admins = mongoose.model('admins', adminsSchema);

const saveAdmin = async (adminData) => {
    const admin = new admins(adminData);
    const savedAdmin = await admin.save();
    return savedAdmin;
}

const findAdminByUserName = async (userName) => {
    const admin = await admins.findOne({ "userName": userName });
    return admin;
}

const adminList = admins.find({});

module.exports = {
    saveAdmin: saveAdmin,
    adminList: adminList,
    findAdminByUserName: findAdminByUserName
}
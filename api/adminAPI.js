'use strict';

const DatabaseError = require("../types/DatabaseError");
const { saveAdmin, findAdminByUserName } = require("../util/adminUtil");
const { validData } = require("../util/commonValidationUtil");
const createToken = require("../util/jwtUtil");
const { hashIt, compareHash } = require("../util/userCredentialUtil");

const hashAdminPassword = async (password) => {
    try {
        const hashedAdminPassword = await hashIt(password);
        return hashedAdminPassword;
    } catch (error) {
        throw error;
    }

}

const createAdmin = async (adminData, next) => {
    try {
        const admin = await findAdminByUserName(adminData.userName);
        if (admin) {
            console.log(admin);
            throw new DatabaseError("Please enter another Username.");
        }
        else {
            const savedAdmin = await saveAdmin(adminData);
            return savedAdmin;
        }
    } catch (error) {
        throw error;
    }

}

const loginAdmin = async (userName, password) => {
    try {
        const admin = await findAdminByUserName(userName);
        const comaprePassword = await compareHash(password, admin.password);
        if (comaprePassword) {
            const admin = await findAdminByUserName(userName);
            const role = admin.role;
            console.log(role); 
            return createToken(role);
        }
        else {
            throw new Error('Invalid password!');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAdmin: createAdmin,
    loginAdmin: loginAdmin,
    hashAdminPassword: hashAdminPassword
} 
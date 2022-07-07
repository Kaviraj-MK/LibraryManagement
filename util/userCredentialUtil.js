'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashIt = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('salt is :', salt);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

const compareHash = async (password, hashedPassoword) => {
    console.log('Passwor: ', password, 'hashpassword: ', hashedPassoword );
    const isCorrect = await bcrypt.compare(password, hashedPassoword);
    return isCorrect;
}

const sanitizeUserCredentials = ( userName, password ) => {
    if ( !userName ) {
        throw new Error('Username not defined.');
    }

    if ( !password ) {
        throw new Error('Password not defined.');
    }
}

module.exports = {
    sanitizeUserCredentials: sanitizeUserCredentials,
    hashIt: hashIt,
    compareHash: compareHash
}
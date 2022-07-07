'use strict';

const jwt = require('jsonwebtoken');
const jwtSecretKey = 'Secret#GGT';

const createToken = (role) => {
    let data = {
        time: Date(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        roles: role
    }
    const token = jwt.sign(data, jwtSecretKey);
    //console.log('jwt token:', token);
    return token;
}

module.exports = createToken;

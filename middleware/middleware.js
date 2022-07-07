'use strict';

const verifyData = require('../util/jwtUtil');
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'Secret#GGT';

const token = verifyData.token;
//middleware of verification; Authorizartion token 
const middlewareAuth = (req, res, next) => {
    if (req.path !== '/students/profile' && req.path !== '/students/login' && req.path !== '/admin/login' && req.path !== '/admin/profile') {
        const token = req.headers.authorization;
        //console.log('header token:', token);
        if (!token) {
            return res.status(400).json({
                error: 'Authorization token not found'
            });
        }
        return jwt.verify(token, jwtSecretKey, (err, decoded) => {
            //console.log(token);
            if (err) {
                return res.status(401).json({
                    error: 'Unauthorized'
                });
            }
            req.role = decoded.roles;
            next();
        });
    }
    next();
};

module.exports = middlewareAuth;
//User Specific???


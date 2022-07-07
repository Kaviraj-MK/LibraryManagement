'use strict';

const authorizeStudent = async (req, res, next) => {
    if (req.role === 'student') {
        return next()   ;
    }
    throw new Error('unauthorized');
}

module.exports = authorizeStudent;
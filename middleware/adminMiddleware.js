'use strict';

const authorizeAdmin = async (req, res, next) => {
    if (req.role === 'admin' ) {
        return next();
    }
    throw new Error('unauthorized');
    
}

module.exports = authorizeAdmin;
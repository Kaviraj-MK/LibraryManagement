'use strict';

module.exports = class DatabaseError extends Error {

    constructor(message, stack) {
        super('Database Error');
        this.name = 'Database Error';
        this.message = message;
        this.stack = stack;
    };

}
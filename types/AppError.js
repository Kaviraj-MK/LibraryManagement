'use strict';

module.exports = class AppError extends Error {

    constructor(message, stack) {
        super('App Error');
        this.name = 'App Error';
        this.message = message;
        this.stack = stack;
    };

}
'use strict';
module.exports = class ValidationError extends Error {

    constructor(message, stack) {
        super('Validation Error');
        this.name = 'Validation Error';
        this.message = message;
        this.stack = stack;
    };

}
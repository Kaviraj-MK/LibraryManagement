'use strict';
module. exports = class DataAvailabilityError extends Error {
    constructor(message, stack){
        super('Data not available');
        this.name = 'Data not available';
        this.message = message;
        this.stack = stack;
    }
}
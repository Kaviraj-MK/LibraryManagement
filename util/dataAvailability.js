'use strict';

const DataAvailabilityError = require("../types/DataAvailabilityError");

const dataAvailabilty = async (data) => {
    if  (data == null) {
        throw new DataAvailabilityError('Entered Data cannot be found in database');
    }
} 

module.exports = dataAvailabilty;
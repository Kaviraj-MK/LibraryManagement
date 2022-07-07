'use script';

const ValidationError = require("../types/ValidationError");

const validateId = async (id) => {
    if (!id) {
        throw new  ValidationError('Id is not valid!');
    }
}

const validateName = async (name) => {
    if (!name) {
        throw new ValidationError('Name is not valid');
    }
}

const validData = async (data) => {
    if (!data) {
        throw new ValidationError('Data is not entered properly.');
    }
}

module.exports = {
    validateId: validateId,
    validateName: validateName,
    validData: validData
}
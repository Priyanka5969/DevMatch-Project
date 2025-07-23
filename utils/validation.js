const validator = require('validator');

const validateSignUp = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error('First name and last name are required');
    }else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email format!!');
    }
}

module.exports = {
    validateSignUp,
}
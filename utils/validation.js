const validator = require('validator');

const validateSignUp = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error('First name and last name are required');
    }else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email format!!');
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
      ];

      const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
      return isEditAllowed;
}
module.exports = {
    validateSignUp,
    validateEditProfileData,
}
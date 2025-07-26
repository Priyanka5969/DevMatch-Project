const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 1,
        maxLength:50,
    },
    lastName:{
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // regex for email validation
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 128,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter Strong Password');
            }
        },  //validating using validator package
    },
    age:{
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        // enum: ["male", "female", "other"],
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender`
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid Photo URL");
          }
        },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
}

);

userSchema.methods.getJWT = async function(){
    const user = this;

    console.log(user._id," user id in getJWT method");  
    const token = jwt.sign({_id: user._id}, "DEV@Match$123", {
        expiresIn: "7d",
    })
    return token;
}

userSchema.methods.validatePassword = async function(password){
    const user = this;
    const passHash = user.password;

    const isPasswordValid = await bcrypt.compare(password, passHash);

    return isPasswordValid;
}
module.exports =  mongoose.model('User', userSchema);
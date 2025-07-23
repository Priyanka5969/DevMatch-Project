const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validation');

authRouter.post('/signUp', async(req, res) => {
    try{
        // const User = new UserModel(req.body);
        // await User.save();
        validateSignUp(req); // validating the request body using utility function

        const { firstName, lastName, emailId, password } = req.body; // destructuring the request body to get user details

        //Encrypting password
        //await as it returns object or else we get pending promise object & we need actual string hash value
        const passHash = await bcrypt.hash(password, 10)
        const UserNew = new User({
            firstName, 
            lastName, 
            emailId, 
            password : passHash,
        });
        const savedUser = await UserNew.save();
        const token = await savedUser.getJWT(); 

        res.cookie("token",token,{
            expires: new Date(Date.now()+8*3000000), // 8 hours expiry
        });

        res.json({
            message: "User Added Successfully",
            data: savedUser
        });
    }catch(error){
        console.error('Error during sign up', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = authRouter;
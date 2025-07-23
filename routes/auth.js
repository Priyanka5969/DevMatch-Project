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
        res.status(500).json({ message: 'Error during sign up' });
    }
})


authRouter.post('/login', async(req,res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({ emailId });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.validatePassword(password); // should use await 
        if(isPasswordValid){
            const token = await user.getJWT(); // getting JWT token from user model method
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3000000),
            });

            res.json({
                message: "Login Successful",
                data: user,
            });
        }else{
            throw new Error("Invalid credentials");
        }

    }catch(error){
        console.error('Error during login', error);
        res.status(500).json({ message: 'Error during login' });
    }
})

module.exports = authRouter;
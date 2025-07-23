const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async function(req,res,next){
    try{
        const {token} = req.cookies;
        console.log(token);
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedObj = await jwt.verify(token, "DEV@Match$123");

        const { _id } = decodedObj; // extracting user_id from token
        const user = await User.findById({_id});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // attaching user to req
        next();
    }catch(error){
        console.error('Error during user authentication', error);
        res.status(500).json({ message: 'Error during user authentication' });
    }
}

module.exports = {userAuth};
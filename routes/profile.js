const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');
profileRouter.get('/profile/view', userAuth, async(req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(error){
        console.error('Error viewing profile', error);
        res.status(500).json({ message: 'Error viewing profile' });
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error('Invalid profile data');
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    }catch(error){
        console.error('Error editing profile', error);
        res.status(500).json({ message: 'Error editing profile' });
    }
});

module.exports = profileRouter;
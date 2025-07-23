const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
profileRouter.get('/profile/view', userAuth, async(req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(error){
        console.error('Error viewing profile', error);
        res.status(500).json({ message: 'Error viewing profile' });
    }
})

module.exports = profileRouter;
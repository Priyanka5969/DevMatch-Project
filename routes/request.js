const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res) => {
   try{
    const fromUserId = req.user._id;

    const toUserId = req.params.toUserId;
    console.log(fromUserId, "fromuserid");
    console.log(toUserId,"touserid");
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({ message: 'Invalid status type' });
    }

    const toUser = await User.findById(toUserId);
    console.log(toUser, "touser");
    if(!toUser){
        return res.status(404).json({ message: 'User not found' });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({    
        $or : [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ],
    });
    if(existingConnectionRequest){
        return res.status(400).json({ message: 'Connection request already exists' });
    }
    
    const connectionRequest =  new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });
    const data = await connectionRequest.save();
    res.json({
        message: 'Connection request created successfully',
        data,
    });
   }catch(error){
         console.error('Error while sending connection request', error);
         res.status(500).json({ message: 'Internal Server Error' });
   }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res) => {  
    const loggedInUser = req.user;
    const {status, requestId} = req.params;

    console.log(loggedInUser, "loggedInUser");
    console.log(status, "status");
    
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({ message: 'Invalid status type' });
    }

    const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
    });

    if(!connectionRequest){
        return res.status(404).json({ message: 'Connection request not found or already reviewed' });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
        message: `Connection request : ${status}`,
        data,
    });
});

module.exports = requestRouter;
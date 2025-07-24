const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
          values: ["ignored", "interested", "accepted", "rejected"],
          message: `{VALUE} is incorrect status type`,
        },
    },
},
{
    timestamps: true,
}
);

// indexing based on those fields so that we can serach it in faster way
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


//check before saving that sender isn't sending req to himself
//before await ...save()
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    console.log("Pre-save hook triggered for connection request:", connectionRequest);
    console.log(connectionRequest.fromUserId,"connectionRequest.fromUserId");
    console.log(connectionRequest.toUserId,"connectionRequest.toUserId");
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
       throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

  
const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
const User = require("../models/Users/User");
const user = require("../models/Users/User");

const isAccountVerified = async (req,res,next) => {
    try {
        //Find the logged in user
        const user = await User.findById(req.userAuth._id);
       
        //check if user is verified
        if(user?.isVerified) {
            next();
        } else {
            res.status(401).json({message: "Account not verified"});
        }
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

module.exports = isAccountVerified;
const jwt = require("jsonwebtoken");
const User = require("../models/Users/User")
const isLoggedIn= (req,resp, next) => {
    console.log("is LoggedIn executed!");
     //?Get Token
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);
    //verify token
    jwt.verify(token,process.env.JWT_KEY, async (err, decoded) => {
        console.log("decoded:", decoded);
    // if unsuccessful , then send the error message 
        if (err) {
           const error = new Error(err?.message);
           next(error);
        } else {
            // if successful, then pass the User object to next path
            const userId = decoded?.user?.id;
            const user = await User.findById(userId).select(
                "username email role _id"
            );
            req.userAuth = user;
            next(); 
        }
    });
    };
       
   
module.exports = isLoggedIn;
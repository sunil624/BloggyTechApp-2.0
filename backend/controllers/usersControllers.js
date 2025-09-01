const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/Users/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const sendAccountVerificationEmail = require("../utils/sendAccountVerificationEmail");
//@desc Regsiter new user
//@route POST /api/v1/users/register
//@access public

exports.register = asyncHandler(async (req, resp, next) => {
  const { username, password, email } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User Already Existing");
  }
  const newUser = new User({ username, email, password });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  newUser.profilePicture = req.file.path;
  await newUser.save();
  resp.json({
    status: "success",
    message: "User registered successfully",
    _id: newUser?.id,
    username: newUser?.username,
    email: newUser?.email,
    role: newUser?.role,
    
  });
});

//@desc Login new user
//@route POST /api/v1/users/login
//@access public
exports.login = asyncHandler(async (req, resp, next) => {
  const { username, password } = req.body;
  // const user = await User.findOne({ username,password });
  
  // Add .select('+password') to include password field
  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    throw new Error("Invalid credentials");
  }
  // Verify password exists
  if (!user?.password) {
    throw new Error("Invalid credentials");
  }
  let isMatched = await bcrypt.compare(password, user?.password);

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }
   if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  resp.json({
    status: "success",
    email: user?.email,
    _id: user?._id,
    username: user?.username,
    role: user?.role,
    token: generateToken(user),
    
  });
});

//@desc Profile view
//@route GET /api/v1/users/profile/:id
//@access private
exports.getProfile = asyncHandler(async (req, resp, next) => {
  //console.log("Rec:", req.userAuth);

  const user = await User.findById(req.userAuth.id)
    .populate({
      path: "posts",
      model: "Post",
    })
    .populate({
      path: "following",
      model: "User",
    })
    .populate({
      path: "followers",
      model: "User",
    })
    .populate({
      path: "blockedUsers",
      model: "User",
    })
    .populate({
      path: "profileViewers",
      model: "User",
    });
  console.log(user);

  resp.json({
    status: "success",
    message: "Profile fetched",
    user,
  });
});

//@desc Get Profile
//@route GET /api/v1/users/public-profile/:userId
//@access Public

exports.getPublicProfile = asyncHandler(async(req,res,next)=> {
  //! get user id from params
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password").populate("posts");
  

  res.json({
    status: "success",
    message: "Public Profile fetched",
    user,
  });
});

//@desc Block User
//@route PUT /api/v1/users/block/userIdToBlock
//@access private
exports.blockUser = asyncHandler(async (req, resp, next) => {
  //!Find the userid to be blocked
  const userIdToBlock = req.params.userIdToBlock;
  //!Check whether the user is present in DB or not
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    let error = new Error("User to block not foumd!");
    next(error);
    return;
  }
  //!Get the current user id
  const userBlocking = req?.userAuth?._id;

  //!Check if it is self blocking
  if (userIdToBlock.toString() === userBlocking.toString()) {
    let error = new Error("Cannot block yourself!");
    next(error);
    return;
  }

  //!Get the current user object from DB
  const currentUser = await User.findById(userBlocking);

  //!Check whether the userIdToBlock is already blocked
  if (currentUser.blockedUsers.includes(userIdToBlock)) {
    let error = new Error("This user has already been blocked!");
    next(error);
    return;
  }

  //!push the user to be blocked in the blockedUsers array
  currentUser.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  resp.json({
    status: "success",
    message: "User blocked successfully",
  });
});
//@desc UnBlock User
//@route PUT /api/v1/users/unblock/:userIdToUnBlock
//@access private

exports.unblockUser = asyncHandler(async (req, resp, next) => {
  //Find the user to be unblocked
  const userIdToUnBlock = req.params.userIdToUnBlock;
  const userToUnBlock = await User.findById(userIdToUnBlock);
  if (!userToUnBlock) {
    let error = new Error("User to unblock not found!");
    next(error);
    return;
  }
  //Find the current user
  const userUnBlocking = req?.userAuth?._id;
  const currentUser = await User.findById(userUnBlocking);

  //Check if the user to unblock is already blocked
  if (!currentUser.blockedUsers.includes(userIdToUnBlock)) {
    let error = new Error("User already  blocked!");
    next(error);
    return;
  }
  //Remove the user from the current user blockedUsers array
  currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => {
    return id.toString() !== userIdToUnBlock;
  });
  //resave the current user in the DB
  await currentUser.save();

  //return the response
  resp.json({
    status: "success",
    message: "User Unblocked successfully",
  });
});

//@desc View another user profile
//@route GET /api/v1/users/view-another-profile/:userProfileId
//@access private

exports.viewOtherProfile = asyncHandler(async (req, resp, next) => {
  //Get the userId whose profile is tob viewed
  const userProfileId = req.params.userProfileId;
  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    let error = new Error("User whose profile is to be viewed not present!");
    next(error);
    return;
  }
  const currentUserId = req?.userAuth?._id;
  //Check if we have already viewed the profile of userProfile
  if (userProfile.profileViewers.includes(currentUserId)) {
    let error = new Error("You have already viewed the profile!");
    next(error);
    return;
  }

  //push the currentUserId into array of userProfile
  userProfile.profileViewers.push(currentUserId);

  //update the DB
  await userProfile.save();
  //return the resp
  resp.json({
    status: "success",
    message: "You have successfully viewed his/her profile",
  });
});

//@desc Follow User
//@route PUT /api/v1/users/following/:userIdToFollow
//@access private

exports.followingUser = asyncHandler(async (req, resp, next) => {
  //Find the current user id
  const currentUserId = req?.userAuth?._id;

  //Find the user to be followed
  const userToFollowId = req.params.userIdToFollow;
  const userProfile = await User.findById(userToFollowId);
  if (!userProfile) {
    let error = new Error("User to be followed not present!");
    next(error);
    return;
  }

  //Avoid current user following himself
  if (currentUserId.toString() === userToFollowId.toString()) {
    let error = new Error("You cannot follow yourself!");
    next(error);
    return;
  }

  //!Push the UserToFollowId into the following array of current user
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    {
      new: true,
    }
  );

  //!Push the CurrentUserId into the user to Follow Followers Field
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //Send the response
  resp.json({
    success: true,
    message: "You have followed the User successfully",
  });
});

//@desc UnFollow User
//@route PUT /api/v1/users/following/:userIdToUnFollow
//@access private

exports.unFollowingUser = asyncHandler(async (req, res, next) => {
  //Find the current User
  const currentUserId = req.userAuth.id;
  // Find the user to UnFollow
  const userToUnFollowId = req.params.userIdToUnFollow;
  console.log("User to unfloow : ", userToUnFollowId);
  //!Avoid User Unfollowing User
  if (currentUserId.toString() === userToUnFollowId.toString()) {
    let error = new Error("You cannot unfollow yourself!");
    next(error);
    return;
  }

  //Check whether the User Exists
  const userProfile = await User.findById(userToUnFollowId);
  if (!userProfile) {
    let error = new Error("User does not exist");
    next(error);
    return;
  }
  const currentUser = await User.findById(currentUserId);

  //Check if User has been Followed before UnFollowing
  if (!currentUser.following.includes(userToUnFollowId)) {
    let error = new Error("You have not followed this user");
    next(error);
    return;
  }

  //Remove the usertoUnfollowId from the current field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnFollowId },
    },
    {
      new: true,
    }
  );
  //Remove the currentUserId from the user ToUnFollow followers field
  await User.findByIdAndUpdate(
    userToUnFollowId,
    {
      $pull: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    success: true,
    message: "You have Unfollowed the User Successfully",
  });
});

//@ route POST /api/v1/users/forgot-password
//@ desc Forgot password
//@ access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // Find the  email in our DB
  const userFound = await User.findOne({ email });
  if (!userFound) {
    let error = new Error("This email is not registered with us");
    next(error);
    return;
  }

  // Create a Token
  const resetToken = await userFound.generatePasswordResetToken();

  // resave the user
  await userFound.save();

  //Send an Email
  sendEmail(email, resetToken);
  res.status(200).json({ message: "Password reset email sent", resetToken });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get token from params
  const resetToken = req.params.resetToken;

  //Get the password from the body
  const { password } = req.body;

  //Convert the token to the actual token that has been saved in our DB
  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(cryptoToken);
  //Find the user by the crypto token
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    let error = new Error(
      "Password reset token is invalid or has been expired!"
    );
    next(error);
    return;
  }
  //Update the user password
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetExpires = undefined;
  userFound.passwordResetToken = undefined;
  // resave the user
  await userFound.save();
  res.status(200).json({ message: "Password reset successfully" });
});

//@ route PUT /api/v1/users/account-verificaton-email/
//@ desc Send Account verification Email
//@ access Private

exports.accountVerificationEmail = asyncHandler(async (req, res, next) => {
  //Find The current user's email
  console.log("user is ", req?.userAuth?._id);
  const currentUser = await User.findById(req?.userAuth?._id);
  if (!currentUser) {
    let error = new Error("User not found");
    next(error);
    return;
  }

  //Get the Token
  const verifyToken = await currentUser.generateAccountVerificationToken();
  console.log(verifyToken);
  // resave
  await currentUser.save();
  //send the email
  sendAccountVerificationEmail(currentUser?.email, verifyToken);
  res.status(200).json({
    message: `Account verification email sent ${currentUser?.email}`,
  });
});

exports.verifyAccount = asyncHandler(async (req, res, next) => {
  //Get the token params
  const { verifyToken } = req.params;
  //Convert the token to actual token that has been saved in the DB
  const cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  //Find the user with the crypto token
  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    let error = new Error(
      "Account verification token is invalid or has been expired"
    );
    next(error);
    return;
  }

  //Update user account
  userFound.isVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationExpires = undefined;

  //resave the user
  await userFound.save();
  res.status(200).json({ message: "Account successfully verified!" });
});

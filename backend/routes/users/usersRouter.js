const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  viewOtherProfile,
  followingUser,
  unFollowingUser,
  forgotPassword,
  resetPassword,
  accountVerificationEmail,
  verifyAccount,
  getPublicProfile,
} = require("../../controllers/usersControllers");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const multer = require("multer");
const storage = require("../../utils/fileUpload");

const usersRouter = express.Router();

const upload = multer({storage});
//!Register Route
usersRouter.post("/register", register);

//!Login Route
usersRouter.post("/login", login);

//!Profile Route
usersRouter.get("/profile/:id", isLoggedIn, getProfile);

//! Public Profile
usersRouter.get("/public-profile/:userId", getPublicProfile);

//? Block the user
usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser);

//? UnBlock the user
usersRouter.put("/unblock/:userIdToUnBlock", isLoggedIn, unblockUser);

//? Other Profile view route
usersRouter.get(
  "/view-other-profile/:userProfileId",
  isLoggedIn,
  viewOtherProfile
);

//?Follow a user route
usersRouter.put("/following/:userIdToFollow", isLoggedIn, followingUser);

//?UnFollowing a user route
usersRouter.put("/unfollowing/:userIdToUnFollow", isLoggedIn, unFollowingUser);

//? Forgot  password route
usersRouter.post("/forgot-password", forgotPassword);

//? Reset  password route
usersRouter.post("/reset-password/:resetToken", resetPassword);

//? Send Account Verification Email route
usersRouter.put(
  "/account-verification-email",
  isLoggedIn,
  accountVerificationEmail
);

//? Verify Account route
usersRouter.put("/verify-account/:verifyToken", isLoggedIn, verifyAccount);
module.exports = usersRouter;

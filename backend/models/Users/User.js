const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
			enum: ["user", "admin"],
			default: "user",
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		lastlogin: {
			type: Date,
			default: Date.now(),
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		accountLevel: {
			type: String,
			enum: ["bronze", "silver", "gold"],
			default: "bronze",
		},
		profilePicture: {
			type: String,
			default:"",
		},
		coverImage: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
		},
		location: {
			type: String,
		},
		notificationType: {
			email: { type: String },
		},
		gender: {
			type: String,
			enum: ["male", "female", "prefer not to say", "non-binary"],
		},
		//other properties will deal with relationship
		profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		passwordResetToken: {
			type: String,
		},
		passwordResetExpires: { type: Date },
		accountVerificationToken: {
			type: String,
		},
		accountVerificationExpires: {
			type: Date,
		},
	},
	{
		timestamps: true,
		toJson: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

const crypto = require("crypto");
//!Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
	// generate Token
	const resetToken = crypto.randomBytes(20).toString("hex");
	console.log("reset token", resetToken);

	//Assign the Token to passwordResetToken field
	this.passwordResetToken = crypto 
	.createHash("sha256")
	.update(resetToken)
	.digest("hex");
	console.log("hashed reset token", this.passwordResetToken);
	
	//Update the passwordReset and when to expire
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
	return resetToken;
}

//GENERATE TOKEN FOR ACCOUNT VERIFICATION
userSchema.methods.generateAccountVerificationToken = function () {
	//generate token
	const verificationToken = crypto.randomBytes(20).toString("hex");
	//Assign the token to accountVerificationToken
	this.accountVerificationToken = crypto
	.createHash("sha256")
	.update(verificationToken)
	.digest("hex");

	//Update the accountVerificationExpires and When to expire
	this.accountVerificationExpires = Date.now() + 10 * 60 * 1000;
	return verificationToken;
};





//!convert schema to model

const User = mongoose.model("User", userSchema);
module.exports = User;

const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("Connected successfully to MongoDB");
	} catch (error) {
		console.log("Connection to MongoDB failed:", error.message);
	}
};
module.exports = connectDB;

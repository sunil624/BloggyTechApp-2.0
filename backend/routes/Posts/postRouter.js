const express = require("express");
const multer = require("multer")
const {
	createPost,
	getAllPosts,
	getPost,
	deletePost,
	updatePost,
	likePost,
	dislikePost,
	clapPost,
	schedulePost,
	getPublicPosts,
	postViewCount,
} = require("../../controllers/Posts/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const storage = require("../../utils/fileUpload")
const isAccountVerified = require("../../middlewares/isAccountVerified");
const postsRouter = express.Router();

const upload = multer({ storage });

//?Create a new POST route
postsRouter.post("/", isLoggedIn, upload.single("file"), isAccountVerified, createPost);

//?Get All POSTS route
postsRouter.get("/", isLoggedIn, getAllPosts);

//?Get only 4 posts
postsRouter.get("/public",getPublicPosts);

//?Get A Single POST route
postsRouter.get("/:id", getPost);



//?Delete POST
postsRouter.delete("/:id", isLoggedIn, deletePost);

//?Update POST
postsRouter.put("/:id", isLoggedIn, upload.single("file"), updatePost);

//?Like
postsRouter.put("/like/:postId", isLoggedIn, likePost);


//?Dislike
postsRouter.put("/dislike/:postId", isLoggedIn, dislikePost);


//?Clapping
postsRouter.put("/claps/:postId", isLoggedIn, clapPost);

//?Post View Count
postsRouter.put("/:id/post-view-count", isLoggedIn, postViewCount);


//?Schedule A Post
postsRouter.put("/schedule/:postId", isLoggedIn, schedulePost);

module.exports = postsRouter;

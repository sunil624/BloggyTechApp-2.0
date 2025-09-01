const express = require("express");
const {
    createComment,
	deleteComment,
	updateComment,
} = require("../../controllers/comments/commentsController");

const isLoggedIn = require("../../middlewares/isLoggedIn");

const commentsRouter = express.Router();


//?Create Comment Route
commentsRouter.post("/:postId", isLoggedIn, createComment);

//?Delete Comment Route
commentsRouter.delete("/:commentId", isLoggedIn, deleteComment);

//?Update Comment Route
commentsRouter.put("/:commentId", isLoggedIn, updateComment);

module.exports = commentsRouter;

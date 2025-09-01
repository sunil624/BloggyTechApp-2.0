const mongoose = require("mongoose");
const commentSchema= new mongoose.Schema (

    {

        message: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        
        },

    },

    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
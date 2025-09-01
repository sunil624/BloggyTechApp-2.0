const asyncHandler = require("express-async-handler");
const Comment = require("../../models/Comments/Comment");
const Post = require("../../models/Posts/Post");

//@desc Create a new comment
//@route POST /api/v1/comments/:postid
//@access Private

// exports.createComment = asyncHandler(async(req,res) => {
//     //?Get the payload
//     const {message} = req.body;

//     //?Get post id from params
//     const postId = req.params.postid;

//     //?Create a comment
//     const comment = await Comment.create({
//         message,
//         author :req?.userAuth?._id,
//         postId,
//     });
//     //Associate comment to a post
//     await Post.findByIdAndUpdate(
//         postId,
//         {
//             $push: { comments: comment._id},  
//         },
//         {new: true}
//     );
//     //*Send the response
//     res.status(201).json({
//         status: "success",
//         message: "Comment successfully created",
//         comment,
//     });
// });

exports.createComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const postId = req.params.postId;

  console.log("postId param:", postId);
  console.log("userAuth:", req?.userAuth?._id);

  const comment = await Comment.create({
    message,
    author: req?.userAuth?._id,
    postId,
  });

  console.log("Comment created:", comment);

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: true }
  );

  console.log("Updated Post after pushing comment:", updatedPost);

  res.status(201).json({
    status: "success",
    message: "Comment successfully created",
    comment,
  });
});


//@desc Delete comment
//@route DELETE /api/v1/comments/:id
//@access Private

exports.deleteComment = asyncHandler(async(req,resp)=> {
    //!Get comment id to be deleted
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    resp.status(201).json({
        status: "success",
        message: "Comment successfully deleted!",
    });
});

//@desc Update comment
//@route PATCH /api/v1/comments/:id
//@access Private

exports.updateComment = asyncHandler(async(req,resp)=> {
    //!Get comment id to be updated
    const commentId = req.params.id;
    //!Get the message
    const message = req.body.message;

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { message },
        { new: true, runValidators: true}
    );
    resp.json(201).json({
        status: "success",
        message: "Comment successfully updated",
        updatedComment,
    })
})
    
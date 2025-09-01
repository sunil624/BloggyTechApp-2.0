const asyncHandler = require("express-async-handler");
const Category = require("../../models/Categories/Category");
const Post = require("../../models/Posts/Post");
const User = require("../../models/Users/User");

//@desc Create a new post
//@route POST /api/v1/posts
//@access private

exports.createPost = asyncHandler(async (req, resp, next) => {
  console.log("File received:", req.file);
  // resp.send("done");
  // Get the payload
  const { title, content, categoryId } = req.body;
  console.log("title", title);

  // Check if post is present
  const postFound = await Post.findOne({ title });
  if (postFound) {
    let error = new Error("Post already existing");
    next(error);
    return;
  }

  //Create the Object
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
    image: req.file.path,
  });

  // Update user by adding post in it
  const user = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //  Update Category by adding in it
  const catg = await Category.findByIdAndUpdate(
    categoryId,
    { $push: { posts: post._id } },
    { new: true }
  );

  //send the response
  resp.json({
    status: "success",
    message: "Post created successfully",
    post,
    user,
    catg,
  });
});

//@desc Get All Posts
//@route GET /api/v1/posts
//@access public
exports.getAllPosts = asyncHandler(async (req, res) => {
  console.log("Get all Post");

  //*Get the current logged in user id
  const currentUserId = req.userAuth?._id;
  //* find all user who have blocked the logged-in user
  const usersBlockingCurrentUser = await User.find({
    blockedUsers: currentUserId,
  });
  console.log(usersBlockingCurrentUser);

  //*Extract the IDs of the users who have blocked the logged-in user
  const blockingUsersIds = usersBlockingCurrentUser?.map((user) => user?._id);
  console.log(blockingUsersIds);

  //*Extract posts whose author is not in blockingUsersIds
  let query = {
    author: { $nin: blockingUsersIds },
  };

  const allPosts = await Post.find(query)
    .populate({
      path: "author",
      model: "User",
      select: "email role username",
    })
    .populate("category");
  res.status(201).json({
    status: "successful",
    message: "All Posts successfully fetched",
    allPosts,
  });

  //fetch all the posts from the DB
  // const allposts = await Post.find()
  //send the response
  // res.json({
  //     status: "success",
  //     message: "All posts fetched successfully",
  //     allPosts,
  // });
});

//@desc Get Single Posts
//@route GET /api/v1/posts/:id
//@access public
// exports.getPost = asyncHandler(async(req,resp)=> {
//     // get the id
//     const postId = req.params.id;
//     //fetch the post corresponding to this id
//     const post = await Post.findById(postId)
//     .populate("author")
//     .populate("category")
//     .populate({
//         path: "comments",
//         model:"Comment",
//         populate:{
//            path: "author",
//            select:"username",
//         }
//     });
//     if(post) {
//         //send the response
//         resp.status(201).json({
//             status: "success",
//             message: "Post fetched successfully",
//             post,
//             });
//     } else {
//         //send the response
//         resp.status(201).json({
//             status: "success",
//             message: "No post available for the given id",
//             });
//     }

// });

exports.getPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
    .populate("author")
    .populate("category")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username",
      },
    });

  if (post) {
    res.status(200).json({
      status: "success",
      message: "Post fetched successfully",
      post,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No post available for the given id",
    });
  }
});

//@desc Get only 4 posts
//@route GET /api/v1/posts
//@access PUBLIC

exports.getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category");
  res.status(201).json({
    status: "success",
    message: "Posts successfully fetched",
    posts,
  });
});

//@desc Delete Post
//@route DELETE /api/v1/posts/:id
//@access private
exports.deletePost = asyncHandler(async (req, res) => {
  // Get the id
  const postId = req.params.id;

  // Find the post
  const post = await Post.findById(postId);
  const isAuthor =
    req.userAuth?._id?.toString() === post?.author?._id?.toString();
  if (!isAuthor) {
    throw new Error("Action denied, you are not the creator of the post");
  }

  //Delete this post from the DB
  await Post.findByIdAndDelete(postId);
  //send the response
  res.status(201).json({
    status: "success",
    message: "Post deleted Successfully",
  });
});

//@desc Update Post
//@route PUT /api/v1/posts/:id
//@access private
exports.updatePost = asyncHandler(async (req, res) => {
  // Get the id
  const postId = req.params.id;

  const postFound = await Post.findById(postId);
  if (!postFound) {
    throw new Error("Post not found");
  }
  // Get the post object from req
  // const post = req.body;

  //Update this post in the DB
  //! image update
  const { title, category, content } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      image: req?.file?.path ? req?.file?.path : postFound?.image,
      title: title ? title : postFound?.title,
      category: category ? category : postFound?.category,
      content: content ? content : postFound?.content,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log("upadated", updatedPost);
  //send the response
  res.status(201).json({
    status: "success",
    message: "Post updated successfully",
    updatedPost,
  });
});

//@desc liking a Post
//@ route PUT /api/v1/posts/like/:postId
//@access Private

exports.likePost = asyncHandler(async (req, res, next) => {
  //Get the id of the post
  const { postId } = req.params;
  //get the login user
  const CurrUserId = req.userAuth._id;
  // Find the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }

  // Check if user already liked
  const alreadyLiked = post.likes.includes(CurrUserId);

  if (!alreadyLiked) {
    // Add like and remove dislike if present
    post.likes.push(CurrUserId);
    post.dislikes = post.dislikes.filter(
      (dislike) => dislike.toString() !== CurrUserId.toString()
    );

    await post.save();
  }

  res.status(200).json({
    message: "Post Like Successfully!",
    post: await Post.findById(postId), // Return fresh data

    //   //  Push the currentUserId into the post likes
    //     await Post.findByIdAndUpdate(
    //         postId,
    //         {
    // $addToSet: { likes: CurrUserId },
    //         },
    //         {new: true},
    //     );

    //      // Add user to likes if not already present
    //      if (!post.likes.includes(CurrUserId)) {
    //         post.likes.push(CurrUserId);
    //     }

    //     //Remove the user from the dislike array if present
    //     post.dislikes = post.dislikes.filter(
    //         (dislike)=> dislike.toString() !== CurrUserId.toString()
    //     );
    //     //reSave the User
    //    const updatedPost =  await post.save();
    //     res.status(200).json({message: "Post Like Successfully!",
    //         post: updatedPost
  });
});

//@desc disliking a Post
//@route PUT /api/v1/posts/dislike/:postId
//@access Private

exports.dislikePost = asyncHandler(async (req, res, next) => {
  //Get the id of the post
  const { postId } = req.params;
  //get the login user
  const currentUserId = req.userAuth._id;
  // Find The post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not Found");
    next(error);
    return;
  }

  //Push the user into post dislike
  //    await Post.findByIdAndUpdate(
  //     postId,
  //     {$addToSet: { dislikes: currentUserId },
  // },
  //    {new: true}
  //    );

  // Check if user already disliked
  const alreadyDisliked = post.dislikes.includes(currentUserId);

  if (!alreadyDisliked) {
    // Add dislike and remove like if present
    post.dislikes.push(currentUserId);
    post.likes = post.likes.filter(
      (like) => like.toString() !== currentUserId.toString()
    );

    await post.save();
  }

  res.status(200).json({
    message: "Post disliked successfully.",
    post: await Post.findById(postId), // Return fresh data

    //   //  Remove the user from the like array if present
    //     post.likes = post.likes.filter(
    //         (like)=> like.toString() !== currentUserId.toString()
    //     );

    //      // Add user to dislikes if not already present
    //    if (!post.dislikes.includes(currentUserId)) {
    //     post.dislikes.push(currentUserId);
    // }

    //  //  reSave the post
    //   const updatedPost =  await post.save();
    //    res.status(200).json({message: "Post disliked successfully.",
    //     post: updatedPost
  });
});

//@desc Clapping a Post
//@route PUT /api/v1/posts/claps/:postId
//@access Private

exports.clapPost = asyncHandler(async (req, res, next) => {
  //Get the id of the post
  const { postId } = req.params;
  //Find the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not Found");
    next(error);
    return;
  }
  //implement the claps
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { claps: 1 },
    },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Post clapped SuccessFully.", updatedPost });
});

//desc post view count
//@route PUT /api/v1/posts/:id/post-view-count
//@access Private

exports.postViewCount = asyncHandler(async (req, res) => {
  //Get the id of the post
  const { id } = req.params;
  //get the login user
  const userId = req.userAuth._id;
  // Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  // if (!Array.isArray(post.postViews)) {
  //     post.postViews = [];
  //    // await post.save(); // Fix this corrupted field before continuing
  //   }

  // Only add user if not already in the array
  //   if (!post.postViews.includes(userId)) {
  //     post.postViews.push(userId);
  //     await post.save(); // Save with the new user
  //   }

  //Push the user into the post Views
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { postViews: userId },
    },
    { new: true }
  ).populate("author");

  await post.save();
  res.status(200).json({ message: "Post Viewed Successfully!", post });
});

//@desc Schedule a Post
//@route PUT /api/v1/posts/schedule/:postId
//@access Private

exports.schedulePost = asyncHandler(async (req, res, next) => {
  //get the payload
  const { scheduledPublish } = req.body;
  const { postId } = req.params;
  // Check if postId and SchedulePublish Found
  if (!postId || !scheduledPublish) {
    let error = new Error("PostId and schedule date are required!");
    next(error);
    return;
  }
  //Find the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not Found");
    next(error);
    return;
  }
  //check if the user is the author of the post
  if (post.author.toString() !== req.userAuth._id.toString()) {
    let error = new Error("You can only schedule your own post");
    next(error);
  }
  //Check if the scheduledPublish date is in the past
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    let error = new Error("The scheduled publish date cannot be in the past.");
    next(error);
    return;
  }
  //update the post
  post.scheduledPublished = scheduleDate;
  await post.save();
  res.json({
    status: "success",
    message: "Post scheduled successfully",
    post,
  });
});

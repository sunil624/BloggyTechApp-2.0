import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlices";
import postsReducer from "../slices/posts/postSlices";
import categoriesReducer from "../slices/categories/categorySlices";
import commentReducer from "../slices/comments/commentSlices";

//! Store
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    comments: commentReducer,
  },
});

export default store;

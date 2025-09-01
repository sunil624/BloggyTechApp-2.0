const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users/usersRouter");

const categoriesRouter = 
 require("./routes/categories/categoriesRouter");

const connectDB = require("./config/database");
const { notFound, 
  globalErrorHandler,
 } = require("./middlewares/globalErrorHandler");
const postsRouter = require("./routes/Posts/postRouter");
// const userRoutes = require("./routes/users/usersRouter");
const commentsRouter = require("./routes/comments/commentsRouter");

// const sendEmail = require("./utils/sendEmail");
// sendEmail("yashlowanshi491@gmail.com", "Welcome1234");

//Create an express app
const app = express();

//Load environment variables from .env file
dotenv.config();
connectDB();
app.use(express.json());

//cors middleware
app.use(cors());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);


//!Not found middleware
app.use(notFound);
//!Error handler middleware
app.use(globalErrorHandler);



//! Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

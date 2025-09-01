# 📖 BloggyTechApp

A full-stack blogging platform backend built with **Node.js**,
**Express**, **MongoDB**, and **Mongoose**.\
This app provides APIs for managing users, posts, categories, and
comments, along with features like likes, dislikes, claps, shares, and
scheduled publishing.

------------------------------------------------------------------------

## 🚀 Features

-   👤 User registration & authentication (JWT)
-   📝 Create, update, delete, and read posts
-   🏷️ Categorize posts
-   👍 Like / 👎 Dislike / 👏 Clap / 🔄 Share functionality
-   👀 Track post views
-   💬 Comment system
-   ⏰ Schedule posts for future publishing
-   🌱 Database seeding with realistic data using **Faker.js**
-   🛠️ RESTful API structure

------------------------------------------------------------------------

## 📂 Project Structure

``` bash
backend/
│── models/
│   ├── User.js
│   ├── Category.js
│   ├── Post.js
│   ├── Comment.js
│
│── routes/
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── categoryRoutes.js
│   ├── commentRoutes.js
│
│── controllers/
│   ├── userController.js
│   ├── postController.js
│   ├── categoryController.js
│   ├── commentController.js
│
│── seed.js        # Database seeder
│── server.js      # Main entry point
│── config.js      # DB config
│── package.json
│── README.md
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Backend:** Node.js, Express.js\
-   **Database:** MongoDB with Mongoose\
-   **Authentication:** JWT (JSON Web Token)\
-   **Seeding:**
    [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)\
-   **Dev Tools:** Nodemon, ESLint, Prettier

------------------------------------------------------------------------

## ⚙️ Installation

### 1️⃣ Clone the Repository

``` bash
git clone https://github.com/your-username/bloggytechapp.git
cd bloggytechapp/backend
```

### 2️⃣ Install Dependencies

``` bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file in `backend/`:

``` env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloggytech
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run the Server

``` bash
npm start
```

Server will run at:\
👉 `http://localhost:5000`

------------------------------------------------------------------------

## 🌱 Database Seeding

We provide a **seeding script** to populate the database with **Users,
Categories, Posts, and Comments**.

### Run Seeder

``` bash
node seed.js
```

This will: - Clear old data - Insert random **Users** - Insert
tech-related **Categories** - Insert **Posts** linked to valid users &
categories - Insert **Comments** linked to posts

### Verify Data in MongoDB

``` bash
mongosh
use bloggytech
db.posts.findOne()
```

------------------------------------------------------------------------

## 📦 API Endpoints

### Users

-   `POST /api/users/register` → Register\
-   `POST /api/users/login` → Login\
-   `GET /api/users/:id` → Get profile

### Posts

-   `POST /api/posts` → Create post\
-   `GET /api/posts` → Get all posts\
-   `GET /api/posts/:id` → Get single post\
-   `PUT /api/posts/:id` → Update post\
-   `DELETE /api/posts/:id` → Delete post

### Categories

-   `POST /api/categories` → Create category\
-   `GET /api/categories` → Get all categories

### Comments

-   `POST /api/comments` → Add comment\
-   `GET /api/comments/:postId` → Get comments for post

------------------------------------------------------------------------

## 🧪 Example Post Object

``` json
{
  "title": "Getting Started with Java",
  "content": "Java is a versatile language used in backend, mobile, and enterprise applications...",
  "image": "https://picsum.photos/600/400",
  "author": "64ef3c41f9a2e7b1d9a7a9d5",
  "category": "64ef3c41f9a2e7b1d9a7a9f1",
  "claps": 120,
  "shares": 15,
  "likes": ["64ef3c41f9a2e7b1d9a7a9d8"],
  "dislikes": [],
  "comments": ["64ef3c41f9a2e7b1d9a7b002"]
}
```

------------------------------------------------------------------------

## 📌 Future Improvements

-   🔍 Search & filters for posts\
-   📄 Pagination for posts & comments\
-   ☁️ Image uploads via Cloudinary / AWS S3\
-   🛡️ Admin panel for moderation\
-   🔗 GraphQL API support

------------------------------------------------------------------------

## 👨‍💻 Author

**Sunil Shah**\
📧 <sunilshah7241@gmail.com>\
🔗 [LinkedIn](https://www.linkedin.com/in/shahusunil/)

------------------------------------------------------------------------

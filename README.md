# 📖 BloggyTech Platform

A **full-stack blogging platform** consisting of a **React frontend** and a **Node.js + Express backend** powered by **MongoDB**.  
This project provides a modern blogging experience with authentication, post management, comments, reactions, and more.

---

# 🌐 Frontend — BloggyTech

## Project Overview

BloggyTech Frontend is a modern React-based application that provides an intuitive, responsive, and accessible UI for users to register, login, view, create, and interact with blog posts and comments.  
It leverages Redux Toolkit for state management, React Router v6 for navigation, and Tailwind CSS + Headless UI for styling.

### Features

- 🔐 User Authentication (Registration, Login, Logout)
- 🔒 Protected Routes restricting access based on login state
- 📝 View, create, update, and delete posts (with image upload)
- 👍 Like / 👎 Dislike / 👏 Clap posts
- 💬 Add and view comments
- 📱 Fully responsive & accessible (ARIA + keyboard navigation)
- 🌗 Theming & customization via Tailwind CSS
- 🖼️ Default fallback images for posts and avatars
- ⏳ Loading, error, and success feedback components

### Folder Structure

```plaintext
src/
├── assets/          # Images, icons, and static assets
├── components/      # Reusable UI components grouped by feature
│   ├── Alert/       # Loading, success, and error message components
│   ├── AuthRoute/   # Route protection components
│   ├── Comments/    # Comment list and add comment features
│   ├── Homepage/    # Homepage layout and content
│   ├── Navbar/      # Private and public navigation bars
│   ├── Posts/       # Post CRUD and list components
│   └── Users/       # User login, registration, and profile components
├── redux/           # Redux slices and store setup
│   ├── slices/      # Feature-specific Redux slices (users, posts, comments, categories)
│   └── store/       # Redux store configuration
├── utils/           # Utility functions like reading time calculation
├── App.jsx          # Main App component with routing setup
├── main.jsx         # ReactDOM render and Redux provider setup
└── index.css        # Global Tailwind CSS styles
```

### Getting Started

```bash
git clone https://github.com/yourusername/bloggytech-frontend.git
cd bloggytech-frontend
npm install
npm start
```

App runs at 👉 [http://localhost:3000](http://localhost:3000)

---

# ⚙️ Backend — BloggyTechApp

## Overview

The backend is built with **Node.js**, **Express**, and **MongoDB** using **Mongoose ORM**.  
It provides RESTful APIs for user authentication, posts, categories, comments, and reactions.

### Features

- 👤 User registration & JWT authentication
- 📝 CRUD for posts
- 🏷️ Categorization of posts
- 👍 Like / 👎 Dislike / 👏 Clap / 🔄 Share
- 👀 Post view tracking
- 💬 Comment system
- ⏰ Scheduled publishing
- 🌱 Database seeding with realistic data (Faker.js)

### Project Structure

```plaintext
backend/
│── models/
│   ├── User.js
│   ├── Category.js
│   ├── Post.js
│   ├── Comment.js
│── routes/
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── categoryRoutes.js
│   ├── commentRoutes.js
│── controllers/
│   ├── userController.js
│   ├── postController.js
│   ├── categoryController.js
│   ├── commentController.js
│── seed.js        # Database seeder
│── server.js      # Main entry point
│── config.js      # DB config
│── package.json
│── README.md
```

### Installation

```bash
git clone https://github.com/yourusername/bloggytechapp.git
cd bloggytechapp/backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloggytech
JWT_SECRET=your_jwt_secret
```

Run server:

```bash
npm start
```

API runs at 👉 [http://localhost:5000](http://localhost:5000)

---

### API Endpoints

#### Users
- `POST /api/users/register` → Register
- `POST /api/users/login` → Login
- `GET /api/users/:id` → Profile

#### Posts
- `POST /api/posts` → Create post
- `GET /api/posts` → All posts
- `GET /api/posts/:id` → Single post
- `PUT /api/posts/:id` → Update post
- `DELETE /api/posts/:id` → Delete post

#### Categories
- `POST /api/categories` → Create category
- `GET /api/categories` → All categories

#### Comments
- `POST /api/comments` → Add comment
- `GET /api/comments/:postId` → Post comments

---

## 🧪 Example Post Object

```json
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

---

# 📌 Future Improvements

- 🔍 Search & filters for posts  
- 📄 Pagination for posts & comments  
- ☁️ Image uploads via Cloudinary / AWS S3  
- 🛡️ Admin panel for moderation  
- 🔗 GraphQL API support  

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sunil Shah**  
📧 <sunilshah7241@gmail.com>  
🔗 [LinkedIn](https://www.linkedin.com/in/shahusunil/)  
🔗 [GitHub](https://github.com/sunil624)

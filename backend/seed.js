// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

// require your models (adjust paths if needed)
const User = require("./models/Users/User");
const Category = require("./models/Categories/Category");
const Post = require("./models/Posts/Post");
const Comment = require("./models/Comments/Comment");

const MONGO_URI = process.env.MONGO_URL;

if (process.env.NODE_ENV === "production") {
  console.error("Seeding refused in production!");
  process.exit(1);
}

async function connect() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
}

/* ---------- templates & helpers ---------- */

// 50 category names (real topics)
const categoryList = [
  "Programming",
  "Java",
  "JavaScript",
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "DevOps",
  "Cloud Computing",
  "Open Source",
  "Database",
  "Mobile Development",
  "Android",
  "iOS",
  "Cybersecurity",
  "Blockchain",
  "Cryptocurrency",
  "UI/UX",
  "Design",
  "Productivity",
  "Career",
  "Education",
  "Online Learning",
  "Business",
  "Startups",
  "Finance",
  "Marketing",
  "Social Media",
  "Travel",
  "Food",
  "Recipes",
  "Health",
  "Fitness",
  "Mental Health",
  "Science",
  "Space",
  "Environment",
  "Sports",
  "Cricket",
  "Football",
  "Movies",
  "Music",
  "Books",
  "Photography",
  "Gaming",
  "Fashion",
  "Lifestyle",
  "Parenting",
  "Motivation",
  "History",
];

// curated templates for some categories (title, content, image)
const postTemplates = {
  Java: [
    {
      title: "Getting Started with Java: Setup & First Program",
      content:
        "Java is a class-based, object-oriented programming language widely used for enterprise systems and Android development. In this guide we install JDK, configure the environment and write our first 'Hello World' program.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
    },
    {
      title: "Understanding Java Streams - Filter, Map & Collect",
      content:
        "Java Streams API makes processing collections easier and more expressive. Learn how to use filter, map, flatMap and collect with practical examples.",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80",
    },
    {
      title: "Exception Handling Best Practices in Java",
      content:
        "Learn how to handle exceptions properly: when to use checked vs unchecked exceptions, creating custom exceptions, and structured error handling patterns.",
      image:
        "https://images.unsplash.com/photo-1581091870620-3ea1b6b6b7f7?w=1200&q=80",
    },
  ],
  Programming: [
    {
      title: "How to Write Clean Code: Principles & Examples",
      content:
        "Clean code improves maintainability. We'll cover naming, small functions, single responsibility, and refactoring techniques with code samples.",
      image: "https://source.unsplash.com/featured/?code,programming",
    },
    {
      title: "Big O Notation Explained with Examples",
      content:
        "Understanding time and space complexity is essential for writing efficient code. We'll go through common algorithms and their Big O classification.",
      image: "https://source.unsplash.com/featured/?algorithm,code",
    },
  ],
  "Web Development": [
    {
      title: "Responsive Layouts with CSS Grid and Flexbox",
      content:
        "Learn when to use CSS Grid vs Flexbox and how to combine them for modern responsive layouts. Example projects included.",
      image: "https://source.unsplash.com/featured/?web,css",
    },
    {
      title: "SEO Basics for Modern Web Apps",
      content:
        "Search Engine Optimization strategies for SPAs and SSR apps. Learn meta tags, structured data, and performance optimizations.",
      image: "https://source.unsplash.com/featured/?seo,web",
    },
  ],
  "Data Science": [
    {
      title: "Data Cleaning with Pandas: Best Practices",
      content:
        "Real-world datasets are messy. Learn how to inspect, clean, and prepare data using Pandas for analysis and modeling.",
      image: "https://source.unsplash.com/featured/?data,python",
    },
  ],
  Travel: [
    {
      title: "Top Things to Do in Bali (Local Tips)",
      content:
        "Bali offers beaches, rice terraces and cultural temples. This travel guide includes local transport tips and off-the-beaten-path spots.",
      image: "https://source.unsplash.com/featured/?bali,beach",
    },
  ],
  Food: [
    {
      title: "Classic Margherita Pizza — Step by Step",
      content:
        "A simple Margherita pizza recipe with tips on dough hydration, oven temperature and how to get a blistered crust at home.",
      image: "https://source.unsplash.com/featured/?pizza,food",
    },
  ],
  Health: [
    {
      title: "A 10-Minute Morning Workout to Energize Your Day",
      content:
        "Quick high-intensity bodyweight routine, warmup suggestions, and recovery tips so you can build consistency.",
      image: "https://source.unsplash.com/featured/?workout,fitness",
    },
  ],
  Technology: [
    {
      title: "Cloud Computing 101: IaaS, PaaS and SaaS",
      content:
        "An overview of cloud service models and practical scenarios for AWS, Azure and Google Cloud.",
      image: "https://source.unsplash.com/featured/?cloud,technology",
    },
  ],
  Sports: [
    {
      title: "How T20 Changed Modern Cricket",
      content:
        "T20 format brought explosive batting and tactical innovations. We analyze how strategy changed across formats.",
      image: "https://source.unsplash.com/featured/?cricket,sports",
    },
  ],
  // other categories will fallback to generic templates (see helper below)
};

const commentPool = [
  "This is super helpful, thanks!",
  "Nice write-up — can you provide an example?",
  "I disagree with one point here, but great article overall.",
  "Saved this for later, very useful!",
  "Can you add a section about performance?",
  "Does this work on older versions as well?",
  "Thanks! This made complex topics much clearer.",
  "I tried this and it worked perfectly for me.",
];

function pickTemplate(catName) {
  if (postTemplates[catName]) {
    return faker.helpers.arrayElement(postTemplates[catName]);
  }
  // fallback generic template
  return {
    title: `${catName} — Key Insights`,
    content: `An in-depth look into ${catName.toLowerCase()}. This article explores the most important concepts and real-world use cases.`,
    image: `https://source.unsplash.com/featured/?${encodeURIComponent(catName)}`,
  };
}

/* ---------- seeding functions ---------- */

async function clearDb() {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  console.log("DB cleared");
}

async function createUsers(count = 100) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email(name).toLowerCase();
    const hashed = bcrypt.hashSync("Password123!", 10);
    users.push({
      username: name.replace(/\s+/g, "").toLowerCase(),
      email,
      role: "user",
      password: hashed,
      isVerified: faker.datatype.boolean(),
      accountLevel: faker.helpers.arrayElement(["bronze", "silver", "gold"]),
      profilePicture: faker.image.avatar(),
      bio: faker.lorem.sentence(),
      location: faker.location.city(),
    });
  }
  const inserted = await User.insertMany(users);
  console.log(`${inserted.length} users created`);
  return inserted;
}

async function createCategories(savedUsers) {
  const cats = categoryList.slice(0, 50).map((name) => ({
    name,
    author: faker.helpers.arrayElement(savedUsers)._id,
    shares: faker.number.int({ min: 0, max: 500 }),
  }));
  const saved = await Category.insertMany(cats);
  console.log(`${saved.length} categories created`);
  return saved;
}


async function createPosts(savedUsers, savedCategories, target = 1000) {
  // pre-map ids
  const userIds = savedUsers.map((u) => u._id);
  const posts = [];
  for (let i = 0; i < target; i++) {
    const category = faker.helpers.arrayElement(savedCategories);
    const author = faker.helpers.arrayElement(userIds);
    const tpl = pickTemplate(category.name);
    // small content variation: append an explanatory paragraph
    const extra = faker.lorem.paragraph();
    posts.push({
      title: tpl.title,
      image: tpl.image,
      claps: faker.number.int({ min: 0, max: 2000 }),
      content: tpl.content + "\n\n" + extra,
      author,
      shares: faker.number.int({ min: 0, max: 300 }),
      postViews: faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: 15 })),
      category: category._id,
      scheduledPublished: Math.random() < 0.05 ? faker.date.future() : null,
      likes: faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: 30 })),
      dislikes: faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: 10 })),
      comments: [],
    });
  }
  const savedPosts = await Post.insertMany(posts, { ordered: false });
  console.log(`${savedPosts.length} posts created`);
  return savedPosts;
}

async function bulkAttachPostsToOwners(savedPosts) {
  // build maps: userId -> [postIds], categoryId -> [postIds]
  const userMap = new Map();
  const categoryMap = new Map();
  for (const p of savedPosts) {
    const uid = p.author.toString();
    const cid = p.category.toString();
    if (!userMap.has(uid)) userMap.set(uid, []);
    userMap.get(uid).push(p._id);
    if (!categoryMap.has(cid)) categoryMap.set(cid, []);
    categoryMap.get(cid).push(p._id);
  }

  // User bulk write
  const userOps = [];
  for (const [uid, posts] of userMap) {
    userOps.push({
      updateOne: {
        filter: { _id: uid },
        update: { $push: { posts: { $each: posts } } },
      },
    });
  }
  if (userOps.length) await User.bulkWrite(userOps);
  // Category bulk write
  const catOps = [];
  for (const [cid, posts] of categoryMap) {
    catOps.push({
      updateOne: {
        filter: { _id: cid },
        update: { $push: { posts: { $each: posts } } },
      },
    });
  }
  if (catOps.length) await Category.bulkWrite(catOps);

  console.log("Attached posts to users & categories (bulk)");
}

async function createComments(savedUsers, savedPosts, target = 3000) {
  const userIds = savedUsers.map((u) => u._id);
  const postIds = savedPosts.map((p) => p._id);
  const comments = [];
  for (let i = 0; i < target; i++) {
    const postId = faker.helpers.arrayElement(postIds);
    const author = faker.helpers.arrayElement(userIds);
    const msg = faker.helpers.arrayElement(commentPool);
    comments.push({
      message: msg,
      author,
      postId,
    });
  }
  const savedComments = await Comment.insertMany(comments, { ordered: false });
  console.log(`${savedComments.length} comments created`);
  return savedComments;
}

async function attachCommentsToPosts(savedComments) {
  // map postId -> [commentIds]
  const map = new Map();
  for (const c of savedComments) {
    const pid = c.postId.toString();
    if (!map.has(pid)) map.set(pid, []);
    map.get(pid).push(c._id);
  }

  const ops = [];
  for (const [pid, comments] of map) {
    ops.push({
      updateOne: {
        filter: { _id: pid },
        update: { $push: { comments: { $each: comments } } },
      },
    });
  }
  if (ops.length) await Post.bulkWrite(ops);
  console.log("Attached comments to posts (bulk)");
}

/* ---------- main ---------- */

async function seed() {
  try {
    await connect();
    await clearDb();

    const users = await createUsers(100);

    // create categories, then set category.author randomly to one of created users
    const categories = await createCategories(users);

    // update categories' author
    await Promise.all(
      categories.map((c) =>
        Category.updateOne({ _id: c._id }, { author: faker.helpers.arrayElement(users)._id })
      )
    );

    const posts = await createPosts(users, categories, 1000);

    await bulkAttachPostsToOwners(posts);

    const comments = await createComments(users, posts, 3000);

    await attachCommentsToPosts(comments);

    console.log("Seeding complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();

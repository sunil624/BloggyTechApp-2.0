const express = require("express");
const {
    createCategory,
     getAllCategories,
     updateCategory,
     deleteCategory
     }=require("../../controllers/Categories/categoriesController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoriesRouter = express.Router();

//?Create new category route
categoriesRouter.post("/",isLoggedIn,createCategory);

//?Get all categories route
categoriesRouter.get("/", getAllCategories);

//?Delete category route
categoriesRouter.delete('/:id', isLoggedIn, deleteCategory);

//?Update category route
categoriesRouter.put("/:id", isLoggedIn, updateCategory);

module.exports = categoriesRouter;
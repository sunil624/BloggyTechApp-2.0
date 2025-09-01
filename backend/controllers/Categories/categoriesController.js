const asyncHandler = require("express-async-handler");
const Category = require("../../models/Categories/Category");

//@desc Create a new category
//@route POST /api/v1/categories
//@access private

exports.createCategory = asyncHandler(async (req,resp)=> {
    const {name} = req.body;
    //?Check category existence
    const isCategoryPresent = await Category.findOne({name});
    if (isCategoryPresent) {
        throw new Error("Category already present");
    }
    const category = await Category.create({
        name:name,
        author:req?.userAuth?._id,
    });
    resp.status(201).json({
        status:"success",
        message:"Category successfully created",
        category,
    });
});

//@desc Get all categories
//@route GET /api/v1/categories
//@access public

exports.getAllCategories = asyncHandler(async(req,resp)=> {
    const allCategories = await Category.find({}).populate({
        path:"posts",
        model: "Post"
    });
    resp.status(201).json({
        status:"success",
        message:"Categories successfully fetched",
        allCategories,
    });
});

//@desc Delete category
//@route DELETE /api/v1/categories/:id
//@access private

exports.deleteCategory = asyncHandler(async(req,resp) => {

    await Category.findByIdAndDelete(req.params.id);
    resp.status(201).json({
        status:"success",
        message:"Category successfully deleted",
        });
    });

//@desc update category
//@route UPDATE /api/v1/categories/:id
//@access private

exports.updateCategory = asyncHandler(async(req,resp) => {
    const catId = req.params.id;
    const catName = req.body.name;
    const updatedCategory = await Category.findByIdAndUpdate(
        catId,
        {
            name: catName,
        },
        { new: true, runValidators: true}
    );
    resp.status(201).json({
        status:"success",
        message:"Category successfully updated",
        updatedCategory
    });
});

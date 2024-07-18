import Category from "../../../db/models/category.model.js";
import User from "../../../db/models/user.model.js";
import slugify from "slugify";
import Joi from "joi";
import asyncHandler from "../../middelware/asyncHandler.js";

// // Async Handler
// export const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch((err) => {
//             console.error(err); // Log error details to the console
//             res.status(500).json({ msg: "catch error", err: err.message || err });
//         });
//     };
// };

//////////////////////////////////////////////////////////////
// Add category
export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User does not exist'));
    }

    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
        return next(new Error({ msg: 'user already exists' }));
    }

    const newCategory = new Category({
        name: slugify(name, {
            replacement: "_",
            lower: true
        }),
        userId: userId
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
});
/////////////////////////////////////////////////////////////////////////
// Update category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const id = req.params.id;
    const category = await Category.findOne({ _id: id, userId: req.user._id });
    if (!category) {
        return next(new Error('Category not found or you do not have permission'));
    }
    if (name && name.toLowerCase() === category.name.toLowerCase()) {
        return next(new Error('Name should be different', 409));
    }
    if (name && await Category.findOne({ name: name.toLowerCase() })) {
        return next(new Error('Name already exists', 409));
    }
    if (name) {
        category.name = name;
        category.slug = slugify(name, { replacement: "_", lower: true });
    }
    await category.save();
    res.status(200).json({ message: 'Category updated successfully', category });
});
//////////////////////////////////////////////////////////////////////////////////////
//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id, userId: req.user._id });
    if (!category) {
        return next(new Error('Category not found or you do not have permission'));
    }
    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: 'Category deleted successfully' });
});
/////////////////////////////////////////////////////////////////////////////////
//get Categories(pagination and sort with name )
export const getCategories = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let { page, limit, sort } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sort = sort || 'name';
    const skip = (page - 1) * limit;
    const categories = await Category.find({ userId: userId })
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const totalCount = await Category.countDocuments({ userId: userId });
    if (!categories || categories.length === 0) {
    return next (new Error({ message: 'No categories found' }))
   }
    res.status(200).json({
        message: 'Categories retrieved successfully',
        categories,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////
// Get category by ID
export const getCategoryById = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    const category = await Category.findById({ _id: id, userId: userId });
    if (!category) {
        return next (new Error({ message: 'Category not found' }))
    }
    res.status(200).json({ message: 'Category retrieved successfully', category: category });
});
///////////////////////////////////////////////////////////////////////////////////////////
// filter with name
export const filterwithname = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let { name } = req.query;
    if (!name) {
        return next(new Error({ message: 'Name parameter is required for filtering' }))
    }
    name = name.trim();
    const filter = {
        userId: userId,
        name: { $regex: name, $options: 'i' }
    };
    const categories = await Category.find(filter);
    if (!categories || categories.length === 0) {
        return next(new Error({ message: `No categories found matching name '${name}'` }))
    }
    res.status(200).json({ message: `Categories filtered by name '${name}' retrieved successfully`, categories: categories });
});

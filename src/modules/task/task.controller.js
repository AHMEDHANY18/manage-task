import User from "../../../db/models/user.model.js";
import Task from '../../../db/models/task.model.js';
import Category from '../../../db/models/category.model.js';
import slugify from "slugify";
import Joi from "joi";
import asyncHandler from "../../middelware/asyncHandler.js";

// Async Handler
// export const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch((err) => {
//             console.error(err); // Log error details to the console
//             res.status(500).json({ msg: "catch error", err: err.message || err });
//         });
//     };
// };

// Add a new task
export const addTask = asyncHandler(async (req, res, next) => {
    const { title, type, body, listItems, visibility, categoryId } = req.body;
    const userId = req.user._id;
    const category = await Category.findOne({ _id: categoryId, userId: userId });
    if (!category) {
        return next (new Error({ message: 'Category not found or you do not have permission' }))
    }
    let newTask;
    if (type === 'text') {
        newTask = new Task({
            title,
            type,
            body,
            visibility,
            categoryId,
            userId,
        });
    } else if (type === 'list') {
        newTask = new Task({
            title,
            type,
            listItems,
            visibility,
            categoryId,
            userId,
        });
    } else {
        return next (new Error({ message: 'Invalid task type' }))
    }
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
});
// Update a task
export const updateTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.id;
    const { title, body, listItems, visibility, categoryId } = req.body;
    const userId = req.user._id;
        let task = await Task.findOne({ _id: taskId, userId: userId });
        if (!task) {
            return next (new Error({ message: 'Task not found or you do not have permission' }))
        }
        if (title) task.title = title;
        if (body) task.body = body;
        if (listItems) task.listItems = listItems;
        if (visibility) task.visibility = visibility;
        if (categoryId) task.categoryId = categoryId;
        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete a task
export const deleteTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });
    if (!task) {
        return next (new Error ({ message: 'Task not found or you do not have permission' }))
    }
    await Task.deleteOne({ _id: taskId });
    res.status(200).json({ message: 'Task deleted successfully' });
});

// Get all tasks and pagination
export const getTasksByCategory = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const categoryId = req.params.categoryId;
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {
        userId: userId,
        categoryId: categoryId,
    };
    const tasks = await Task.find(filter)
        .skip(skip)
        .limit(limit);
    const totalCount = await Task.countDocuments(filter);
    res.status(200).json({
        message: 'Tasks retrieved successfully',
        tasks,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
    });
});
// Filter
export const filter = asyncHandler(async (req, res, next) => {
    const { type } = req.query;
    const userId = req.user._id;
    let tasks;
    if (type === 'shared') {
        tasks = await Task.find({ userId: userId, visibility: 'shared' });
    } else if (type === 'private') {
        tasks = await Task.find({ userId: userId, visibility: 'private' });
    } else {
        return next(new Error({ message: 'Invalid filter type. Use "shared" or "private"' }))
    }
    res.status(200).json({ message: `Tasks filtered by ${type} visibility retrieved successfully`, tasks: tasks });
});
//////////////////////////////////////////////////////////////////////////////////
//sort
export const sortTasksByTime = asyncHandler(async (req, res, next) => {
    const { order } = req.query;
    const userId = req.user._id;
    let sortOrder = 1;
    if (order === 'desc') {
        sortOrder = -1;
    }
    const tasks = await Task.find({ userId: userId }).sort({ createdAt: sortOrder });
    res.status(200).json({ message: `Tasks sorted by time (${order || 'asc'}) retrieved successfully`, tasks: tasks });
});


import { Router } from "express";
const router = Router();
import * as TC from "./task.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as TV from "./task.validation.js";

//add task
router.post("/addTask",validate(TV.addTask),auth(), TC.addTask);
//update task
router.put('/updatetask/:id', validate(TV.updateTaskSchema), auth(), TC.updateTask);
//delete task
router.delete('/delete/:id', auth(), TC.deleteTask);
//get all tasks and paginate them
router.get("/GetTask/:categoryId", auth(), TC.getTasksByCategory);
//sort tasks by time
router.get('/sort', auth(), TC.sortTasksByTime);
//filter task
router.get('/filter', auth(), TC.filter);

export default router;

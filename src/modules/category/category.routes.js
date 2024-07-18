import { Router } from "express";
const router = Router();
import * as CC from "./category.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./category.validation.js";

//add categories
router.post("/addCategory",validate(CV.addCategory),auth(), CC.addCategory);
//update categories
router.put("/updateCategory/:id",validate(CV.updateCategory),auth(), CC.updateCategory);
//delete categories
router.delete("/deleteCategory/:id", auth(), CC.deleteCategory);
//get categories and pagination,sort
router.get("/getCategories", auth(), CC.getCategories);
//get by id
router.get("/getCategory/:id", auth(), CC.getCategoryById);
//filter with name 
router.get("/filterwithname", auth(), CC.filterwithname);






export default router;

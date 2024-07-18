import Joi from "joi";


export const addCategory={
    body:Joi.object({
        name:Joi.string().min(3).max(25).required()
    }).required(),

}


export const updateCategory={
    body:Joi.object({
        name:Joi.string().min(3).max(25).required()
    }).required(),

}
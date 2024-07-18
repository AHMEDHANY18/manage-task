import Joi from 'joi';

export const addTask = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('text', 'list').required(),
    body: Joi.string().when('type', {
        is: 'text',
        then: Joi.string().required(),
        otherwise: Joi.optional()
    }),
    listItems: Joi.array().items(Joi.string()).when('type', {
        is: 'list',
        then: Joi.array().min(1).required(),
        otherwise: Joi.optional()
    }),
    visibility: Joi.boolean().default(false),
    categoryId: Joi.string().required(),
});
///////////////////////////////////////////////////////////////////////////
export const updateTaskSchema = Joi.object({
    title: Joi.string(),
    body: Joi.string().when('type', {
        is: 'text',
        then: Joi.string().required(),
        otherwise: Joi.optional()
    }),
    listItems: Joi.array().items(Joi.string()).when('type', {
        is: 'list',
        then: Joi.array().min(1).required(),
        otherwise: Joi.optional()
    }),
    visibility: Joi.string().valid('private', 'shared'),
    categoryId: Joi.string(),
});

import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'list'],
        required: true,
    },
    body: {
        type: String,
        required: function() { return this.type === 'text'; }
    },
    listItems: [{
        type: String,
        required: function() { return this.type === 'list'; }
    }],
    visibility: {
        type: String,
        enum: ['private', 'shared'],
        default: 'private',
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Task = model('Task', taskSchema);

export default Task;

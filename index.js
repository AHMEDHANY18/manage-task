import dotenv from 'dotenv';
import connectiontDB from './db/connectionDB.js';
import express from 'express';
import userRouter from './src/modules/user/user.routes.js';
import categoryRouter from './src/modules/category/category.routes.js';
import taskRouter from './src/modules/task/task.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
connectiontDB();
app.use(express.json());

app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/category', categoryRouter);

app.use('*', (req, res, next) => {
    // Handle invalid requests
    const err = new Error(`Invalid request ${req.originalUrl}`);
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(400).json({ msg: 'Error', err: err.message });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

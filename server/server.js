import express from "express";
import projectApi from './routes/project.routes.js'
import taskApi from './routes/task.routes.js'
import authApi from './routes/auth.routes.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
connectDB();


const PORT = process.env.SERVER_PORT || 8081
const ORIGIN = process.env.CORS_ORIGIN || '*'

const app = express()

app.use(cors({
    origin: ORIGIN,
    credentials: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', projectApi)
app.use('/api', taskApi)
app.use('/api/auth', authApi)

app.listen(PORT, () => {
    console.log(`Your app is running in http://localhost:${PORT}`)
})
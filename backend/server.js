import express from "express";
import api from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
mongoose.connect(process.env.MONGODB_PATH, () => {
    console.log('connect');
}, (e) => console.log(e))


const PORT = process.env.SERVER_PORT || 9000
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'

const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin
}));
app.use(express.json())
app.use(express.urlencoded())

import authRoutes from './routes/auth.js';

app.use('/auth', authRoutes);
app.use(api);
app.listen(PORT, () => {
    console.log(`Your app is running in http://localhost:${PORT}`)
})
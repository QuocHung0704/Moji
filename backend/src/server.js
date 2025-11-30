import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import router from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

//public routes 
app.use('/api/auth', router)

//private routes
app.use(protectedRoute)
app.use("/api/users", userRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server bắt đầu chạy trên cổng ${PORT}`);
    })
}) 

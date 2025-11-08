import express from 'express';
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes.js"
import usersRoutes from "./routes/user.route.js"
import { connectDB } from './DB/db.js'
import cookieParser from 'cookie-parser';
import chatRoutes from "./routes/chat.routes.js"
import cors from 'cors';



dotenv.config()


const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/chat", chatRoutes)



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
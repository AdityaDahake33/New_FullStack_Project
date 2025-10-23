import express from 'express';
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from './DB/db.js'
import cookieParser from 'cookie-parser';



dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
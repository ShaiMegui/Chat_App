import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import authRoute from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js'
import setupSocket from './socket.js';
import messageRoute from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app=express();
const port=process.env.PORT || 3000;
const databaseURL=process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}));
app.use("/uploads/profils",express.static("uploads/profils"));
app.use("/uploads/files",express.static("uploads/files"));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoute)
app.use('/api/contacts',contactRoutes)
app.use('/api/messages',messageRoute)
app.use('/api/channel',channelRoutes)

const server=app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
    
});

setupSocket(server)

mongoose.connect(databaseURL).then(()=>console.log("DB connection Successfull"))
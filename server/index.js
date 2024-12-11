import express from 'express';
import dotenve from "dotenv";
import cors from 'cors'
import conn from './connection.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js"
import contactsRouts from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenve.config();

const app = express();
const port = process.env.PORT   ||   5001
const databaseurl=process.env.DATABASE_URL;

app.use(cors({
    origin: ["https://chat-aura-app-frontend.onrender.com"],
    methods: ["GET", "POST","DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));



app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts',contactsRouts);
app.use('/api/messages',messagesRoutes);
app.use('/api/channel',channelRoutes);

const server = app.listen(port,()=>{
    console.log(`server running at https://localhost:${port}`)
});

setupSocket(server);

conn(databaseurl);

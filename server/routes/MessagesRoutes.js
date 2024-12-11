import {Router} from 'express'
import { verifyToken } from '../middleware/Authmiddleware.js';
import { getMessages, uploadFile } from '../controllers/MessagesController.js';
import multer from 'multer';

const messagesRoutes = Router();

const upload= multer({dest:"uploads/files"})
messagesRoutes.post('/get-messages',verifyToken,getMessages);
messagesRoutes.post("/uploads-file",verifyToken,upload.single("file"),uploadFile)

export default messagesRoutes;
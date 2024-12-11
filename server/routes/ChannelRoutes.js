import {Router}from 'express';
import { verifyToken } from '../middleware/Authmiddleware.js';
import { createChannel, getChannelMesaages, getUserChannels } from '../controllers/ChannelController.js';

const channelRoutes=Router();

channelRoutes.post("/create-channel",verifyToken,createChannel);
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMesaages)

export default channelRoutes;

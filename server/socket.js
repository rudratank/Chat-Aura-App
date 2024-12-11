import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModels.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed user ${userId} from the socket map.`);
        break;
      }
    }
  };

  const sendMessage=async(message)=>{
    
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId=userSocketMap.get(message.recipient);

    const createdMessage = await Message.create(message);

    const messageData=await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color")
    .populate("recipient","id email firstName lastName image color");

    if(recipientSocketId){
      io.to(recipientSocketId).emit("reciveMessage",messageData)
    }
    if(senderSocketId){
      io.to(senderSocketId).emit("reciveMessage",messageData)
    }
  }

  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;
      
      // Validate input
      if (!channelId || !sender) {
        console.error('Invalid message data', message);
        return;
      }
  
      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamp: new Date(),
        fileUrl,
      });
  
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .exec();
  
      // Update channel with new message
      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });
  
      const channel = await Channel.findById(channelId).populate({
        path: 'member',
        select: '_id' // Only select member IDs
      });
  
      if (!channel) {
        console.error('Channel not found', channelId);
        return;
      }
  
      const finalData = {
        ...messageData._doc,
        channelId: channel._id
      };
  
      // Broadcast to all members
      channel.member.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit('receive-channel-message', finalData);
        }
      });
  
      // Broadcast to admin
      const adminSocketId = userSocketMap.get(channel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit('receive-channel-message', finalData);
      }
  
    } catch (error) {
      console.error('Error sending channel message', error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.warn("User ID not provided during connection.");
      socket.disconnect();
    }

    socket.on("sendMessage",sendMessage)

    socket.on("send-channel-message",sendChannelMessage)

    socket.on("disconnect", () => handleDisconnect(socket)); 

  });

};

export default setupSocket;

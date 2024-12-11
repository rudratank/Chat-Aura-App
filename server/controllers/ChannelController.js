import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/Usermodels.js";

export const createChannel = async (request, response, next) => {
    try {
      const { name, member } = request.body;
  
      const userId = request.userId;
  
      const admin = await User.findById(userId);
      if (!admin) {
        return response.status(400).send("Admin User Not Found");
      }
  
      // Ensure members are valid ObjectIds
      const validMembers = await User.find({
        _id: { $in: member.map(id => new mongoose.Types.ObjectId(id)) }
      });
  
      if (validMembers.length !== member.length) {
        return response.status(400).send("Some Members are not valid users.");
      }
  
      const newChannel = new Channel({
        name,
        member,
        admin: userId,
      });
  
      await newChannel.save();
      return response.status(201).json({ Channel: newChannel });
    } catch (error) {
      console.error("Error in creating channel:", error);
      return response.status(500).send("Internal server error");
    }
  };
  
export const getUserChannels= async (request,response,next)=>{
    try {
        const userId=new mongoose.Types.ObjectId(request.userId);
        const channels=await Channel.find({
            $or:[{admin:userId},{member:userId}],
        }).sort({updatedAt:-1});

       
        return response.status(201).json({channels})
        
    } catch (error) {
        console.error("Error in removeProfileImage:", error); // Improved logging
        return response.status(500).send('Internal server error');
    }
}

  
export const getChannelMesaages= async (request,response,next)=>{
    try {
        const {channelId}=request.params;
        const channel=await Channel.findById(channelId).populate({path:"messages",populate:{
            path:"sender",
            select:"firstName lastName email _id image color",
        },
    });
    if(!channel){
        return response.status(404).send("channel not found.")
    }
    const messages= channel.messages
        return response.status(201).json({messages})
        
    } catch (error) {
        console.error("Error in removeProfileImage:", error); // Improved logging
        return response.status(500).send('Internal server error');
    }
}
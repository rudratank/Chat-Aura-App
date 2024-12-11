import Message from "../models/MessagesModels.js";
import {mkdirSync, renameSync} from 'fs'

export const getMessages= async (request,response)=>{
    try {
        
        const user1= request.userId;
        const user2=request.body.id;

        if(!user1 || ! user2){

            return response.status(400).send("Both User Ids are required.");
        }

        const messages = await Message.find({
            $or:[
                {sender:user1,recipient:user2},{sender:user2,recipient:user1}
            ]
        }).sort({timestamp:1})

        console.log(messages)



        return response.status(200).json({messages});

        
    } catch (error) {
        console.error("Error in removeProfileImage:", error);
        return response.status(500).send('Internal server error');
    }
}


export const uploadFile= async (request,response)=>{
    try {
        
    if(!request.file){
        return response.status(200).send("File is reqired.");

    }
    const date= Date.now();
    let fileDir=`uploads/files/${date}`
    let fileName= `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir,{recursive:true});
    renameSync(request.file.path,fileName);
    
        return response.status(200).json({filePath:fileName});
    } catch (error) {
        console.error("Error in removeProfileImage:", error);
        return response.status(500).send('Internal server error');
    }
}
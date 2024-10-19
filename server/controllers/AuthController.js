import user from "../models/UserModel.js";
import jwt from "jsonwebtoken"

const maxAge = 3 * 24 * 60 * 60 * 1000; 

const createToken = (email,userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{ expiresIn:maxAge });
};

export const signup =async(request,respose,next)=>{
    try{
        const {email,pasword}=req.body;
        if(!email || !pasword){
            return respose.status(400).send("Email and Password is required...")
        }
        
        const user= await user.create({email,pasword})
        respose.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });

        return respose.status(201).json({
            user:{
            id:user.id,
            email:user.email,
            profileSetup:user.profileSetup,
        },
    });
    }catch({error}){
        console.log({error});
        return respose.status(500).send("Internal Server Error");
    }
};
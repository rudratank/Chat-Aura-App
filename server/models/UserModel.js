import mongoose from "mongoose"
import {genSalt, hash} from "bcrypt"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:[true,"Email is Required..."],
        unique:true,
    },
    password:{
        type:String,
        require:[true,"Password is Required..."],
    },
    firstName:{
        type:String,
        require:false,
    },
    lastName:{
        type:String,
        require:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        require:false,
    },
    profilrSetup:{
        type:Boolean,
        default:false,
    },
});

//pre and post 2 middleware by moogoose
userSchema.pre("save",async function(next) 
{
    const salt = await genSalt();
    this.password=await hash(this.password,salt);
    next();
})

const User = mongoose.model("Users",userSchema);

export default User;
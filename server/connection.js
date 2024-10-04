import mongoose from "mongoose";

const conn=(databaseURL)=>{

    mongoose.connect(databaseURL)
    .then(()=>console.log("Database Connection Successfull..."))
    .catch((err)=>console.log(err.message));
}

export default conn
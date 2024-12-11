import mongoose from "mongoose";

const conn = (databaseurl) => {
  mongoose.connect(databaseurl)
    .then(() => console.log("Database Connection Successful..."))
    .catch((err) => console.log("Database connection error:", err.message)); // Pass 'err' here
};

export default conn;

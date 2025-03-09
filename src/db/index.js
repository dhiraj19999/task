import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";
dotenv.config();






const connectDB = async () => {


    try {
     
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}` )
        console.log("Database connected successfully:",`${connectionInstance.connection.host}`);


      
    } catch (error) {
        console.log(`Error: ${error}`);
        console.log("Database connection failed");
    }
}
export default connectDB;
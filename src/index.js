import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";



dotenv.config();









connectDB().then(()=>{
    app.listen(process.env.PORT||8080,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("MONGODB connnection failed",err);
})
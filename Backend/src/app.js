
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const app=express();
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
      // Allow the request if it comes from allowedOrigins or if there's no origin (for non-browser requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent
  };
  
  app.use(cors(corsOptions));  // Apply CORS with the custom configuration


dotenv.config();

import cookieParser from "cookie-parser";




//app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));

app.use(express.json({limit:"17kb",extended:true}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));




//  Routes
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter);




export default app;
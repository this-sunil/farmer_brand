import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoute from "./src/routes/authRoute.js";
import postRoute from "./src/routes/postRoute.js";

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config({debug:true,encoding:"utf-8"});
cors({
    methods:["GET","POST","PUT","DELETE"],
    optionsSuccessStatus:200,
    origin: `https://farmer-brand.vercel.app/`,
    credentials:true
});

app.use("/upload",express.static(path.join(process.cwd(),"/upload")));
app.set("view engine","ejs");

app.set("views",path.join(process.cwd(),"/src/views"));
app.get("/",(req,res)=>{
    return res.render("dashboard");
});

app.use("/api",authRoute);
app.use("/api",postRoute);
process.on('exit', (code) => {
  console.log('Process exited with code:', code);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(249); // or let it crash to get full stack trace
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(249);
});

app.listen(process.env.PORT,()=>{
    console.log(`Server Started at https://farmer-brand.vercel.app/`);
});

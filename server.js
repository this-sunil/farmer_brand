import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoute from "./src/routes/authRoute.js";

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
app.set('view engine', 'ejs');
app.use("views",express.static(path.join(process.cwd(),"/src/views")));
app.get("/",(req,res)=>{
    return res.render("index");
});
app.use("/api",authRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server Started at https://farmer-brand.vercel.app/`);
});

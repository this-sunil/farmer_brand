import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoute from "./src/routes/authRoute.js";
import postRoute from "./src/routes/postRoute.js";
import bannerRoute from "./src/routes/bannerRoute.js"
import notificationRoute from "./src/routes/notificationRoute.js";
import categoryRoute from "./src/routes/categoryRoute.js"
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config({debug:true,encoding:"utf-8",override:true});
cors({
    methods:["GET","POST","PUT","DELETE"],
    optionsSuccessStatus:200,
    origin: `https://farmer-brand.vercel.app/`,
    credentials:true
});

app.use("/upload",express.static(path.join(process.cwd(),"/upload")));
app.use('/node_modules/bootstrap/dist/css', express.static(process.cwd(),'/bootstrap-css'));
app.use('/node_modules/bootstrap/dist/js', express.static(process.cwd(),'/bootstrap-js'));

app.set("view engine","ejs");
app.set("views",path.join(process.cwd(),"/src/views"));
app.get("/",(req,res)=>{
    return res.render("dashboard");
});
// TODO: Routing banner

app.use("/api",authRoute);
app.use("/api",postRoute);
app.use("/api",bannerRoute);
app.use("/api",notificationRoute);
app.use("/api",categoryRoute);

process.on('exit', (code) => {
  console.log('Process exited with code:', code);
});

app.listen(process.env.PORT,()=>{
    console.log(`Server Started at https://farmer-brand.vercel.app/`);
});

import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// import authRoute from "./src/routes/authRoute.js";
// import postRoute from "./src/routes/postRoute.js";
// import bannerRoute from "./src/routes/bannerRoute.js"
// import notificationRoute from "./src/routes/notificationRoute.js";
// import farmerRoute from "./src/routes/farmerRoute.js";
// import productRoute from "./src/routes/productRoute.js";
// import paymentRoute from "./src/routes/paymentRoute.js";
// import favFarmerRoute from "./src/routes/favRoute.js";

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config({ debug: false, encoding: "utf-8", override: true ,quiet:true});

cors({
    methods:["GET","POST","PUT","DELETE"],
    optionsSuccessStatus:200,
    allowedHeaders:true,
    origin: `*`,
    credentials:true
});

app.use("/upload",express.static(path.join(process.cwd(),"/upload")));
app.use("/public",express.static(path.join(process.cwd(),"src/public")));
app.use('/bootstrap-css', express.static(path.join(process.cwd(),'/node_modules/bootstrap/dist/css')));
app.use('/bootstrap-js', express.static(path.join(process.cwd(),'/node_modules/bootstrap/dist/js')));

app.set("view engine","ejs");
app.set("views",path.join(process.cwd(),"/src/views"));
app.get("/",(req,res)=>{
    return res.render("dashboard");
});
app.get('/resume', (req, res) => {
  return res.render('resume');
});

// TODO: Routing

// app.use("/api",authRoute);
// app.use("/api",postRoute);
// app.use("/api",bannerRoute);
// app.use("/api",notificationRoute);
// app.use("/api",farmerRoute);
// app.use("/api",productRoute);
// app.use("/api",paymentRoute);
// app.use("/api",favFarmerRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server Started Running`);
});

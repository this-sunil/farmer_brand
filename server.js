import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoute from "./src/routes/authRoute.js";
import postRoute from "./src/routes/postRoute.js";
import bannerRoute from "./src/routes/bannerRoute.js";
import notificationRoute from "./src/routes/notificationRoute.js";
import farmerRoute from "./src/routes/farmerRoute.js";
import productRoute from "./src/routes/productRoute.js";
import admin from "firebase-admin";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config({ debug: true, encoding: "utf-8", override: true });
cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  origin: `https://farmer-brand.vercel.app/`,
  credentials: true,
});

if (!admin.apps.length) {
  const serviceAccount = path.join(process.cwd(), "config/serviceAccount.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendNotification(token, title, body, data = {}) {
  try {
    const message = {
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
    };

    if (token.startsWith("/topics/")) {
      message.topic = token.replace("/topics/", "");
    } else {
      message.token = token;
    }

    return await admin.messaging().send(message);
  } catch (err) {
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, title, body, data = {}, photo = "" } = req.body;

  if (!token || !title || !body) {
    return res
      .status(400)
      .json({ error: "token, title, and body are required!" });
  }

  try {
    await sendNotification(token, title, body, data);

    await axios.post(`${process.env.BASE_URL}/api/addNotification`, {
      title,
      subtitle: body,
      photo,
    });

    res
      .status(200)
      .json({ success: true, message: "Notification sent and logged!" });
  } catch (err) {
    console.error("Error in /sendNotification:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

app.use("/upload", express.static(path.join(process.cwd(), "/upload")));
app.use(
  "/bootstrap-css",
  express.static(path.join(process.cwd(), "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/bootstrap-js",
  express.static(path.join(process.cwd(), "/node_modules/bootstrap/dist/js"))
);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "/src/views"));
app.get("/", (req, res) => {
  return res.render("dashboard");
});
// TODO: Routing banner

app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", bannerRoute);
app.use("/api", notificationRoute);
app.use("/api", farmerRoute);
app.use("/api", productRoute);

process.on("exit", (code) => {
  console.log("Process exited with code:", code);
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at https://farmer-brand.vercel.app/`);
});

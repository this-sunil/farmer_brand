import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import  multerCloudinary  from "multer-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage =new multerCloudinary({
  cloudinary: {
    cloudinary: cloudinary
  },
  folder: "uploads",
  allowed_formats: ["jpg", "jpeg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const upload = multer({ storage: storage });
export default upload;

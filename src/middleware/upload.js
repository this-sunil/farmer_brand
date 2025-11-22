import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary"



// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage using CloudinaryStorage class
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

// Optional: file filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /image\/(jpeg|jpg|png|gif)/;
  if (!allowedMimeTypes.test(file.mimetype.toLowerCase())) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;

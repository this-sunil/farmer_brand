import { v2 as cloudinary } from "cloudinary";
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads"
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /image\/(jpeg|jpg|png|gif)/;
  const isValidMime = allowedMimeTypes.test(file.mimetype.toLowerCase());
  if (!isValidMime) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;

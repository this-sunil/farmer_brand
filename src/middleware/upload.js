import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `${timestamp}`; // e.g., "my-photo-1697043845123"
    },
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

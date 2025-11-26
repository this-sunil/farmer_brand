import upload from "../middleware/upload.js";


export const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const middleware = upload.single(fieldName);

    middleware(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message || err,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      next(); // go to the next middleware or route handler
    });
  };
};

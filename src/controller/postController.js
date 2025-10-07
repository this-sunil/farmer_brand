import pool from "../dbHelper/dbHelper.js";
import path from "path";
const createPostTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS posts(
    pid SERIAL PRIMARY KEY,
    post_title TEXT NOT NULL,
    post_desc TEXT NOT NULL,
    post_url TEXT NOT NULL,
    post_type TEXT NOT NULL,
    fav INTEGER DEFAULT 0,
    uid INTEGER NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
    created_at DATE DEFAULT CURRENT_TIMESTAMP
    )`;
  pool.query(query, (err) => {
    if (err) {
      console.log(`Error Creating Post Table=>${err}`);
    }
    console.log("Create Post Successfully");
  });
};

createPostTable();

export const addPostController = async (req, res) => {
  const { uid, title, description } = req.body;
  try {
    if (!uid) {
      return res.status(404).json({
        status: false,
        msg: "Missing user id",
      });
    }
    
    const url = req.file ? req.file.filename : "";
    const query = `INSERT INTO posts(uid,post_title,post_desc,post_url,post_type) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    

  
    const ext = path.extname(req.file.originalname).toLowerCase().slice(1); // 'jpg', 'mp4', etc.

    const imageTypes = ["jpeg", "jpg", "png", "gif", "webp"];
    const videoTypes = ["mp4", "mov", "avi", "webm", "mkv"];

    let fileType = "";

    if (imageTypes.includes(ext)) {
      fileType = "image";
    } else if (videoTypes.includes(ext)) {
      fileType = "video";
    } else {
      fileType = "unsupported";
    }
    const fileTextType = fileType === 'image' ? 'Image File' :
                     fileType === 'video' ? 'Video File' : 'Unsupported';
    const { rows } = await pool.query(query, [
      uid,
      title,
      description,
      url,
      fileTextType
    ]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Post Inserted Successfully",
      });
    }
  } catch (e) {
    console.log(`Error in addPostController=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const deletePostController = async (req, res) => {
  const postId = req.body.postId;
  try {
    if (!postId) {
      return res.status(404).json({
        status: false,
        msg: "Missing Post Id",
      });
    }
    const query = `DELETE FROM posts WHERE pid=$1 RETURNING *`;
    const { rows } = await pool.query(query, [postId]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Delete Post Successfully !!!",
        result: rows[0],
      });
    }
  } catch (e) {
    console.log(`Error in addPostController=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

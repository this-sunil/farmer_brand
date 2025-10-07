import pool from "../dbHelper/dbHelper";

const createPostTable=async()=>{
    const query=`CREATE TABLE IF NOT EXISTS posts(
    pid SERIAL PRIMARY KEY,
    post_title TEXT NOT NULL,
    post_desc TEXT NOT NULL,
    post_url TEXT NOT NULL,

    post_type TEXT NOT NULL,
    fav INTEGER DEFAULT 0,
    uid TEXT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(id),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
    )`;
    pool.query(query,(err)=>{
        if(err){
            console.log(`Error Creating Post Table=>${err}`); 
        }
        console.log("Create Post Successfully");
    });
};
createPostTable();
 

export const addPostController=async(req,res)=>{
    const {uid,title,description}=req.body;
    try{
    if(!uid){
        return res.status(404).json({
            status:false,
            msg:"Missing user id"
        });
    }
    const url=req.file?req.file.filename:"";
    const query=`INSERT INTO posts(uid,title,description,url) VALUES($1,$2,$3,$4) RETURNING *`;
    const {rows}=await pool.query(query,[uid,title,description,url]);
    if(rows.length>0){
        return res.status(200).json({
            status:true,
            msg:"Post Inserted Successfully",
        });
    }
  }catch(e){
    console.log(`Error in addPostController=>${e.message}`);
    return res.status(500).json({
        status:false,
        msg:"Internal Server Error"
    });
  }
};

export const deletePostController=async(req,res)=>{
    const postId=req.body.postId;
    try{
        if(!postId){
            return res.status(404).json({
                status:false,
                msg:"Missing Post Id"
            });
        }
        const query=`DELETE FROM posts WHERE pid=$1 RETURNING *`;
        const {rows}=await pool.query(query,[postId]);
        if(rows.length>0){
            return res.status(200).json({
                status:true,
                msg:"Delete Post Successfully !!!",
                result:rows[0]
            });
        }
    }
    catch(e){
       console.log(`Error in addPostController=>${e.message}`);
    return res.status(500).json({
        status:false,
        msg:"Internal Server Error"
    }); 
    }
};

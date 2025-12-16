import pool from "../dbHelper/dbHelper.js";
const createFavTable=()=>{
    const query=`
    CREATE TABLE IF NOT EXISTS fav_farmer(
    fav_id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    pid INT NOT NULL,
    fid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(id),
    FOREIGN KEY (pid) REFERENCES products(pid),
    FOREIGN KEY (fid) REFERENCES farmer(fid)
    )`;
    pool.query(query,(err)=>{
        if(err){
            throw err;
        }
        console.log(`Favorite farmer created !!!`);
    });
}

createFavTable();
export const addFavController=async(req,res)=>{
    const {uid,fid}=req.body;
    try {
        const query=`INSERT INTO fav_farmer(uid,fid) VALUES($1,$2) RETURNING *`;
        const {rows}=await pool.query(query,[uid,fid]);
        return res.status(200).json({
            status:true,
            msg:"Favorite Inserted Successfully !!!",
            result:rows
        });
    } catch (error) {
        console.log(`Error Add Favorite Controller=>${error.message}`);
        return res.status(500).json({
            status:false,
            msg:"Internal Server Error"
        });
    }
};

export const removeFavController=async(req,res)=>{
    const id=req.body.id;
    try {
        const query=`DELETE FROM fav_farmer WHERE id=$1 RETURNING *`;
        const {rows}=await pool.query(query,[id]);
        return res.status(200).json({
            status:true,
            msg:"Delete fav farmer Successfully !!!",
            result:rows
        });
    } catch (error) {
        console.log(`Remove Favorite Controller=>${error.message}`);
        return res.status(500).json({
            status:false,
            msg:"Internal Server Error"
        });
    }
};
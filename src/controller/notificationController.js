import pool from "../dbHelper/dbHelper.js";

const createNotificationTable=async()=>{
  const query=`
  CREATE TABLE IF NOT EXISTS notification(
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   subtitle TEXT NOT NULL,
   photo TEXT NOT NULL,
   created_at DATE DEFAULT CURRENT_DATE
  )`;
  pool.query(query,(err)=>{
    if(err){
        console.log(`Error Creating table ${err.cause}`);
    }
    console.log(`Notification Table Created Successfully`);
  });
};

createNotificationTable();
export const fetchNotificationController = async (req, res) => {
  try {
    const { page = 1 } = req.body;
    const limit = 10;
    const offset = (page - 1) * limit;

    
    const totalQuery = `SELECT COUNT(*) FROM notification`;
    const totalResult = await pool.query(totalQuery);
    const totalItem = parseInt(totalResult.rows[0].count);
    const totalPage = Math.ceil(totalItem / limit);

    
    const query = `SELECT * FROM notification ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const { rows } = await pool.query(query, [limit, offset]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Data Found !!!"
      });
    }

    const prevPage = page > 1 ? page - 1 : '';
    const nextPage = page < totalPage ? page + 1 : '';

    return res.status(200).json({
      status: true,
      msg: "Fetch notification Successfully !!!",
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
      totalItem,
      result: rows
    });
  } catch (e) {
    console.error(`Error in notification controller => ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error`
    });
  }
};

export const addNotificationController=async (req,res) => {
    try {
      const {title,subtitle}=req.body;
      if(!title || !subtitle){
        return res.status(400).json({
          status:false,
          msg:"Missing Parameter"
        });
      }
      const photo=req.file?req.file.path:"";
      const query=`INSERT INTO notification(title,subtitle,photo) VALUES($1,$2,$3) RETURNING *`;
      const { rows }=await pool.query(query,[title,subtitle,photo]);
      if(rows.length>0){
        return res.status(200).json({
          status:true,
          msg:"Inserted Successfully !!!"
        });
      }
    } catch (error) {
      console.log(`Error in add notification=>${error.message}`);
      return res.status(500).json({
        status:false,
        msg:"Internal Server Error"
      });
    }
};

export const deleteNotificationController=async (req,res) => {
  const id=req.body.id;
  try {
    const query=`DELETE FROM notification WHERE id=$1`;
    const {rows}=await pool.query(query,[id]);
    if(rows.length===0){
      return res.status(404).json({
        status:false,
        msg:"Notification doesn't exist"
      });
    }
    return res.status(200).json({
      status:true,
      msg:"Notification Deleted Successfully !!!",
      result:rows
    });
  } catch (error) {
    return res.status(500).json({
      status:false,
      msg:"Internal Server Error"
    });
  }
};
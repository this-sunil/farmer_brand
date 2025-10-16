import pool from "../dbHelper/dbHelper";

const createNotificationTable=async()=>{
  const query=`CREATE TABLE IF NOT EXISTS notification(
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   subtitle TEXT NOT NULL,
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
export const fetchNotificationController=async (req,res) => {
    try{
      const query=`SELECT * FROM notification`;
      const {rows}=await pool.query(query);
      if(rows.length===0){
        return res.status(404).json({
          status:false,
          msg:"No Data Found !!!"
        });
      }
      return res.status(200).json({
        status:true,
        msg:"Fetch notification Successfully !!!",
        result:rows
      });
    }
    catch(e){
      console.log(`Error in notification controller=>${e.message}`);
      return res.status(500).json({
        status:false,
        msg:"Internal Server Error"
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
          msg:"Inserted Successfully !!!",
          result:rows
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
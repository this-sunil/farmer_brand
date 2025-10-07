import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({debug:true,encoding:"utf-8"});
//   database:process.env.DB_NAME,
//   host:process.env.DB_HOST,
//   port:process.env.DB_PORT,
//   user:process.env.DB_USER,
//   password:""

const pool=new Pool({
    connectionString:process.env.POSTGRES_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

const connect=async()=>{
    pool.connect((err)=>{
        if(err){
            console.log(`ERROR IN DATABASE=>${err.message}`);
            
        }
        console.log(`Database Created Successfully !!!`);  
    });
};

connect();
export default pool;
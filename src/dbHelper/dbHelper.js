import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({debug:true,encoding:"utf-8"});
const pool=new Pool({
    connectionString:process.env.POSTGRES_URL,
    idleTimeoutMillis: 10000, // 10 seconds
    keepAlive: true
//   database:process.env.DB_NAME,
//   host:process.env.DB_HOST,
//   port:process.env.DB_PORT,
//   user:process.env.DB_USER,
//   password:""
});

const connect=async()=>{
    pool.connect((err)=>{
        if(err){
            throw err;
        }
        console.log(`Database Created Successfully !!!`);  
    });
};

connect();
export default pool;
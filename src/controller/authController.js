import pool from "../dbHelper/dbHelper.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/token.js";

const admin = async () => {
  const existUser = `SELECT * FROM users`;
  const result = await pool.query(existUser);
  if (result.rows.length === 0) {
    const query = `INSERT INTO users(name,phone,photo,pass,state,city,role) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const hashPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    const { rows } = await pool.query(query, [
      "admin",
      "1234567890",
      "",
      hashPass,
      "Maharashtra",
      "Satara",
      "admin"
    ]);
    delete rows[0].pass;
    if (rows.length > 0) {
      return console.log("Admin Created Successfully !!!");
    }
  }
};

const createUserTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY,name TEXT NOT NULL,phone BIGINT NOT NULL,photo TEXT NOT NULL,pass TEXT NOT NULL,state TEXT NOT NULL,city TEXT NOT NULL,role TEXT NOT NULL,created_at DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, (err) => {
    if (err) {
      console.log(`Creating Table Error=> ${err.message}`);
    }
    console.log(`User Table Created Successfully`);
  });
  admin();
};

createUserTable();

export const loginController = async (req, res) => {
  const { phone, pass } = req.body;
  //try {
    const existUser = `SELECT * FROM users WHERE phone=$1`;
    const { rows } = await pool.query(existUser, [phone]);
    const isMatch = await bcrypt.compare(pass, rows[0].pass);
    if (!isMatch) {
      return res.status(200).json({
        status: false,
        msg: "Password doesn't Match",
      });
    }
    
    if(rows.length===0){
      return res.status(404).json({
        status:false,
        msg:"User doesn't exist"
      });
    }
    delete rows[0].pass;
    const token = await generateToken(rows[0].role);
    return res.status(200).json({
      status: true,
      msg: "User Login Successfully",
      token,
      result: rows[0]
    });
  // } catch (error) {
  //   console.log(`Login Controller Error=>${error.message}`);
  //   return res.status(500).json({
  //     status: false,
  //     msg: `Internal Server Error ${error.message}`
  //   });
  // }
};

export const registerController = async (req, res) => {
  const { name, phone, pass, state, city } = req.body;
  try {
    const query = `INSERT INTO users(name,phone,photo,pass,state,city,role) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const hashPass = await bcrypt.hash(pass, 10);
    const { rows } = await pool.query(query, [
      name,
      phone,
      "",
      hashPass,
      state,
      city,
      "user"
    ]);
    delete rows[0].pass;
    const token = await generateToken(rows[0].role);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "User Register Successfully !!!",
        token,
        result: rows[0],
      });
    }
  } catch (error) {
    console.log(`Register Controller Error=>${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getProfileController = async (req, res) => {
  const id = req.body.id;
  try {
    const query = `SELECT * FROM users WHERE id=$1`;
    const { rows } = await pool.query(query, [id]);
    delete rows[0].pass;
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "User doesn't Exist",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Fetch User Successfully",
      result: rows[0],
    });
  } catch (e) {
    console.log(`Fetch User Controller ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const updateUserController = async (req, res) => {
  const { id, name, phone, state, city } = req.body;
  try {
    if(!id){
      return res.status(404).json({
        status:false,
        msg:"Missing userid"
      });
    }
    const field = [];
    const values = [];
    let index = 1;
    const photo=req.file?req.file.filename:"";
    const data = { name, phone, state, city };
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        field.push(`${key}=$${index++}`);
        values.push(value);
      }
    }
    field.push(`photo=$${index++}`);
    values.push(photo);
    values.push(id);

    const query = `UPDATE users SET ${field.join(
      ", "
    )} WHERE id=$${index} RETURNING *`;
    const { rows } = await pool.query(query, values);
    delete rows[0].pass;
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Update User",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Update User Successfully !!!",
      result: rows[0],
    });
  } catch (e) {
    console.log(`Update User Controller Error=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const deleteUserController = async (req, res) => {
  const id = req.body.id;
  try {
    const query = `DELETE FROM users WHERE id=$1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "User doesn't Exist",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Delete User Successfully",
    });
  } catch (e) {
    console.log(`Delete User Controller ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getAllUserController = async (req, res) => {
  try {
    const id = 1;
    const query = `SELECT * FROM users WHERE id!=$1`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No User Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Fetch All User Successfully !!!",
      result: rows,
    });
  } catch (error) {
    console.log(`Error in Get All User Controller=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

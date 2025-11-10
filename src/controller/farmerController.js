import pool from "../dbHelper/dbHelper.js";
import bcrypt from "bcrypt";

const createFarmerTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS farmer(fid SERIAL PRIMARY KEY,name TEXT,pass TEXT,photo TEXT,phone TEXT,city TEXT,pin TEXT,created_at DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, (err) => {
    if (err) {
      console.log(`Error in farmer Table=>${err}`);
    }
    console.log(`Farmer Created Successfully`);
  });
};

createFarmerTable();

export const registerFarmerController = async (req, res) => {
  const { name, pass, phone, city, pin } = req.body;
  const photo = req.file ? req.file.path : "";
  if (!name || !pass || !phone || !city || !pin) {
    return res.status(404).json({
      status: false,
      msg: "Missing params",
    });
  }
  try {
    const hashPass = await bcrypt.hash(pass, 10);
    const query = `INSERT INTO farmer(name,pass,photo,phone,city,pin) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`;
    const { rows } = await pool.query(query, [
      name,
      hashPass,
      photo,
      phone,
      city,
      pin
    ]);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Data Found !!!"
      });
    }
    delete rows[0].pass;
    return res.status(200).json({
      status: true,
      msg: "Farmer Added Successfully !!!",
      result: rows[0]
    });
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${e.message}`
    });
  }
};

export const loginFarmerController = async (req, res) => {
  const { phone, pass } = req.body;
  try {
    if (!phone || !pass) {
      return res.status(404).json({
        status: false,
        msg: "Missing params"
      });
    }
    const query = `SELECT * FROM farmer WHERE phone=$1`;
    const { rows } = await pool.query(query, [phone]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Farmer Exists !!!",
      });
    }
    const isMatch =await bcrypt.compare(pass, rows[0].pass);
    if (isMatch)
      return res.status(200).json({
        status: true,
        msg: "Farmer Login Successfully !!!",
        result: rows,
      });
  } catch (error) {
    console.log(`Internal Server Error =>${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const editFarmerController = async (req, res) => {
  const { fid, name, phone, state, pin } = req.body;
  const photo = req.file ? req.file.path : "";
  try {
    const field = [];
    const values = [];
    const index = 1;
    const data = { name, phone, state, pin };

    for (const [key, value] in Object.entries(data)) {
      field.push(`${key}=$${index++}`);
      values.push(value);
    }
    if (photo) {
      field.push("photo", `$${index++}`);
      values.push(photo);
    }
    values.push(fid);
    const query = `UPDATE Farmer SET ${field.join(", ")} WHERE fid=$${index}`;
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "Failure update Farmer",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Update Farmer Successfully !!!",
      result: rows,
    });
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

export const deleteFarmerController = async (req, res) => {
  const fid = req.body.fid;
  try {
    if (!fid) {
      return res.status(404).json({
        status: false,
        msg: "Missing Farmer id",
      });
    }
    const query = `DELETE FROM Farmer WHERE fid=$1`;
    const { rows } = await pool.query(query, [fid]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "Failed to Delete",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Deleted Successfully",
    });
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getAllFarmerController = async (req, res) => {
  const page = req.body.page || 1;
  try {
    const limit = 10;
    const query = `SELECT * FROM Farmer ORDER BY fid LIMIT $1 OFFSET $2`;
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(query, [limit, offset]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Data Found !!!",
      });
    }
    delete rows[0].pass;
    const totalItem = rows.length;
    const totalPage = Math.ceil(totalItem / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPage;

    return res.status(200).json({
      status: true,
      msg: "Fetch Farmer Successfully",
      prevPage: hasPrevPage,
      nextPage: hasNextPage,
      result: rows,
    });
  } catch (e) {
    console.log(`Error in ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${e.message}`,
    });
  }
};

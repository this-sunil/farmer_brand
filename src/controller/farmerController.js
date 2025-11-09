import pool from "../dbHelper/dbHelper.js";

const createFarmerTable = async () => {
  const query = `
  
  CREATE TABLE IF NOT EXISTS farmer(fid SERIAL PRIMARY KEY,farmer_title TEXT,farmer_photo TEXT,phone TEXT,city TEXT,pin TEXT,created_at DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Farmer Created Successfully`);
  });
};

createFarmerTable();

export const addFarmerController = async (req, res) => {
  const { farmer_title,phone,city,pin } = req.body;
  const photo = req.file ? req.file.path : "";
  if (!photo) {
      return res.status(404).json({
        status: false,
        msg: "Missing params"
      });
    }
  try {
    const query = `INSERT INTO farmer(farmer_title,farmer_photo,phone,city,pin) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    const { rows } = await pool.query(query, [farmer_title, photo,phone,city,pin]);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Data Found !!!"
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Farmer Added Successfully",
      result: rows[0],
    });
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const editFarmerController = async (req, res) => {
  const { fid, farmer_title,phone,state,pin } = req.body;
  const photo = req.file ? req.file.path : "";
  try {
    const field = [];
    const values = [];
    const index = 1;
    const data = { fid, farmer_title,phone,state,pin };

    for (const [key, value] in Object.entries(data)) {
      field.push(`${key}=$${index++}`);
      values.push(value);
    }
    if (photo) {
      field.push("farmer_photo", `$${index++}`);
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
        msg: "Missing Farmer id"
      });
    }
    const query = `DELETE FROM Farmer WHERE fid=$1`;
    const { rows } = await pool.query(query, [fid]);
    if (rows.length === 0) {
      return res.status(404).json({
        status:false,
        msg:"Failed to Delete"
      });
    }
    return res.status(200).json({
        status:true,
        msg:"Deleted Successfully"
      });

  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error"
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
    const totalItem = rows.length;
    const totalPage = Math.ceil(totalItem / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPage;

    return res.status(200).json({
      status: true,
      msg: "Fetch Farmer Successfully",
      prevPage:hasPrevPage,
      nextPage:hasNextPage,
      result: rows
    });
  } catch (e) {
    console.log(`Error in ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${e.message}`
    });
  }
};

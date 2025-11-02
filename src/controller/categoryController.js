import pool from "../dbHelper/dbHelper.js";

const createCatTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS category(cid SERIAL PRIMARY KEY,cat_title TEXT,cat_photo TEXT,created_at DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Category Created Successfully`);
  });
};

createCatTable();

export const addCategoryController = async (req, res) => {
  const { cat_title } = req.body;
  const photo = req.file ? req.file.filename : "";
  if (!photo) {
      return res.status(404).json({
        status: false,
        msg: "Missing params",
      });
    }
  try {
    
    const query = `INSERT INTO category(cat_title,cat_photo) VALUES($1,$2) RETURNING *`;
    const { rows } = await pool.query(query, [cat_title, photo]);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Data Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Category Added Successfully",
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

export const editCategoryController = async (req, res) => {
  const { cid, cat_title } = req.body;
  const photo = req.file ? req.file.filename : "";
  try {
    const field = [];
    const values = [];
    const index = 1;
    const data = { cid, cat_title };

    for (const [key, value] in Object.entries(data)) {
      field.push(`${key}=$${index++}`);
      values.push(value);
    }
    if (photo) {
      field.push("cat_photo", `$${index++}`);
      values.push(photo);
    }

    const query = `UPDATE category SET ${field.join(", ")} WHERE cid=$${index}`;
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "Failure update category",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Update Category Successfully !!!",
      result: rows,
    });
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

export const deleteCategoryController = async (req, res) => {
  const cid = req.body.cid;
  try {
    if (!cid) {
      return res.status(404).json({
        status: false,
        msg: "Missing Category id",
      });
    }
    const query = `SELECT * FROM category WHERE cid=$1`;
    const { rows } = await pool.query(query, [cid]);
    if (rows.length === 0) {
      return res.status(400).json({});
    }
  } catch (e) {
    console.log(`Error =>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const page = req.body.page || 1;
    const limit = 10;
    const query = `SELECT * FROM category ORDER BY cid LIMIT $1 OFFSET $2`;
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
      msg: "Fetch Category Successfully",
      prevPage:hasPrevPage,
      nextPage:hasNextPage,
      result: rows,
    });
  } catch (e) {
    console.log(`Error in ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

import pool from "../dbHelper/dbHelper.js";

const productTable = async () => {

  const query = `
  CREATE TABLE IF NOT EXISTS products (
    pid SERIAL PRIMARY KEY,
    product_title TEXT NOT NULL,
    product_desc TEXT NOT NULL,
    product_photo TEXT DEFAULT '',
    product_price FLOAT NOT NULL,
    product_qty INTEGER DEFAULT 0,
    product_stock INTEGER DEFAULT -1,
    product_weight TEXT NOT NULL,
    cid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cid) REFERENCES category(cid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS users_product (
    uid INT NOT NULL,
    pid INT NOT NULL,
    qty INT NOT NULL,
    PRIMARY KEY(uid,pid),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pid) REFERENCES products(pid) ON DELETE CASCADE ON UPDATE CASCADE
);`;

  const existCategory = `SELECT * FROM category`;
  const { rows } = await pool.query(existCategory);

  if (rows.length > 0) {
    pool.query(query, (err) => {
      if (err) {
        console.log(`Error in Table=>${err.message}`);
      }
      console.log(`Product Table Successfully`);
    });
  }
};

productTable();

export const addProductController = async (req, res) => {
  const { title, description, price, qty, stock, weight, cid } = req.body;
  try {
    const query = `INSERT INTO products(
    product_title,
    product_desc,
    product_photo,
    product_price,
    product_qty,
    product_stock,
    product_weight,
    cid) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const photo = req.file ? req.file.path : "";
    const { rows } = await pool.query(query, [
      title,
      description,
      photo,
      price,
      qty,
      stock,
      weight,
      cid
    ]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "Product Insertion Failed !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Product Inserted Successfully !!!",
      result: rows[0],
    });
  } catch (e) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error`
    });
  }
};

export const addQtyController = async (req, res) => {
  const { uid, pid, qty } = req.body;
  try {
    const query = `INSERT INTO users_product(uid,pid,qty) VALUES($1,$2,$3) RETURNING *`;
    const { rows } = await pool.query(query, [uid, pid, qty]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Data Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Product qty Inserted !!!",
      result: rows[0],
    });
  } catch (error) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const pid = req.body.pid;
    const query = `DELETE FROM product WHERE pid=$1`;
    const { rows } = await pool.query(query, [pid]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Product found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Delete product Successfully !!!",
      result: rows[0],
    });
  } catch (error) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { pid, title, description, price, qty, stock, weight } = req.body;
  try {
    const fields = [];
    const values = [];
    let index = 1;

    const data = {
      title,
      description,
      price,
      qty,
      stock,
      weight,
    };
    for (const [key, value] in Object.entries(data)) {
      if (value !== "undefined") {
        fields.push(`${key}==$${index++}`);
        values.push(value);
      }
    }
    const photo = req.file ? req.file.path : "";
    if (!photo) {
      fields.push(`product_photo=$${index++}`);
      values.push(photo);
    }
    values.push(pid);

    const query = `UPDATE products SET ${fields.join(
      ", "
    )} WHERE pid=$${index}`;
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No data updated !!!"
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Update Product Successfully !!!",
      result: rows[0]
    });
  } catch (e) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const query = `SELECT 
    cat.cid,
    cat.cat_title,
    JSON_AGG(JSON_BUILD_OBJECT(
        'pid', p.pid,
        'product_title', p.product_title,
        'product_desc', p.product_desc,
        'product_photo', p.product_photo,
        'product_qty', COALESCE(up.product_qty, 0),
        'product_stock', p.stock,
        'product_weight', p.product_weight
    )) AS products
FROM products p
LEFT JOIN category cat ON cat.cid = p.cid
LEFT JOIN users_product up ON p.pid = up.pid
GROUP BY cat.cid, cat.cat_title;`;
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Data Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Fetch Product Successfully",
      result: rows,
    });
  } catch (e) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${e.message}`,
    });
  }
};

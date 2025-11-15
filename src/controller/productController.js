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
    fid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fid) REFERENCES farmer(fid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS users_product (
    uid INT NOT NULL,
    pid INT NOT NULL,
    qty INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_product_uid_fkey FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT users_product_pid_fkey FOREIGN KEY (pid) REFERENCES products(pid) ON DELETE CASCADE
);`;

  pool.query(query, (err) => {
    if (err) {
      console.log(`Error in Table=>${err.message}`);
    }
    console.log(`Product Table Successfully`);
  });
};

productTable();

export const addProductController = async (req, res) => {
  const { title, description, price, qty, stock, weight, fid } = req.body;
  try {
    if (!title || !description || !price || !qty || !stock || !weight || !fid) {
      return res.status(404).json({
        status: false,
        msg: "Missing Params",
      });
    }
    const query = `INSERT INTO products(
    product_title,
    product_desc,
    product_photo,
    product_price,
    product_qty,
    product_stock,
    product_weight,
    fid) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const photo = req.file ? req.file.path : "";
    const { rows } = await pool.query(query, [
      title,
      description,
      photo,
      price,
      qty,
      stock,
      weight,
      fid,
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
      msg: `Internal Server Error`,
    });
  }
};

export const addQtyController = async (req, res) => {
  const { uid, pid, qty } = req.body;

  try {
    if (!uid || !pid || !qty) {
      return res.status(400).json({
        status: false,
        msg: "Missing Params",
      });
    }

    const userQuery = `SELECT * FROM users WHERE id = $1`;
    const userResult = await pool.query(userQuery, [uid]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "User doesn't exist",
      });
    }

    const checkQuery = `SELECT * FROM users_product WHERE uid=$1 AND pid=$2`;
    const checkResult = await pool.query(checkQuery, [uid, pid]);

    if (checkResult.rows.length > 0) {
      const updateQuery = `
        UPDATE users_product 
        SET qty = $3
        WHERE uid=$1 AND pid=$2 
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [uid, pid, qty]);

      return res.status(200).json({
        status: true,
        msg: "Product qty updated!",
        result: result.rows[0],
      });
    } else {
      const insertQuery = `
        INSERT INTO users_product(uid, pid, qty) 
        VALUES($1, $2, $3) 
        RETURNING *
      `;
      const result = await pool.query(insertQuery, [uid, pid, qty]);

      return res.status(200).json({
        status: true,
        msg: "Product qty inserted!",
        result: result.rows[0],
      });
    }
  } catch (error) {
    console.log("Something Went Wrong =>", error.message);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${error.message}`,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const pid = req.body.pid;
    const query = `DELETE FROM products WHERE pid=$1`;
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

export const updateProductController = async (req, res) => {
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
        msg: "No data updated !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Update Product Successfully !!!",
      result: rows[0],
    });
  } catch (e) {
    console.log(`Something Went Wrong=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const page = Number(req.body.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const countQuery = `SELECT COUNT(DISTINCT fid) AS total FROM farmer;`;
    const countResult = await pool.query(countQuery);
    const totalItem = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItem / limit);
    const query = `
SELECT 
    f.fid,
    f.name,
    f.city,
    f.pin,
    f.photo,
    COALESCE(
      JSON_AGG(
        JSONB_BUILD_OBJECT(
          'pid', p.pid,
          'product_title', p.product_title,
          'product_desc', p.product_desc,
          'product_photo', p.product_photo,
          'product_qty', COALESCE(up.qty, 0),
          'product_stock', p.product_stock,
          'product_weight', p.product_weight,
          'product_price', p.product_price
        )
        ORDER BY p.pid  -- sort products inside JSON array
      ) FILTER (WHERE p.pid IS NOT NULL),
      '[]'::json
    ) AS products
FROM farmer f
LEFT JOIN products p ON f.fid = p.fid
LEFT JOIN users_product up ON p.pid = up.pid
GROUP BY f.fid, f.name, f.city, f.pin, f.photo
ORDER BY f.fid, f.name
LIMIT $1 OFFSET $2;
`;

    const { rows } = await pool.query(query, [limit, offset]);

    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Data Found",
      });
    }

    const prevPage = page > 1;
    const nextPage = page < totalPages;

    return res.status(200).json({
      status: true,
      msg: "Fetched Products Successfully",
      currentPage: page,
      totalPages,
      prevPage,
      nextPage,
      result: rows,
    });
  } catch (e) {
    console.error(`Something Went Wrong => ${e.message}`);
    return res.status(500).json({
      status: false,
      msg: `Internal Server Error: ${e.message}`,
    });
  }
};

export const getCartController = async (req, res) => {
  const uid = req.body.uid;
  try {
    const query = `SELECT * FROM products p LEFT JOIN user_products up ON p.pid=up.pid AND up.uid=$1 GROUP BY p.pid ORDER BY p.pid`;
    const { rows } = await pool.query(query, [uid]);
    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No Product Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Fetch Cart Successfully",
      result: rows,
    });
  } catch (e) {
    console.log(`Error Cart Controller Message=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const id = req.body.id;
    const query = `SELECT * from products WHERE fid=$1 ORDER BY RANDOM()`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No Data Found !!!",
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Fetch Product Successfully !!!",
      result: rows,
    });
  } catch (error) {
    console.log(`Error in product By Id=>${error.message}`);

    return res.status(500).json({
      status: false,
      msg: `Internal Server Error ${error.message}`,
    });
  }
};

export const cartController=async (req,res)=> {
  const uid=req.body.uid;
  try {
    const existUser=`SELECT * FROM users WHERE id=$1`;
    const result=await pool.query(existUser,[uid]);
    if(result.rows.length===0){
      return res.status(404).json({
        status:false,
        msg:"User doesn't exists !!!"
      });
    }
    const query=`SELECT * from products p LEFT JOIN user_product up ON p.pid=up.pid AND up.uid=$1`;
    const {rows}=await pool.query(query,[uid]);
    if(rows.length===0){
      return res.status(404).json({
        status:false,
        msg:"No Items Found !!!"
      });
    }
    return res.status(200).json({
      status:true,
      msg:"Fetch Product Successfully",
      result:rows
    });
  } catch (err) {
    console.log(`Error in cart Controller`);
    return res.status(500).json({
      status:false,
      msg:`Internal Server Error ${err.message}`
    });
  }
};

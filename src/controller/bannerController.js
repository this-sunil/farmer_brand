import pool from "../dbHelper/dbHelper.js";
// TODO: Creating Banner
const createBannerTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS banners(id SERIAL PRIMARY KEY,title TEXT NOT NULL,subtitle TEXT NOT NULL,photo TEXT NOT NULL,createdAt DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, (err) => {
    if (err) {
      console.log(`Error Creating Banner Table=>${err.message}`);
    }
    console.log("Banner Table Created Successfully");
  });
};

createBannerTable();

export const addBannerController = async (req, res) => {
  const { title, subtitle } = req.body;
  try {
    const photos = req.file ? req.file.path : "";
    if (!title || !subtitle || !photos) {
      return res.status(404).json({
        status: false,
        msg: "Missing params"
      });
    }
    const query = `INSERT INTO banners(title,subtitle,photo) VALUES($1,$2,$3) RETURNING *`;
    const { rows } = await pool.query(query, [title, subtitle, photos]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Inserted Successfully",
        result: rows[0],
      });
    }
  } catch (error) {
    console.log(`Error in Add Banner Controller=>${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

export const removeBannerController = async (req, res) => {
  const id = req.body.id;
  try {
    const query = `DELETE FROM banners WHERE id=$1`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Banner deleted Successfully !!!",
      });
    }
  } catch (err) {
    console.log(`Error in Remove Banner Controller=>${err.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const updateBannerController = async (req, res) => {
  const { id, title, desc } = req.body;
  try {
    const fields = [];
    const values = [];
    let index = 1;
    const data = { title, desc };
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key}=$${index++}`);
        value.push(values);
      }
    }
    const photo = req.file ? req.file.path : "";
    if (photo) {
      fields.push(`photo=$${index++}`);
      values.push(photo);
    }
    values.push(id);
    const query = `UPDATE banners SET ${fields.join(", ")} WHERE id=$${index}`;
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Updated Successfully !!!",
        result: rows[0]
      });
    }
  } catch (e) {
    console.log(`Error in Update Banner Controller=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

export const getBannerController=async (req,res) => {
    try {
        const query=`SELECT * FROM banners`;
        const {rows}=await pool.query(query);
        if(rows.length===0){
            return res.status(404).json({
                status:false,
                msg:"No Banners Found !!!"
            });
        }
        return res.status(200).json({
            status:true,
            msg:"Fetch Banner Successfully",
            result:rows[0]
        });
    } catch (error) {
        console.log(`Error in Banner Controller=>${error.message}`);
        return res.status(500).json({
            status:false,
            msg:"Internal Server Error"
        });
    }
};

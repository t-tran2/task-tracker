require('dotenv').config()
const Pool = require("pg").Pool;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

const getTasks = (req, res) => {
  if (!isNaN(req.params.id)) {
    pool.query("SELECT * FROM tasks WHERE user_id = '" + req.params.id + "' ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200)
      res.json(results.rows);
    });
  } else {
    res.status(500)
    res.json({
      id: req.params.id,
      message:"Invalid ID"
    });
  }
};

const updateTask = (req, res) => {
  if (!isNaN(req.params.cardID)) {
    const id = req.params.cardID;
    const title = req.body;
    const user_id = req.params.id;
    pool.query("UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3", [title, id, user_id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200)
      res.json(results.rows);
    });
  } else {
    res.status(500)
    res.json({
      id: req.params.id,
      message:"Invalid ID"
    });
  }
};

module.exports = {
  getTasks,
  updateTask
};

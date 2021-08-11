require("dotenv").config();
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
    pool.query(
      "SELECT * FROM tasks WHERE user_id = '" +
        req.params.id +
        "' ORDER BY id ASC",
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200);
        res.json(results.rows);
      }
    );
  } else {
    res.status(500);
    res.json({
      id: req.params.id,
      message: "Invalid ID",
    });
  }
};

const updateTaskTitle = (req, res) => {
  if (!isNaN(req.params.cardID)) {
    const cardID = req.params.cardID;
    const title = req.body.title;
    console.log(title);
    const user_id = req.params.id;
    pool.query(
      "UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3",
      [title, cardID, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200);
        res.json(results.rows);
      }
    );
  } else {
    res.status(500);
    res.json({
      id: req.params.id,
      message: "Invalid card ID",
    });
  }
};

const updateTaskText = (req, res) => {
  if (!isNaN(req.params.cardID)) {
    const cardID = req.params.cardID;
    const text = req.body.text;
    const user_id = req.params.id;
    pool.query(
      "UPDATE tasks SET text = $1 WHERE id = $2 AND user_id = $3",
      [text, cardID, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200);
        res.json(results.rows);
      }
    );
  } else {
    res.status(500);
    res.json({
      id: req.params.id,
      message: "Invalid card ID",
    });
  }
};

const createTask = (req, res) => {
  var status = req.params.status;
  var title = "Double-click to change task title.";
  var text = "Double-click to change task description.";
  var user_id = req.params.id;
  var query =
    "INSERT INTO tasks (status, title, text, user_id) VALUES ($1, $2, $3, $4) RETURNING id";
  pool.query(query, [status, title, text, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(results.rows);
  });
};

module.exports = {
  getTasks,
  updateTaskTitle,
  updateTaskText,
  createTask,
};

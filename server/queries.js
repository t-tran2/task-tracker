const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "task_tracker_db",
  password: "password",
  port: 5432,
});

const getTasks = (request, response) => {
  pool.query("SELECT * FROM tasks ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getTasks
};

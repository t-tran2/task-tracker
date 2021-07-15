const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

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

// Check if valid user.
function validUser(user) {
  const validEmail = typeof user.email == "string" && user.email.trim() != "";
  const validPassword =
    typeof user.password == "string" &&
    user.password.trim() != "" &&
    user.password.trim().length >= 6;
  return validEmail && validPassword;
}

// Internal functions on validating users
const getUserByEmail = (req, res, next) => {
  if (validUser(req.body)) {
    // Query for users with email given by client.
    pool.query(
      "SELECT * FROM users WHERE email = '" + req.body.email + "'",
      (error, results) => {
        if (error) {
          throw error;
        }
        // Determine if email is unique.
        if (results.rows.length === 0) {
          // Hash Password
          bcrypt.hash(req.body.password, 10).then((hash) => {
            // Post request to create entry in DB.
            pool.query(
              "INSERT INTO users (email, password, date) VALUES ($1, $2, " +
                "to_timestamp($3 / 1000.0)) RETURNING user_id",
              [req.body.email, hash, Date.now()],
              (error, results) => {
                if (error) {
                  throw error;
                }
                res.status(201).json({
                  id: results.rows[0].user_id,
                  message: "User added to DB.",
                });
              }
            );
          });
        } else {
          next(new Error("Email in use"));
        }
      }
    );
  } else {
    res.json({
      message: "invalid email or password",
    });
  }
};

module.exports = {
  getTasks,
  getUserByEmail,
};

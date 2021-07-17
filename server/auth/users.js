require("dotenv").config();
const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT5432,
});

// Check if valid user.
function validUser(user) {
  const validEmail = typeof user.email == "string" && user.email.trim() != "";
  const validPassword =
    typeof user.password == "string" &&
    user.password.trim() != "" &&
    user.password.trim().length >= 6;
  return validEmail && validPassword;
}

function setUserIdCookie(req, res, id) {
  res.cookie("user_id", id, {
    httpOnly: true,
    signed: true,
    secure: true,
  });
}

// Internal functions on validating users
const createUser = (req, res, next) => {
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
                setUserIdCookie(req, res, results.rows[0].user_id);
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
    next(new Error("invalid email or password"));
  }
};

const loginUser = (req, res, next) => {
  if (validUser(req.body)) {
    pool.query(
      "SELECT * FROM users WHERE email = '" + req.body.email + "'",
      (error, results) => {
        if (error) {
          throw error;
        }
        // Determine if email is unique.
        if (results.rows.length !== 0) {
          // compare password with hashed password
          bcrypt
            .compare(req.body.password, results.rows[0].password)
            .then((result) => {
              var userId = results.rows[0].user_id;
              if (result) {
                setUserIdCookie(req, res, userId);
                res.json({
                  id: userId,
                  message: "logged in",
                });
              } else {
                next(new Error("Incorrect password."));
              }
            });
        } else {
          next(new Error("Email not found."));
        }
      }
    );
  } else {
    next(new Error("invalid email or password"));
  }
};

const getUser = (req, res) => {
  if (!isNaN(req.params.id)) {
    pool.query(
      "SELECT * FROM users WHERE user_id = '" + req.params.id + "'",
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length === 1) {
          var userData = results.rows[0];
          delete userData.password;
          res.json(userData);
        } else {
          res.status(404);
          res.json({
            message: "User Not Found.",
          });
        }
      }
    );
  } else {
    res.status(500);
    res.json({
      message: "Invalid ID",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
};

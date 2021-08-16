const express = require("express");
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
var cors = require("cors");
var cookieParser = require('cookie-parser');
const app = express();
const db = require("./queries");
const port = 3000;
const auth = require("./auth/index");
var authMiddleware = require('./auth/middleware');
const users = require("./auth/users");

// Initialize Firebase SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Encrypt cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));



// Routers
app.use("/auth", auth);

// Routes
app.get("/user/:id", users.getUser);

app.get("/tasks/:id", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.getTasks);

// Create task cards.
app.post("/tasks/create/:id/:status", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.createTask);

// Update task cards.
app.put("/tasks/title-update/:id/:cardID", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.updateTaskTitle);
app.put("/tasks/text-update/:id/:cardID", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.updateTaskText);

// Switch ordering of cards.
app.put("/tasks/placeholder-id/:id", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.toPlaceHolderID);
app.put("/tasks/switch-curr-id/:id", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.switchCurrCardID);
app.put("/tasks/switch-other-id/:id", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.switchOtherCardID);
app.put("/tasks/change-status/:id", authMiddleware.ensureLoggedIn, authMiddleware.allowAccess, db.changeStatus);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

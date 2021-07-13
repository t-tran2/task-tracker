const express = require('express');
const bodyParser = require('body-parser');
var admin = require('firebase-admin');
var cors = require('cors');
const app = express();
const db = require('./queries');
const port = 3000;
const auth = require('./auth/index');

// Initialize Firebase SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Routers
app.use('/auth', auth);

// Routes
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.get('/tasks', db.getTasks);

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message
  })
})

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})
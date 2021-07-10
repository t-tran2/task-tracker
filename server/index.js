const express = require('express');
const bodyParser = require('body-parser');
var admin = require('firebase-admin');
var cors = require('cors');
const app = express();
const db = require('./queries');
const port = 3000;

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

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.get('/tasks', db.getTasks);

app.post('/auth', db.auth);

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})
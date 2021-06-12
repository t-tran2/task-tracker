const express = require("express");
const app = express();

// first argument is the endpoint
app.get('/', (req, res) => {

})

// Message to indicate backend server is live.
app.listen(3000, () => console.log('Server live and listening on port 3000.'));
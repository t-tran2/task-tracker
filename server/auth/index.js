const express = require('express');
const router = express.Router();
const User = require('./users');

// Route paths are prepended with '/auth'
router.get('/', (req,res) => {
    res.json({
        message: 'auth'
    });
});

// Sign up
router.post('/signup', User.getUserByEmail);

module.exports = router;
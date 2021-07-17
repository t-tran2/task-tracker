const express = require('express');
const router = express.Router();
const User = require('./users');

// Route paths are prepended with '/auth'
router.get('/', (req,res) => {
    res.json({
        message: 'auth'
    });
});

router.post('/signup', User.createUser);

router.post('/login', User.loginUser);

router.get('/logout', (req,res) => {
    res.clearCookie('user_id');
    res.json({
        message: 'Logged out'
    })
});

module.exports = router;
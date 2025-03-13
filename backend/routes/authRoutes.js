// routes/authRoutes.js
const express = require('express');
const { register, login, getUserName, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/username',auth, getUserName);
router.put("/update-profile", auth, updateProfile);

module.exports = router;
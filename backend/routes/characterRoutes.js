// backend/routes/characterRoutes.js
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// Define routes
router.get('/random', characterController.getRandomCharacter);
router.post('/guess', characterController.checkGuess);

module.exports = router;
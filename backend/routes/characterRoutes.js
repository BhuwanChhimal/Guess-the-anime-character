// backend/routes/characterRoutes.js
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// Define routes

//get a random character
router.get('/random', characterController.getRandomCharacter);

//check the guess
router.post('/guess', characterController.checkGuess);

//search for a character by name
router.get('/search', characterController.searchCharacter);

module.exports = router;
// backend/routes/characterRoutes.js
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const {updateCharactersWithImages} = require('../controllers/characterController');
// Define routes

//get a random character
router.get('/random', characterController.getRandomCharacter);

//check the guess
router.post('/guess', characterController.checkGuess);

//search for a character by name
router.get('/search', characterController.searchCharacter);

// Update the route to support both name and MAL ID
router.get('/character-image/:identifier', characterController.fetchCharacterImage);

router.get('/update-images', async (req, res) => {
    try {
      const updatedCharacters = await updateCharactersWithImages();
      res.json(updatedCharacters);
    } catch (error) {
      console.error('Error in route handler:', error);
      res.status(500).json({ error: 'Failed to update character images' });
    }
  });

module.exports = router;
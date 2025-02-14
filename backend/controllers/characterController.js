// backend/controllers/characterController.js
const axios = require('axios');

const getRandomCharacter = async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 1000) + 1; // Random ID between 1 and 1000
    const response = await axios.get(`https://api.jikan.moe/v4/characters/${randomId}/full`);
    const character = response.data.data;
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch character' });
  }
};

const checkGuess = async (req, res) => {
  const { guess, correctCharacter } = req.body;
  // Add logic to compare guess with correctCharacter
  res.json({ message: 'Guess checked successfully' });
};

module.exports = { getRandomCharacter, checkGuess };
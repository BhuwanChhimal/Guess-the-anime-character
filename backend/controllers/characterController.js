const axios = require('axios');

const getRandomCharacter = async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const response = await axios.get(`https://api.jikan.moe/v4/characters/${randomId}/full`);
    const characterData = response.data.data;
    
    // Transform the API response to match frontend expectations
    const character = {
      id: characterData.mal_id,
      name: characterData.name,
      animeName: characterData.anime?.[0]?.anime?.title || 'Unknown',
      gender: characterData.gender || 'Unknown',
      hairColor: characterData.hair_color || 'Unknown',
      powerType: 'Unknown', // These fields aren't available in Jikan API
      weaponType: 'Unknown', // You might need to maintain your own database
      role: 'Unknown',      // for these additional character attributes
      species: 'Unknown'
    };
    
    res.json(character);
  } catch (error) {
    console.error('Error fetching random character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
};

const searchCharacter = async (req, res) => {
  const { name } = req.query;

  try {
    const response = await axios.get(`https://api.jikan.moe/v4/characters?q=${name}`);
    const characters = response.data.data.map(char => ({
      mal_id: char.mal_id,
      name: char.name,
      anime: char.anime?.[0]?.anime?.title || 'Unknown'
    }));

    if (characters.length === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(characters);
  } catch (error) {
    console.error("Error searching the character", error);
    res.status(500).json({ error: 'Failed to search character' });
  }
};

const checkGuess = async (req, res) => {
  const { guessedCharacterId, correctCharacter } = req.body;

  try {
    const response = await axios.get(`https://api.jikan.moe/v4/characters/${guessedCharacterId}/full`);
    const guessedCharacterData = response.data.data;

    // Transform the guessed character data to match the format
    const guessedCharacter = {
      id: guessedCharacterData.mal_id,
      name: guessedCharacterData.name,
      animeName: guessedCharacterData.anime?.[0]?.anime?.title || 'Unknown',
      gender: guessedCharacterData.gender || 'Unknown',
      hairColor: guessedCharacterData.hair_color || 'Unknown',
      powerType: 'Unknown',
      weaponType: 'Unknown',
      role: 'Unknown',
      species: 'Unknown'
    };

    // Compare attributes
    const feedback = {
      animeName: correctCharacter.animeName === guessedCharacter.animeName,
      gender: correctCharacter.gender === guessedCharacter.gender,
      hairColor: correctCharacter.hairColor === guessedCharacter.hairColor,
      powerType: correctCharacter.powerType === guessedCharacter.powerType,
      weaponType: correctCharacter.weaponType === guessedCharacter.weaponType,
      role: correctCharacter.role === guessedCharacter.role,
      species: correctCharacter.species === guessedCharacter.species
    };

    res.json({ feedback, guessedCharacter });
  } catch (error) {
    console.error('Error checking guess:', error);
    res.status(500).json({ error: 'Failed to check guess' });
  }
};

module.exports = { getRandomCharacter, searchCharacter, checkGuess };
const axios = require('axios');
// const path= require('path');

const {characterDetails} = require('../services/utils')
const getRandomCharacter = async (req, res) => {
  try {
    // Get random index from the characterDetails array
    const randomIndex = Math.floor(Math.random() * characterDetails.length);
    const character = characterDetails[randomIndex];
    
    // Return the character in the same format as before
    res.json({
      id: character.id,
      name: character.character_name,
      animeName: character.anime_name || 'Unknown',
      hairColor: character.hair_color || 'Unknown',
      powerType: character.power_type || 'Unknown',
      weaponType: character.weapon_type || 'Unknown',
      role: character.role || 'Unknown',
    });
  } catch (error) {
    console.error('Error getting random character:', error);
    res.status(500).json({ error: 'Failed to get character' });
  }
};

const searchCharacter = async (req, res) => {
  try {
    const searchTerm = req.query.name?.toLowerCase();
    
    // Search through characterDetails array
    const matchingCharacters = characterDetails.filter(character => 
      character.character_name?.toLowerCase().includes(searchTerm)
    );
    
    if (matchingCharacters.length === 0) {
      return res.status(404).json({ error: 'No characters found' });
    }
    
    // Return all matching characters with consistent format
    const formattedCharacters = matchingCharacters.map(character => ({
      id: character.id,
      name: character.character_name,
      animeName: character.anime_name || 'Unknown',
      hairColor: character.hair_color || 'Unknown',
      powerType: character.power_type || 'Unknown',
      weaponType: character.weapon_type || 'Unknown',
      role: character.role || 'Unknown',
    }));
    
    res.json(formattedCharacters);
  } catch (error) {
    console.error('Error searching characters:', error);
    res.status(500).json({ error: 'Failed to search characters' });
  }
};

const checkGuess = async (req, res) => {
  const { guessedCharacterName, correctCharacter } = req.body;

  try {
    // Find the guessed character from local dataset by name
    const guessedCharacter = characterDetails.find(
      character => character.character_name?.toLowerCase() === guessedCharacterName?.toLowerCase()
    );

    if (!guessedCharacter) {
      return res.status(404).json({ error: 'Guessed character not found' });
    }

    // Compare attributes
    const feedback = {
      animeName: correctCharacter.animeName?.toLowerCase() === guessedCharacter.anime_name?.toLowerCase(),
      // gender: correctCharacter.gender?.toLowerCase() === guessedCharacter.gender?.toLowerCase(),
      hairColor: correctCharacter.hairColor?.toLowerCase() === guessedCharacter.hair_color?.toLowerCase(),
      powerType: correctCharacter.powerType?.toLowerCase() === guessedCharacter.power_type?.toLowerCase(),
      weaponType: correctCharacter.weaponType?.toLowerCase() === guessedCharacter.weapon_type?.toLowerCase(),
      role: correctCharacter.role?.toLowerCase() === guessedCharacter.role?.toLowerCase(),
      // species: correctCharacter.species?.toLowerCase() === guessedCharacter.species?.toLowerCase()
    };

    res.json({ feedback });
  } catch (error) {
    console.error('Error checking guess:', error);
    res.status(500).json({ error: 'Failed to check guess' });
  }
};

const fetchCharacterImage = async (characterName) => {
  try {
    // Search for the character by name
    const response = await axios.get(`https://api.jikan.moe/v4/characters?q=${characterName}`);
    const characters = response.data.data;

    if (characters.length > 0) {
      // Return the image URL of the first matching character
      return characters[0].images.jpg.image_url;
    } else {
      return null; // No character found
    }
  } catch (error) {
    console.error('Error fetching character image:', error);
    throw new Error('Failed to fetch character image');
  }
};


const updateCharactersWithImages = async () => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const updatedCharacters = [...characterDetails]; // Create a copy of existing data
  
  // Filter for characters without images
  const charactersNeedingUpdate = characterDetails.filter(char => !char.image_url);
  
  for (const character of charactersNeedingUpdate) {
    try {
      await delay(1000); // Rate limiting
      const imageUrl = await fetchCharacterImage(character.character_name);
      
      // Find and update only this character in our copy
      const index = updatedCharacters.findIndex(
        char => char.character_name === character.character_name
      );
      if (index !== -1) {
        updatedCharacters[index] = {
          ...updatedCharacters[index],
          image_url: imageUrl || null
        };
      }
      console.log(`Updated ${character.character_name} with image`);
    } catch (error) {
      console.error(`Failed to update ${character.character_name}:`, error);
    }
  }

  return updatedCharacters;
};



module.exports = { getRandomCharacter, searchCharacter, checkGuess , fetchCharacterImage, updateCharactersWithImages};
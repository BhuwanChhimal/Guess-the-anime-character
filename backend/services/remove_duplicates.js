const { characterDetails } = require('./utils.js');
const uniqueCharactersMap = new Map();

characterDetails.forEach(character => {
    if (!uniqueCharactersMap.has(character.character_name)) {
        uniqueCharactersMap.set(character.character_name, character);
    }
});

const uniqueCharacters = Array.from(uniqueCharactersMap.values());

// Custom stringification to remove quotes from keys
function stringifyWithoutQuotes(obj, indent = 2) {
    if (Array.isArray(obj)) {
        const items = obj.map(item => stringifyWithoutQuotes(item, indent)).join(',\n');
        return `[\n${items}\n]`;
    }
    
    if (typeof obj === 'object' && obj !== null) {
        const items = Object.entries(obj)
            .map(([key, value]) => {
                const valueStr = typeof value === 'string' ? `"${value}"` : value;
                return `${' '.repeat(indent)}${key}: ${valueStr}`;
            })
            .join(',\n');
        return `{\n${items}\n}`;
    }
    
    return JSON.stringify(obj);
}

const outputString = `module.exports = {
  characterDetails: ${stringifyWithoutQuotes(uniqueCharacters)}
}`;

const fs = require('fs');
fs.writeFileSync('unique_characters.js', outputString);

console.log(`Original count: ${characterDetails.length}`);
console.log(`New count: ${uniqueCharacters.length}`);
console.log('Successfully removed duplicates! Check unique_characters.js');
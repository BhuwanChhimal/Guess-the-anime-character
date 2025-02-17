import axios from "axios";
import React, { useEffect, useState } from "react";

interface Character {
  mal_id: number;
  name: string;
  anime: string;
}

interface CorrectCharacter {
  id: number;
  name: string;
  animeName: string;
  hairColor: string;
  powerType: string;
  weaponType: string;
  role: string;
}

interface Feedback {
  animeName: boolean;
  hairColor: boolean;
  powerType: boolean;
  weaponType: boolean;
  role: boolean;
}

axios.defaults.baseURL = "http://localhost:5002";

const Main: React.FC = () => {
  const [guess, setGuess] = useState<string>("");
  const [correctCharacter, setCorrectCharacter] =
    useState<CorrectCharacter | null>(null);
  const [matchingCharacters, setMatchingCharacters] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleStartPlay = async (): Promise<void> => {
    try {
      const res = await axios.get<CorrectCharacter>("/api/characters/random"); // Restored /api prefix
      // Transform the response data to match the CorrectCharacter interface
      const transformedCharacter: CorrectCharacter = {
        id: res.data.id,
        name: res.data.name,
        animeName: res.data.animeName || "Unknown",
        hairColor: res.data.hairColor || "Unknown",
        powerType: res.data.powerType || "Unknown",
        weaponType: res.data.weaponType || "Unknown",
        role: res.data.role || "Unknown",
      };
      setCorrectCharacter(transformedCharacter);
      setFeedback(null);
      console.log("Fetched character:", transformedCharacter);
    } catch (error) {
      console.error("Failed to fetch random character:", error);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const value = e.target.value;
    setGuess(value);

    if (value.trim() === "") {
      setMatchingCharacters([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await axios.get<Character[]>(
        `/api/characters/search?name=${value}`
      ); // Restored /api prefix
      setMatchingCharacters(res.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to search characters:", error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!correctCharacter) {
      alert('Please start the game by clicking "Play" first.');
      return;
    }

    try {
      const res = await axios.post<{ feedback: Feedback }>(
        "/api/characters/guess",
        {
          // Restored /api prefix
          guessedCharacterName: guess,
          correctCharacter,
        }
      );
      setFeedback(res.data.feedback);
      console.log("Guess sent:", guess);
      console.log("Feedback received:", res.data.feedback);
    } catch (error) {
      console.error("Failed to check guess:", error);
    }
  };

  const handleCharacterSelect = (character: Character): void => {
    setGuess(character.name);
    setMatchingCharacters([]);
    setShowDropdown(false);
  };

  return (
    <div className="w-full h-[45rem] max-w-4xl bg-[#d9d9d9] rounded-lg p-8 shadow-2xl font-audiowide">
      {/* Title Section */}
      <div className="bg-black text-white py-4 rounded-2xl mb-6">
        <h1 className="text-center text-xl">GUESS THE ANIME CHARACTER</h1>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-sm">
          Hit play to get a random anime character and try to guess that
          character
        </p>
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-8">
        <button
          className="bg-white px-8 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow"
          onClick={handleStartPlay}
        >
          Play
        </button>
      </div>

      {/* Guess Input Section */}
      <div className="mb-8">
        <p className="mb-2">Enter your guess:</p>

        <form onSubmit={handleSubmit} className="flex gap-4 relative">
          <input
            type="text"
            value={guess}
            onChange={handleInputChange}
            placeholder="Enter any anime character..."
            className="flex-1 outline-0 px-4 py-2 rounded-md bg-white text-sm"
          />
          <button
            type="submit"
            className="bg-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            Enter
          </button>

          {/* Dropdown for matching characters */}
          {showDropdown && matchingCharacters.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-md shadow-lg z-10">
              {matchingCharacters.map((character) => (
                <div
                  key={character.mal_id}
                  onClick={() => handleCharacterSelect(character)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {character.name} {character.anime}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Results Table */}
      <div>
        <section className="flex items-center gap-2">
        <p className="font-mono mb-2">Your guess:</p>
          <p className="text-sm mb-2">{guess}</p>
        </section>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-gray-200 text-center text-sm">
            <div className="p-3">Anime Name</div>
            <div className="p-3">Hair Color</div>
            <div className="p-3">Power Type</div>
            <div className="p-3">Weapon</div>
            <div className="p-3">Role</div>
          </div>

          {/* Display feedback */}
          {feedback && (
            <div className="grid grid-cols-5 divide-x divide-gray-200 text-center text-sm">
              <div className="p-3">{feedback.animeName ? "✅" : "❌"}</div>
              <div className="p-3">{feedback.hairColor ? "✅" : "❌"}</div>
              <div className="p-3">{feedback.powerType ? "✅" : "❌"}</div>
              <div className="p-3">{feedback.weaponType ? "✅" : "❌"}</div>
              <div className="p-3">{feedback.role ? "✅" : "❌"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;

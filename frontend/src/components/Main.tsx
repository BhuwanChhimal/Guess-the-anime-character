import axios from "axios";
import React, { useState } from "react";
import {
  Play,
  Search,
  Zap,
  Award,
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  X,
  PartyPopper,
} from "lucide-react";
interface Character {
  mal_id: number;
  name: string;
  animeName: string;
}
import smallLuffy from "../assets/smolLuffy.png";
import smallNaruto from "../assets/smolNaruto.png";
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

interface FeedbackEntry {
  feedback: Feedback;
  guessedName: string;
  timestamp: number;
}

interface MainProps {
  onFeedbackUpdate: (
    feedback: Feedback,
    character: CorrectCharacter,
    cumulative: Feedback
  ) => void;
}

interface HintState {
  isVisible: boolean;
  hint: string | null;
}

axios.defaults.baseURL = "http://localhost:5002";

const Main: React.FC<MainProps> = ({ onFeedbackUpdate }) => {
  const [guess, setGuess] = useState<string>("");
  const [correctCharacter, setCorrectCharacter] =
    useState<CorrectCharacter | null>(null);
  const [matchingCharacters, setMatchingCharacters] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStartAnimation, setGameStartAnimation] = useState<boolean>(false);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([]);
  const [hintState, setHintState] = useState<HintState>({
    isVisible: false,
    hint: null,
  });
  const [playButtonText, setPlayButtonText] = useState<string>("PLAY");
  const [showGameStartMessage, setShowGameStartMessage] =
    useState<boolean>(false);
  const [isCharacterGuessed, setIsCharacterGuessed] = useState<boolean>(false);
  const [isCharacterGuessedCorrectly, setIsCharacterGuessedCorrectly] =
    useState<boolean>(false);
  const [cumulativeCorrect, setCumulativeCorrect] = useState<Feedback>({
    animeName: false,
    hairColor: false,
    powerType: false,
    weaponType: false,
    role: false,
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hintpresscount, setHintpresscount] = useState<number>(5)
  // Add this function to track cumulative correct guesses
  const updateCumulativeCorrect = (newFeedback: Feedback) => {
    setCumulativeCorrect((prev) => ({
      animeName: prev.animeName || newFeedback.animeName,
      hairColor: prev.hairColor || newFeedback.hairColor,
      powerType: prev.powerType || newFeedback.powerType,
      weaponType: prev.weaponType || newFeedback.weaponType,
      role: prev.role || newFeedback.role,
    }));
  };

  const generateHint = () => {
    if (!feedback || !correctCharacter) return null;

    // Get all criteria that have never been correct
    const incorrectCriteria = Object.entries(cumulativeCorrect)
      .filter(([_, isCorrect]) => !isCorrect)
      .map(([key]) => key);

    if (incorrectCriteria.length === 0) return null;

    // Randomly select one incorrect criterion
    const randomCriterion =
      incorrectCriteria[Math.floor(Math.random() * incorrectCriteria.length)];

    // Generate hint message based on the criterion
    const hints: { [key: string]: string } = {
      animeName: `The character is from ${correctCharacter.animeName}...`,
      hairColor: `The character has ${correctCharacter.hairColor} hair...`,
      powerType: `The character's power type is ${correctCharacter.powerType}...`,
      weaponType: `The character's weapon is ${correctCharacter.weaponType}...`,
      role: `The character's role is ${correctCharacter.role}...`,
    };

    return hints[randomCriterion];
  };

  const toggleHint = () => {
    setHintpresscount(hintpresscount+1)
    if (!hintState.isVisible || !hintState.hint) {
      const newHint = generateHint();
      setHintState({ isVisible: true, hint: newHint });
    } else {
      setHintState({ ...hintState, isVisible: false });
    }
  };

  const handleStartPlay = async (): Promise<void> => {
    // Reset all game states
    setHintState({ isVisible: false, hint: null });
    setIsLoading(true);
    setGameStartAnimation(true);
    setFeedbackHistory([]);
    setPlayButtonText("LOADING...");
    setIsCharacterGuessed(false);
    setIsCharacterGuessedCorrectly(false);
    setCumulativeCorrect({
      animeName: false,
      hairColor: false,
      powerType: false,
      weaponType: false,
      role: false,
    });

    try {
      const res = await axios.get<CorrectCharacter>("/api/characters/random");
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
      // Call onFeedbackUpdate with null feedback for initial state
      onFeedbackUpdate(null, transformedCharacter, {
        animeName: false,
        hairColor: false,
        powerType: false,
        weaponType: false,
        role: false,
      });
      setFeedback(null);
      setGuess("");
      setAttempts(0);
      setIsPlaying(true);
      setPlayButtonText("QUIT GAME");
      setShowGameStartMessage(true);
      console.log("Fetched and set character:", transformedCharacter);
    } catch (error) {
      console.error("Failed to fetch random character:", error);
      setPlayButtonText("PLAY");
    } finally {
      setIsLoading(false);
      setTimeout(() => setGameStartAnimation(false), 500);
    }
  };

  const handleQuit = () => {
    window.location.reload();
  };
  
  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const value = e.target.value;
    setGuess(value);
    setSelectedIndex(-1); // Reset selection when typing

    if (value.trim() === "") {
      setMatchingCharacters([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await axios.get<Character[]>(
        `/api/characters/search?name=${value}`
      );
      setMatchingCharacters(res.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to search characters:", error);
    }
  };

  // Add this function to check if all feedback is correct
  const isAllCorrect = (feedbackObj: Feedback) => {
    return Object.values(feedbackObj).every((value) => value === true);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setHintpresscount(hintpresscount -1)
    if (!correctCharacter) {
      alert('Please start the game by clicking "Play" first.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post<{
        feedback: Feedback;
        isExactMatch: boolean;
      }>("/api/characters/guess", {
        guessedCharacterName: guess,
        correctCharacter,
      });

      // Update cumulative correct guesses
      updateCumulativeCorrect(res.data.feedback);

      // Create new feedback entry
      const newFeedbackEntry: FeedbackEntry = {
        feedback: res.data.feedback,
        guessedName: guess,
        timestamp: Date.now(),
      };

      // Update feedback history
      setFeedbackHistory((prev) => [newFeedbackEntry, ...prev]);
      setFeedback(res.data.feedback);
      setAttempts((prev) => prev + 1);

      // Check if all feedback is correct AND it's the exact character match
      const isAllCorrectGuess = isAllCorrect(res.data.feedback) && res.data.isExactMatch;
      setIsCharacterGuessedCorrectly(isAllCorrectGuess);
      setIsCharacterGuessed(isAllCorrectGuess);

      // Keep the game in playing state even after correct guess
      if (isAllCorrectGuess) {
        setPlayButtonText("PLAY AGAIN");
      }

      if (correctCharacter) {
        handleFeedback(res.data.feedback, correctCharacter);
      }
    } catch (error) {
      console.error("Failed to check guess:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterSelect = (character: Character): void => {
    setGuess(character.name);
    setMatchingCharacters([]);
    setShowDropdown(false);
  };

  // Calculate correct guesses
  const getCorrectCount = () => {
    if (!feedback) return 0;
    return Object.values(feedback).filter((value) => value === true).length;
  };

  // Add this logging before calling onFeedbackUpdate
  const handleFeedback = (feedback: Feedback, character: CorrectCharacter) => {
    // Update cumulative correct before sending
    const newCumulative = {
      animeName: cumulativeCorrect.animeName || feedback.animeName,
      hairColor: cumulativeCorrect.hairColor || feedback.hairColor,
      powerType: cumulativeCorrect.powerType || feedback.powerType,
      weaponType: cumulativeCorrect.weaponType || feedback.weaponType,
      role: cumulativeCorrect.role || feedback.role,
    };

    setCumulativeCorrect(newCumulative);
    onFeedbackUpdate(feedback, character, newCumulative);
  };

  // Add new handler for keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || matchingCharacters.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < matchingCharacters.length - 1 ? prev + 1 : prev
        );
        if (selectedIndex + 1 < matchingCharacters.length) {
          setGuess(matchingCharacters[selectedIndex + 1].name);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        if (selectedIndex > 0) {
          setGuess(matchingCharacters[selectedIndex - 1].name);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleCharacterSelect(matchingCharacters[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };
  // console.log(hintpresscount)
  return (
    <div className="h-full font-audiowide flex flex-col bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
      {/* Title Section */}
      <div className="bg-gray-900 text-white py-3 sm:py-4 px-4 border-b border-purple-700 shrink-0">
        <h1 className="text-center text-lg sm:text-xl font-bold tracking-widest relative">
          <span className="absolute inset-0 flex items-center justify-center blur-sm text-purple-400">
            GUESS THE ANIME CHARACTER
          </span>
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            GUESS THE ANIME CHARACTER
          </span>
        </h1>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Success Message */}
          {isCharacterGuessed && (
            <div className="animate-fadeIn bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-500 text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <PartyPopper className="animate-bounce" size={24} />
                <span className="font-bold text-lg">Congratulations!</span>
                <PartyPopper className="animate-bounce" size={24} />
              </div>
              <p className="text-green-300 mt-2">
                You've successfully guessed the character in {attempts}{" "}
                attempts!
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-sm text-purple-200">
              {!isPlaying
                ? "Hit play to get a random anime character and try to guess that character"
                : "A character has been selected! How quickly can you guess it?"}
            </p>
          </div>

          {/* Play/Quit Button */}
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 ">
            <button
              className={`group cursor-pointer relative px-8 py-3 rounded-full overflow-hidden ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : isCharacterGuessed
                  ? "bg-green-600 hover:bg-green-700"
                  : isPlaying
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105"
              } transition-all duration-300`}
              onClick={
                isPlaying && !isCharacterGuessed
                  ? handleQuit
                  : !isLoading
                  ? handleStartPlay
                  : undefined
              }
              disabled={isLoading}
            >
              <div className="absolute inset-0 w-full h-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-center relative">
                {isLoading ? (
                  <RotateCcw className="animate-spin mr-2" size={18} />
                ) : isCharacterGuessed ? (
                  <Play className="mr-2" size={18} />
                ) : isPlaying ? (
                  <X className="mr-2" size={18} />
                ) : (
                  <Play className="mr-2" size={18} />
                )}
                <span className="font-bold">{playButtonText}</span>
              </div>
            </button>
            {showGameStartMessage && isPlaying && !isCharacterGuessed && (
              <p className="text-sm text-purple-300 animate-fadeIn">
                🎮 Game Started! Take your best guess!
              </p>
            )}
          </div>
          <img src={smallLuffy} className="w-24 aspect-auto absolute top-10 -left-8 rotate-45 hidden md:block" alt="" />
          <img src={smallNaruto} className="w-24 aspect-auto absolute top-35 -right-8 -rotate-45 hidden md:block" alt="" />
          {/* Guess Input Section */}
          <div className="mb-6">
            <p className="mb-2 text-purple-200 font-semibold">
              Enter your guess:
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 relative"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-purple-400" size={18} />
                </div>
                <input
                  type="text"
                  value={guess}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter any anime character..."
                  className="w-full outline-0 pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-purple-600 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={
                    isLoading || !isPlaying || isCharacterGuessedCorrectly
                  }
                />
                {showDropdown && matchingCharacters.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-gray-800 rounded-md shadow-lg z-50 mt-1 border border-purple-600 max-h-48 overflow-y-auto">
                    {matchingCharacters.map((character, index) => (
                      <div
                        key={character.mal_id}
                        onClick={() => handleCharacterSelect(character)}
                        className={`p-3 cursor-pointer border-b border-purple-700 border-opacity-30 text-white ${
                          index === selectedIndex
                            ? "bg-purple-900 bg-opacity-50"
                            : "hover:bg-purple-900"
                        }`}
                      >
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs font-extralight text-gray-400 ml-4">
                          from {character.animeName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg font-bold w-full sm:w-auto ${
                  isLoading || !isPlaying
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white shadow-md hover:shadow-lg transition-all`}
                disabled={
                  isLoading || !isPlaying || isCharacterGuessedCorrectly
                }
              >
                {isLoading ? (
                  <RotateCcw className="animate-spin" size={18} />
                ) : (
                  "GUESS"
                )}
              </button>
            </form>
          </div>

          {/* Game Status and Hint Section */}
          {isPlaying && (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center">
                  <Zap className="text-yellow-400 mr-2" size={16} />
                  <span className="text-purple-200 text-sm">
                    {attempts} Attempts
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Award className="text-purple-400 mr-2" size={16} />
                    <span className="text-purple-200 text-sm">
                      {feedback
                        ? `${getCorrectCount()}/5 Correct`
                        : "No guesses yet"}
                    </span>
                  </div>
                  <button
                    onClick={toggleHint}
                    disabled={attempts < 5 || !feedback || hintpresscount > 5}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      attempts >= 5 && feedback
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    } transition-all duration-300`}
                  >
                    <HelpCircle size={16} />
                    {attempts < 5
                      ? `Hint (${5 - attempts} more guesses)`
                      : "Hint"}
                  </button>
                </div>
              </div>

              {/* Hint Display */}
              {hintState.isVisible && hintState.hint && (
                <div className="animate-fadeIn bg-purple-900 bg-opacity-20 border border-purple-500 rounded-lg p-3">
                  <p className="text-purple-200 text-sm flex items-center">
                    <HelpCircle className="mr-2" size={16} />
                    {hintState.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          <div className="relative"></div>
          {/* Column Headers - Sticky */}
          <div className="bg-purple-900 bg-opacity-50 sticky top-0 z-10 grid grid-cols-5 divide-x divide-purple-700 text-center text-xs sm:text-sm font-semibold rounded-t-lg">
            <div className="p-3 text-purple-200">Anime Name</div>
            <div className="p-3 text-purple-200">Hair Color</div>
            <div className="p-3 text-purple-200">Power Type</div>
            <div className="p-3 text-purple-200">Weapon</div>
            <div className="p-3 text-purple-200">Role</div>
          </div>

          {/* Feedback History */}
          <div className="max-h-[40vh] overflow-y-auto scrollbar-hide">
            {feedbackHistory.map((entry, index) => (
              <div
                key={entry.timestamp}
                className={`bg-gray-900 rounded-lg overflow-hidden border border-purple-700 shadow-md mb-3 ${
                  index === 0 ? "animate-slideDown" : ""
                }`}
              >
                <div className="px-4 py-2 bg-gray-800 border-b border-purple-700">
                  <p className="text-sm text-purple-200">
                    Guess #{feedbackHistory.length - index}: {entry.guessedName}
                  </p>
                </div>
                <div className="grid grid-cols-5 divide-x divide-purple-700 text-center text-xs sm:text-sm">
                  {Object.entries(entry.feedback).map(([key, isCorrect]) => (
                    <div
                      key={key}
                      className={`p-4 ${
                        isCorrect
                          ? "bg-green-900 bg-opacity-30"
                          : "bg-red-900 bg-opacity-20"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle
                          className="mx-auto text-green-400"
                          size={24}
                        />
                      ) : (
                        <XCircle className="mx-auto text-red-400" size={24} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="bg-gray-900 text-center p-2 sm:p-3 text-purple-400 text-xs border-t border-purple-700 shrink-0">
        Can you guess the anime character? Test your knowledge! | Attempts:{" "}
        {attempts}
      </div>
    </div>
  );
};

export default Main;

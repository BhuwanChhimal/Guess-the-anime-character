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
    <div className="relative h-full flex flex-col surface rounded-2xl overflow-hidden">
      {/* Title Section */}
      <div className="py-3 sm:py-4 px-4 border-b border-white/10 shrink-0">
        <h1 className="font-display text-center text-base sm:text-xl font-bold tracking-wider text-gradient">
          GUESS THE ANIME CHARACTER
        </h1>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Success Message */}
          {isCharacterGuessed && (
            <div className="animate-fadeIn bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30 text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <PartyPopper className="animate-bounce" size={22} />
                <span className="font-display font-bold text-lg">
                  Congratulations!
                </span>
                <PartyPopper className="animate-bounce" size={22} />
              </div>
              <p className="text-emerald-200/80 mt-1.5 text-sm">
                You guessed the character in {attempts} attempts!
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-sm text-slate-400">
              {!isPlaying
                ? "Hit play to get a random anime character, then try to guess who it is."
                : "A character has been selected — how quickly can you guess it?"}
            </p>
          </div>

          {/* Play/Quit Button */}
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 ">
            <button
              className={`font-display group cursor-pointer relative px-8 py-3 rounded-full overflow-hidden text-white transition-all duration-200 ${
                isLoading
                  ? "bg-slate-600 cursor-not-allowed"
                  : isCharacterGuessed
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
                  : isPlaying
                  ? "bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/20"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25"
              }`}
              onClick={
                isPlaying && !isCharacterGuessed
                  ? handleQuit
                  : !isLoading
                  ? handleStartPlay
                  : undefined
              }
              disabled={isLoading}
            >
              <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
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
              <p className="text-sm text-violet-300 animate-fadeIn">
                🎮 Game Started! Take your best guess!
              </p>
            )}
          </div>
          <img src={smallLuffy} aria-hidden="true" className="w-20 absolute top-10 -left-6 rotate-45 hidden md:block opacity-80 pointer-events-none select-none" alt="" />
          <img src={smallNaruto} aria-hidden="true" className="w-20 absolute top-32 -right-6 -rotate-45 hidden md:block opacity-80 pointer-events-none select-none" alt="" />
          {/* Guess Input Section */}
          <div className="mb-6">
            <label
              htmlFor="guess-input"
              className="mb-2 block text-slate-300 text-sm font-medium"
            >
              Enter your guess
            </label>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 relative"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-slate-400" size={18} />
                </div>
                <input
                  id="guess-input"
                  type="text"
                  value={guess}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter any anime character..."
                  autoComplete="off"
                  className="input-field pl-10 pr-4 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    isLoading || !isPlaying || isCharacterGuessedCorrectly
                  }
                />
                {showDropdown && matchingCharacters.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-[#14141d] rounded-xl shadow-xl z-50 mt-2 border border-white/10 max-h-56 overflow-y-auto scrollbar-thin">
                    {matchingCharacters.map((character, index) => (
                      <div
                        key={character.mal_id}
                        onClick={() => handleCharacterSelect(character)}
                        className={`px-3 py-2.5 cursor-pointer border-b border-white/5 last:border-none transition-colors ${
                          index === selectedIndex
                            ? "bg-violet-600/25"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="font-medium text-slate-100 text-sm">
                          {character.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          from {character.animeName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`font-display px-6 py-3 rounded-xl font-bold w-full sm:w-auto text-white transition-all ${
                  isLoading || !isPlaying || isCharacterGuessedCorrectly
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25"
                }`}
                disabled={
                  isLoading || !isPlaying || isCharacterGuessedCorrectly
                }
              >
                {isLoading ? (
                  <RotateCcw className="animate-spin mx-auto" size={18} />
                ) : (
                  "GUESS"
                )}
              </button>
            </form>
          </div>

          {/* Game Status and Hint Section */}
          {isPlaying && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3 justify-between items-center p-3 rounded-xl surface-muted">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-slate-200 text-xs sm:text-sm">
                    <Zap className="text-amber-400" size={15} />
                    {attempts} Attempts
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-slate-200 text-xs sm:text-sm">
                    <Award className="text-violet-400" size={15} />
                    {feedback
                      ? `${getCorrectCount()}/5 Correct`
                      : "No guesses yet"}
                  </span>
                </div>
                <button
                  onClick={toggleHint}
                  disabled={attempts < 5 || !feedback || hintpresscount > 5}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                    attempts >= 5 && feedback
                      ? "bg-violet-600 hover:bg-violet-500 text-white"
                      : "bg-white/5 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <HelpCircle size={16} />
                  {attempts < 5
                    ? `Hint (${5 - attempts} more guesses)`
                    : "Hint"}
                </button>
              </div>

              {/* Hint Display */}
              {hintState.isVisible && hintState.hint && (
                <div className="animate-fadeIn bg-violet-500/10 border border-violet-500/30 rounded-xl p-3">
                  <p className="text-violet-200 text-sm flex items-center gap-2">
                    <HelpCircle size={16} className="shrink-0" />
                    {hintState.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          {feedbackHistory.length > 0 ? (
            <div className="mt-2">
              {/* Column Headers */}
              <div className="grid grid-cols-5 rounded-t-xl overflow-hidden border border-white/10 bg-white/[0.04] text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
                <div className="p-2.5 text-slate-300">Anime</div>
                <div className="p-2.5 text-slate-300">Hair</div>
                <div className="p-2.5 text-slate-300">Power</div>
                <div className="p-2.5 text-slate-300">Weapon</div>
                <div className="p-2.5 text-slate-300">Role</div>
              </div>

              {/* Feedback History */}
              <div className="max-h-[40vh] overflow-y-auto scrollbar-thin mt-2 space-y-2.5">
                {feedbackHistory.map((entry, index) => (
                  <div
                    key={entry.timestamp}
                    className={`rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] ${
                      index === 0 ? "animate-slideDown" : ""
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-white/10 bg-white/[0.03]">
                      <p className="text-xs sm:text-sm text-slate-300">
                        Guess #{feedbackHistory.length - index}:{" "}
                        <span className="text-slate-100 font-medium">
                          {entry.guessedName}
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-5 text-center">
                      {Object.entries(entry.feedback).map(([key, isCorrect]) => (
                        <div
                          key={key}
                          className={`py-4 flex items-center justify-center ${
                            isCorrect
                              ? "bg-emerald-500/10"
                              : "bg-rose-500/[0.07]"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle
                              className="text-emerald-400"
                              size={22}
                            />
                          ) : (
                            <XCircle className="text-rose-400/80" size={22} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            isPlaying && (
              <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                Your guesses will show up here.
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-2.5 sm:p-3 text-slate-500 text-xs border-t border-white/10 shrink-0">
        Test your anime knowledge — how fast can you guess? · Attempts: {attempts}
      </div>
    </div>
  );
};

export default Main;

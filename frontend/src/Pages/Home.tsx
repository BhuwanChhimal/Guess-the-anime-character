import { useState } from "react";
import Main from "../components/Main";
import CharacterCard from "../components/CharacterCard";
import { Feedback, CharacterInfo } from "../types";

const Home = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCharacter, setCorrectCharacter] = useState<CharacterInfo | null>(null);
  const [cumulativeCorrect, setCumulativeCorrect] = useState<Feedback>({
    animeName: false,
    hairColor: false,
    powerType: false,
    weaponType: false,
    role: false,
  });

  const handleFeedbackUpdate = (newFeedback: Feedback | null, character: CharacterInfo, cumulative: Feedback) => {
    if (character) {
      setCorrectCharacter(character);
    }
    
    if (newFeedback !== undefined) {
      setFeedback(newFeedback);
    }

    setCumulativeCorrect(cumulative);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-purple-900  min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4 py-2 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 h-[calc(100vh-10rem)]">
            <Main onFeedbackUpdate={handleFeedbackUpdate} />
          </div>
          <div className="w-full lg:w-1/3 lg:h-[calc(100vh-10rem)] lg:sticky lg:top-8">
            <CharacterCard 
              feedback={feedback}
              correctCharacter={correctCharacter}
              cumulativeCorrect={cumulativeCorrect}
            />
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home;
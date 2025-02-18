import { useState, useEffect } from "react";
import Main from "../components/Main";
import CharacterCard from "../components/CharacterCard";
import { Feedback, CharacterInfo } from "../types";

const Home = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCharacter, setCorrectCharacter] = useState<CharacterInfo | null>(null);

  const handleFeedbackUpdate = (newFeedback: Feedback | null, character: CharacterInfo) => {

    
    if (character) {
     
      setCorrectCharacter(character);
    }
    
    if (newFeedback !== undefined) {
    
      setFeedback(newFeedback);
    }
  };


  return (
    <div className="bg-gradient-to-b from-gray-900 to-purple-900 min-h-screen">
      <div className="container mx-auto px-4 py-2 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 h-[calc(100vh-6rem)]">
            <Main onFeedbackUpdate={handleFeedbackUpdate} />
          </div>
          <div className="w-full lg:w-1/3 lg:h-[calc(100vh-6rem)] lg:sticky lg:top-8">
            <CharacterCard 
              feedback={feedback}
              correctCharacter={correctCharacter}
            />
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home;
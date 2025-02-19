import axios from "axios";
import React, { useEffect } from "react";
import questionMark from "../assets/question-mark.png";
import { Loader2 } from "lucide-react"; // Add this import at the top with other imports
interface CharacterCardProps {
  feedback: {
    animeName: boolean;
    hairColor: boolean;
    powerType: boolean;
    weaponType: boolean;
    role: boolean;
  } | null;
  cumulativeCorrect: {
    animeName: boolean;
    hairColor: boolean;
    powerType: boolean;
    weaponType: boolean;
    role: boolean;
  };
  correctCharacter: {
    name: string;
    animeName: string;
    hairColor: string;
    powerType: string;
    weaponType: string;
    role: string;
  } | null;
}
axios.defaults.baseURL = "http://localhost:5002";
const InfoRow = ({ label, value, isRevealed }: { label: string; value: string; isRevealed: boolean }) => (
  <div className="flex justify-between items-center py-1 border-b border-purple-700 border-opacity-30">
    <span className="text-purple-200">{label}:</span>
    <span className={`text-white font-medium ${isRevealed ? 'text-green-400' : ''}`}>
      {isRevealed ? value : '??'}
    </span>
  </div>
);

const CharacterCard: React.FC<CharacterCardProps> = ({
  feedback,
  cumulativeCorrect,
  correctCharacter
}) => {
  const [imageUrl, setImageUrl] = React.useState<string>(questionMark);
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(false);

  console.log("feedback",feedback)

  const fetchCharacterImageFromBackend = async (characterName: string) => {
    try {
      const response = await axios.get(`/api/characters/character-image/${encodeURIComponent(characterName)}`);
    
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      return '/api/placeholder/200/200';
    }
  };

  useEffect(() => {
    const getImage = async () => {
      if (!correctCharacter?.name) return;
      
      if (feedback?.animeName && feedback?.hairColor && feedback?.powerType && feedback?.role && feedback?.weaponType) {
        setIsImageLoading(true);
        try {
          const url = await fetchCharacterImageFromBackend(correctCharacter.name);
          if (url) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error in getImage:', error);
        } finally {
          setIsImageLoading(false);
        }
      } else {
        setImageUrl(questionMark);
      }
    };

    getImage();
  }, [correctCharacter?.name, feedback]);

  return (
    <div className="w-full max-w-sm h-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-purple-600 font-audiowide transition-all hover:shadow-purple-500/20 transform">
      {/* Header */}
      <div className="bg-purple-900 p-2 sm:p-3 text-center">
        <h2 className="text-white font-bold relative">
          <span className="absolute inset-0 flex items-center justify-center blur-sm text-purple-300">The character is...</span>
          <span className="relative">The character is...</span>
        </h2>
      </div>

      {/* Character Image */}
      <div className="p-4 sm:p-6 flex justify-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/40 transition-all relative">
          {isImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="character"
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>
      </div>

      {/* Character Info */}
      <div className="p-3 sm:p-5 space-y-2 bg-gray-900 mx-3 sm:mx-4 rounded-lg mb-4 sm:mb-5 shadow-inner">
        <InfoRow 
          label="Anime Name" 
          value={correctCharacter?.animeName || '??'}
          isRevealed={cumulativeCorrect.animeName}
        />
        <InfoRow 
          label="Hair Color" 
          value={correctCharacter?.hairColor || '??'}
          isRevealed={cumulativeCorrect.hairColor}
        />
        <InfoRow 
          label="Power Type" 
          value={correctCharacter?.powerType || '??'}
          isRevealed={cumulativeCorrect.powerType}
        />
        <InfoRow 
          label="Weapon Type" 
          value={correctCharacter?.weaponType || '??'}
          isRevealed={cumulativeCorrect.weaponType}
        />
        <InfoRow 
          label="Role" 
          value={correctCharacter?.role || '??'}
          isRevealed={cumulativeCorrect.role}
        />
      </div>
    </div>
  );
};

export default CharacterCard;
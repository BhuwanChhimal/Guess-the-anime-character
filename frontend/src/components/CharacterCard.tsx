import axios from "axios";
import React, { useEffect } from "react";
import questionMark from "../assets/question-mark.png";
import { Loader2, Lock } from "lucide-react"; // Add this import at the top with other imports
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
    mal_id:number;
    animeName: string;
    hairColor: string;
    powerType: string;
    weaponType: string;
    role: string;
  } | null;
}
axios.defaults.baseURL = "http://localhost:5002";
const InfoRow = ({ label, value, isRevealed }: { label: string; value: string; isRevealed: boolean }) => (
  <div className="flex justify-between items-center gap-3 py-1.5 border-b border-white/5 last:border-none">
    <span className="text-slate-400 text-sm">{label}</span>
    {isRevealed ? (
      <span className="text-emerald-400 font-medium text-sm text-right animate-reveal">
        {value}
      </span>
    ) : (
      <span className="flex items-center gap-1 text-slate-500 text-sm">
        <Lock size={12} /> Hidden
      </span>
    )}
  </div>
);

const CharacterCard: React.FC<CharacterCardProps> = ({
  feedback,
  cumulativeCorrect,
  correctCharacter
}) => {
  const [imageUrl, setImageUrl] = React.useState<string>(questionMark);
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(false);

  // console.log("feedback",feedback)

  const fetchCharacterImageFromBackend = async (character: string) => {
    try {
      const response = await axios.get(`/api/characters/character-image/${encodeURIComponent(character)}`); //character -> mal_id or name
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
          // Log the character details for debugging
          console.log('🔍 Character details:', {
            name: correctCharacter.name,
            mal_id: correctCharacter.mal_id
          });

          // Use MAL ID if available, otherwise use name
          const identifier = correctCharacter.mal_id ? correctCharacter.mal_id.toString() : correctCharacter.name;
          console.log('🎮 Using identifier:', identifier, 'Type:', correctCharacter.mal_id ? 'MAL ID' : 'Name');
          
          const url = await fetchCharacterImageFromBackend(identifier);
          if (url) {
            console.log('✅ Image URL received:', url);
            setImageUrl(url);
          }
        } catch (error) {
          console.error('❌ Error in getImage:', error);
        } finally {
          setIsImageLoading(false);
        }
      } else {
        setImageUrl(questionMark);
      }
    };

    getImage();
  }, [correctCharacter?.name, feedback, correctCharacter?.mal_id]);

  const revealedCount =
    Object.values(cumulativeCorrect).filter(Boolean).length;

  return (
    <div className="w-full max-w-sm surface rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 text-center border-b border-white/10">
        <h2 className="font-display text-gradient font-bold tracking-wide">
          The character is...
        </h2>
      </div>

      {/* Character Image */}
      <div className="p-5 sm:p-6 flex flex-col items-center gap-3">
        <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white/5 rounded-full overflow-hidden ring-2 ring-white/15 shadow-lg relative">
          {isImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="character"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Reveal progress */}
        <div className="w-full max-w-[12rem]">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Clues revealed</span>
            <span>{revealedCount}/5</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${(revealedCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Character Info */}
      <div className="px-4 py-3 space-y-1 surface-muted mx-4 rounded-xl mb-5">
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
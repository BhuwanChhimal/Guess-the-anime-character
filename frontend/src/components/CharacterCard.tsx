import React from "react";

interface CharacterCardProps {
  feedback: {
    animeName: boolean;
    hairColor: boolean;
    powerType: boolean;
    weaponType: boolean;
    role: boolean;
  } | null;
  correctCharacter: {
    animeName: string;
    hairColor: string;
    powerType: string;
    weaponType: string;
    role: string;
  } | null;
}

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
  correctCharacter
}) => {
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
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/40 transition-all">
          <img
            src={correctCharacter?.imageUrl || '/api/placeholder/200/200'}
            alt="guess-img"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* Character Info */}
      <div className="p-3 sm:p-5 space-y-2 bg-gray-900 mx-3 sm:mx-4 rounded-lg mb-4 sm:mb-5 shadow-inner">
        <InfoRow 
          label="Anime Name" 
          value={correctCharacter?.animeName || '??'}
          isRevealed={feedback?.animeName || false}
        />
        <InfoRow 
          label="Hair Color" 
          value={correctCharacter?.hairColor || '??'}
          isRevealed={feedback?.hairColor || false}
        />
        <InfoRow 
          label="Power Type" 
          value={correctCharacter?.powerType || '??'}
          isRevealed={feedback?.powerType || false}
        />
        <InfoRow 
          label="Weapon Type" 
          value={correctCharacter?.weaponType || '??'}
          isRevealed={feedback?.weaponType || false}
        />
        <InfoRow 
          label="Role" 
          value={correctCharacter?.role || '??'}
          isRevealed={feedback?.role || false}
        />
      </div>
    </div>
  );
};

export default CharacterCard;
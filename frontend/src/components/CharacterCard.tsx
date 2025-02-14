
interface CharacterCardProps {
  animeName?: string;
  gender?: string;
  hairColor?: string;
  powerType?: string;
  weaponType?: string;
  role?: string;
  species?: string;
  imageUrl?: string;
}

const CharacterCard = ({
  animeName = '??',
  gender = '??',
  hairColor = '??',
  powerType = '??',
  weaponType = '??',
  role = '??',
  species = '??',
  imageUrl = '/api/placeholder/200/200'
}: CharacterCardProps) => {
  return (
    <div className="w-full max-w-sm h-[30rem] bg-[#a4a4a4] rounded-lg overflow-hidden shadow-lg font-audiowide">
      {/* Header */}
      <div className=" p-2 text-center">
        <h2 className="text-white mt-2">The character is...</h2>
      </div>

      {/* Character Image */}
      <div className="p-4 flex justify-center">
        <div className="w-36 h-36 bg-[#d9d9d9] rounded-full overflow-hidden">
          <img
            src={imageUrl}
            alt="guess-img"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Character Info */}
      <div className="p-4 space-y-2 my-4 text-white text-sm">
        <InfoRow label="Anime Name" value={animeName} />
        <InfoRow label="Gender" value={gender} />
        <InfoRow label="Hair Color" value={hairColor} />
        <InfoRow label="Power Type" value={powerType} />
        <InfoRow label="Weapon Type" value={weaponType} />
        <InfoRow label="Role" value={role} />
        <InfoRow label="Species" value={species} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-white">{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

export default CharacterCard;
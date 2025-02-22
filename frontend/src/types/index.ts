export interface Feedback {
  animeName: boolean;
  hairColor: boolean;
  powerType: boolean;
  weaponType: boolean;
  role: boolean;
}

export interface CharacterInfo {
  mal_id?: number;
  name?: string;
  animeName: string;
  hairColor: string;
  powerType: string;
  weaponType: string;
  role: string;
  imageUrl?: string;
}

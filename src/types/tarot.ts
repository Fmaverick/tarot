export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  value: string;
  meaning_upright: string;
  meaning_reversed: string;
  description: string;
  image: string;
}

export interface SpreadPosition {
  id: string;
  name: string;
  description: string;
  x: number; // Relative position X (0-100)
  y: number; // Relative position Y (0-100)
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  detail?: string;
  difficulty?: 'beginner' | 'easy' | 'medium' | 'advanced';
  recommended?: boolean;
  tags?: string[];
  positions: SpreadPosition[];
}

export interface PlacedCard {
  card: TarotCard;
  positionId: string;
  isReversed: boolean;
}

export interface DeckCard {
  card: TarotCard;
  isReversed: boolean;
}

export interface ReadingResult {
  spread: Spread;
  cards: PlacedCard[];
  interpretation: string;
}

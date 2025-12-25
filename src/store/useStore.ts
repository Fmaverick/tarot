import { create } from 'zustand';
import { Spread, PlacedCard, TarotCard } from '@/types/tarot';
import { SPREADS } from '@/lib/spreads';
import { CARDS } from '@/lib/cards';

interface DeckCard {
  card: TarotCard;
  isReversed: boolean;
}

interface TarotState {
  // Reading Configuration
  selectedSpread: Spread | null;
  
  // Reading State
  deck: DeckCard[];
  placedCards: Record<string, PlacedCard>; // Map positionId to PlacedCard
  isReading: boolean;
  sessionId: string | null;
  language: 'en' | 'zh';
  
  // Actions
  setLanguage: (lang: 'en' | 'zh') => void;
  initializeDeck: () => void;
  selectSpread: (spreadId: string) => void;
  placeCard: (card: TarotCard, positionId: string, isReversed: boolean) => void;
  removeCard: (positionId: string) => void;
  startReading: () => void;
  resetReading: () => void;
  clearSpread: () => void;
}

export const useStore = create<TarotState>((set, get) => ({
  selectedSpread: null,
  deck: [],
  placedCards: {},
  isReading: false,
  sessionId: null,
  language: 'en',

  setLanguage: (lang) => set({ language: lang }),

  initializeDeck: () => {
    // Create deck with random orientation
    const newDeck = CARDS.map(card => ({
      card,
      isReversed: Math.random() < 0.5 // 50% chance of reversal
    }));

    // Fisher-Yates Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    set({ deck: newDeck, placedCards: {}, isReading: false, sessionId: null });
  },

  selectSpread: (spreadId) => {
    const spread = SPREADS.find(s => s.id === spreadId) || SPREADS[0];
    
    const currentDeck = get().deck;
    if (currentDeck.length === 0) {
      get().initializeDeck();
    }
    set({ selectedSpread: spread, placedCards: {}, isReading: false, sessionId: null });
  },

  clearSpread: () => {
    set({ selectedSpread: null, placedCards: {}, isReading: false, sessionId: null });
  },

  placeCard: (card, positionId, isReversed) => set((state) => {
    // Remove card from deck
    const newDeck = state.deck.filter(c => c.card.id !== card.id);
    
    return {
      deck: newDeck,
      placedCards: {
        ...state.placedCards,
        [positionId]: { card, positionId, isReversed }
      }
    };
  }),

  removeCard: (positionId) => set((state) => {
    const cardToRemove = state.placedCards[positionId];
    if (!cardToRemove) return state;

    const newPlacedCards = { ...state.placedCards };
    delete newPlacedCards[positionId];
    
    // Add card back to deck? Or just discard?
    // Usually in a reading you don't put it back in the middle.
    // For simplicity, let's just remove from placedCards. 
    // If we want to support "undo", we might need to add it back.
    // But for now, let's assume once removed it's gone or we don't support moving back to deck easily.
    // However, to keep deck consistent, maybe we should add it back to the bottom?
    // Let's add it back to a random position or bottom.
    const newDeck = [...state.deck, { card: cardToRemove.card, isReversed: cardToRemove.isReversed }];

    return { 
      placedCards: newPlacedCards,
      deck: newDeck
    };
  }),

  startReading: () => set({ isReading: true, sessionId: crypto.randomUUID() }),

  resetReading: () => {
    get().initializeDeck();
  },
}));

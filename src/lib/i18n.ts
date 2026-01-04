import { translations, Language, Translation } from "./translations";
import { CARDS } from "./cards";
import { CARDS_ZH } from "./cards.zh";
import { TarotCard } from "@/types/tarot";

export const getTranslation = (lang: Language): Translation => translations[lang];



export const getCards = (lang: Language): TarotCard[] => {
  return lang === 'zh' ? CARDS_ZH : CARDS;
};

export const getCard = (id: string, lang: Language): TarotCard => {
  const cards = getCards(lang);
  return cards.find(c => c.id === id) || CARDS.find(c => c.id === id)!;
};



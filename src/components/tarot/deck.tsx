"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard as TarotCardType } from "@/types/tarot";
import { TarotCard } from "./card";

interface CardDeckProps {
  cards: TarotCardType[];
  onDraw: (card: TarotCardType) => void;
}

export const CardDeck = ({ cards, onDraw }: CardDeckProps) => {
  const [isSpread, setIsSpread] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative w-56 h-96 perspective-1000 flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card: TarotCardType, index: number) => {
          // Calculate spread position
          const total = cards.length;
          const offset = index - (total - 1) / 2;
          const spreadFactor = 800 / total; // Dynamic spread based on card count
          const angle = isSpread ? offset * (120 / total) : 0;
          const x = isSpread ? offset * Math.min(spreadFactor, 30) : index * 0.2;
          const y = isSpread ? Math.abs(offset) * (100 / total) : index * -0.2;

          return (
            <motion.div
              key={card.id}
              onPan={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  setIsSpread(true);
                }
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: activeIndex === index ? 1.05 : 1,
                x,
                y,
                rotateZ: angle,
                zIndex: activeIndex === index ? 100 : index,
              }}
              whileHover={{ 
                scale: 1.05, 
                y: isSpread ? y - 20 : y,
                transition: { duration: 0.2 } 
              }}
              onClick={() => onDraw(card)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="absolute cursor-pointer"
              style={{ transformOrigin: "bottom center" }}
            >
              <TarotCard card={card} className="w-[10.5rem] h-72 shadow-xl" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {!isSpread && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-12 text-[10px] tracking-[0.3em] uppercase text-black/20 font-sans pointer-events-none"
        >
          Swipe to Spread
        </motion.div>
      )}
    </div>
  );
};

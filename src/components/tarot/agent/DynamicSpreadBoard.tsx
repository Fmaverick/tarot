"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/components/tarot/card";
import { TarotCard as TarotCardType, Spread, PlacedCard } from "@/types/tarot";
import { getCard } from "@/lib/i18n";
import { CardDetailModal } from "@/components/tarot/CardDetailModal";
import { Loader2 } from "lucide-react";

interface DynamicSpreadBoardProps {
  spread: Spread;
  placedCards: Record<string, PlacedCard>;
  onDrawCard: (positionId: string) => Promise<void>;
  isDrawing: boolean;
  language: 'en' | 'zh';
}

export function DynamicSpreadBoard({ spread, placedCards, onDrawCard, isDrawing, language }: DynamicSpreadBoardProps) {
  const [selectedCard, setSelectedCard] = useState<{ card: TarotCardType; isReversed: boolean } | null>(null);

  // Auto-layout calculation to prevent overlapping
  const getLayoutPosition = (index: number, total: number) => {
    const maxCols = 4;
    const rows = Math.ceil(total / maxCols);
    const row = Math.floor(index / maxCols);
    
    // Calculate items in this specific row
    const isLastRow = row === rows - 1;
    const itemsInLastRow = total % maxCols || maxCols;
    const itemsInThisRow = isLastRow ? itemsInLastRow : maxCols;
    
    // Index within the current row
    const colInThisRow = index - (row * maxCols);
    
    // Calculate X and Y percentages
    // X: Distribute evenly in the row
    const x = (100 / (itemsInThisRow + 1)) * (colInThisRow + 1);
    
    // Y: Distribute rows evenly
    const y = (100 / (rows + 1)) * (row + 1);
    
    return { x, y };
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 p-4 my-4">
      <div className="text-center mb-6">
        <h3 className="font-serif text-lg font-medium">{spread.name}</h3>
        <p className="text-sm text-black/60 font-light">{spread.description}</p>
      </div>

      <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
        {spread.positions.map((pos, index) => {
          const placed = placedCards[pos.id];
          const cardData = placed ? getCard(placed.card.id, language) : null;
          const { x, y } = getLayoutPosition(index, spread.positions.length);

          return (
            <div
              key={pos.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: "80px", // Smaller for embedded view
                height: "130px",
              }}
            >
              {/* Slot (Empty State) */}
              {!placed && (
                <button
                  onClick={() => onDrawCard(pos.id)}
                  disabled={isDrawing}
                  className={cn(
                    "absolute inset-0 border-2 border-dashed rounded-lg transition-all duration-300 flex items-center justify-center",
                    "border-black/20 hover:border-black/40 bg-white/40 hover:bg-white/60",
                    isDrawing && "opacity-50 cursor-wait"
                  )}
                >
                  {isDrawing ? (
                    <Loader2 className="w-5 h-5 animate-spin opacity-50" />
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">
                      Draw
                    </span>
                  )}
                </button>
              )}

              {/* Placed Card */}
              <AnimatePresence>
                {placed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative z-10 w-full h-full"
                  >
                    <TarotCard
                      card={placed.card}
                      isFlipped={true}
                      isReversed={placed.isReversed}
                      onFlip={() => setSelectedCard({ card: placed.card, isReversed: placed.isReversed })}
                      className="w-full h-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
               {/* Label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center pointer-events-none z-20">
                 <span className="text-[9px] uppercase tracking-widest text-black/50 font-semibold block truncate">
                    {pos.name}
                 </span>
                  {placed && cardData && (
                      <span className="text-[10px] font-serif text-black/80 block mt-0.5 truncate">
                          {cardData.name}
                      </span>
                  )}
              </div>
            </div>
          );
        })}
      </div>

       {/* Card Detail Modal */}
       {selectedCard && (() => {
        const translatedCard = getCard(selectedCard.card.id, language);
        return (
          <CardDetailModal
            card={translatedCard}
            isReversed={selectedCard.isReversed}
            isOpen={!!selectedCard}
            onClose={() => setSelectedCard(null)}
            language={language}
          />
        );
      })()}
    </div>
  );
}

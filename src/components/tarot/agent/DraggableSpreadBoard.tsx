"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { TarotCard } from "@/components/tarot/card";
import { TarotCard as TarotCardType, Spread, PlacedCard, DeckCard } from "@/types/tarot";
import { getCard } from "@/lib/i18n";
import { CardDetailModal } from "@/components/tarot/CardDetailModal";

interface DraggableSpreadBoardProps {
  spread: Spread;
  placedCards: Record<string, PlacedCard>;
  onPlaceCard: (positionId: string, card: TarotCardType, isReversed: boolean) => void;
  deck: DeckCard[];
  language: 'en' | 'zh';
}

export function DraggableSpreadBoard({ spread, placedCards, onPlaceCard, deck, language }: DraggableSpreadBoardProps) {
  const [selectedCard, setSelectedCard] = useState<{ card: TarotCardType; isReversed: boolean } | null>(null);
  
  // Filter out cards that are already placed
  const usedCardIds = new Set(Object.values(placedCards).map(p => p.card.id));
  // Show a stack of cards. 
  // We take more cards to show a fuller deck, similar to InteractiveDeck
  const availableDeck = deck.filter(c => !usedCardIds.has(c.card.id)); 

  const [isHovered, setIsHovered] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (card: DeckCard, info: PanInfo) => {
    // Only place card if dragged significantly upwards
    if (info.offset.y < -50) {
        // Check what element is under the drop point
        const elements = document.elementsFromPoint(info.point.x, info.point.y);
        // Look for an element with an id starting with "spread-slot-"
        const slotElement = elements.find((el) => el.id && el.id.startsWith("spread-slot-"));
        
        if (slotElement) {
          const slotId = slotElement.id.replace("spread-slot-", "");
          // Check if slot is empty
          if (!placedCards[slotId]) {
            onPlaceCard(slotId, card.card, card.isReversed);
          }
        }
    }
  };

  const handleDrag = (info: PanInfo) => {
    const sensitivity = isMobile ? 0.5 : 0.2;
    setRotation(prev => prev + info.delta.x * sensitivity);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY || e.deltaX;
    setRotation(prev => prev + delta * 0.1);
  };

  const isComplete = Object.keys(placedCards).length === spread.positions.length;

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
    
    // Calculate X and Y percentages with some padding from edges
    // X: Distribute evenly in the row, with 15% padding on each side
    const x = 15 + (70 / (itemsInThisRow + 1)) * (colInThisRow + 1);
    
    // Y: Distribute rows evenly, with 20% padding from top/bottom
    const y = 20 + (60 / (rows + 1)) * (row + 1);
    
    return { x, y };
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      {/* Spread Area */}
      <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 p-4 my-4 min-h-[400px] relative">
        <div className="text-center mb-6">
          <h3 className="font-serif text-lg font-medium">{spread.name}</h3>
          <p className="text-sm text-black/60 font-light">{spread.description}</p>
        </div>

        <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
          {spread.positions.map((pos, index) => {
            const placed = placedCards[pos.id];
            const cardData = placed ? getCard(placed.card.id, language) : null;

            // Always use auto-layout to prevent overlapping and ignore AI coordinates
            const { x, y } = getLayoutPosition(index, spread.positions.length);

            return (
              <div
                key={pos.id}
                id={`spread-slot-${pos.id}`}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 group",
                  !placed && "border-2 border-dashed border-black/10 bg-white/20 rounded-lg hover:bg-white/40 hover:border-black/20"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: isMobile ? "50px" : "80px",
                  height: isMobile ? "80px" : "130px",
                }}
              >
                {/* Slot Label (only when empty) */}
                {!placed && (
                  <span className="text-[9px] uppercase tracking-widest text-black/30 font-semibold pointer-events-none select-none">
                    {pos.name}
                  </span>
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
                        draggable={false} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                 {/* Label (Bottom) */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center pointer-events-none z-20">
                   {!placed && (
                     <span className="text-[9px] uppercase tracking-widest text-black/50 font-semibold block truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {pos.name}
                     </span>
                   )}
                    {placed && cardData && (
                        <>
                        <span className="text-[9px] uppercase tracking-widest text-black/50 font-semibold block truncate">
                            {pos.name}
                        </span>
                        <span className="text-[10px] font-serif text-black/80 block mt-0.5 truncate">
                            {cardData.name}
                        </span>
                        </>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deck Area (Draggable Sources) */}
      <AnimatePresence>
        {!isComplete && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full relative mt-2 flex flex-col items-center justify-center border-t border-black/5 pt-4 z-50"
            >
                {availableDeck.length > 0 ? (
                    <>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-black/40 font-serif italic mb-4"
                        >
                            {language === 'zh' ? "拖拽卡牌到上方牌阵空位" : "Drag cards to the empty slots above"}
                        </motion.p>
                        <div 
                            className="relative w-full h-40 flex items-center justify-center pb-4 overflow-visible"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onWheel={handleWheel}
                        >
                        <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-[1px] ${isMobile ? 'bottom-[-70px]' : 'bottom-[-120px]'}`}>
                        {availableDeck.map((deckCard, index) => {
                            // Circular Layout Constants
                            const radius = isMobile ? 180 : 300;
                            const totalAngle = 360; 
                            const anglePerCard = totalAngle / availableDeck.length;
                            
                            // Position calculation
                            const angleDeg = index * anglePerCard + rotation;
                            const angleRad = (angleDeg - 90) * (Math.PI / 180);
                            
                            const x = Math.cos(angleRad) * radius;
                            const y = Math.sin(angleRad) * radius;
                            const cardRotate = angleDeg;
                            
                            // Calculate z-index based on y position
                            const zIndex = Math.floor(y + 1000);
                            
                            // Limit visibility to semicircle
                            const isVisible = y < 50;
                            const opacity = isVisible ? (y > 0 ? 1 - (y / 50) : 1) : 0;

                            return (
                                <motion.div
                                    key={deckCard.card.id}
                                    drag
                                    dragSnapToOrigin
                                    whileDrag={{ scale: 1.1, zIndex: 2000, cursor: "grabbing" }}
                                    onDrag={(_, info) => handleDrag(info)}
                                    onDragEnd={(_, info) => handleDragEnd(deckCard, info)}
                                    initial={{ x: 0, rotate: 0, opacity: 0, y: 20 }}
                                    animate={{ 
                                        rotate: cardRotate,
                                        x: x,
                                        y: y + (isHovered ? -20 : 0), 
                                        zIndex: zIndex,
                                        opacity: opacity,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        delay: index * 0.01
                                    }}
                                    className={`absolute bg-white rounded-lg shadow-md border border-black/10 cursor-grab flex items-center justify-center transition-all duration-300 hover:-translate-y-4 ${isMobile ? 'w-12 h-20' : 'w-20 h-32'}`}
                                    style={{
                                        transformOrigin: "center center",
                                    }}
                                >
                                    {/* Card Back Design */}
                                    <div className="absolute inset-1 border border-black/5 rounded flex items-center justify-center bg-zinc-50 pointer-events-none">
                                        <div className={`rounded-full border border-black/5 opacity-50 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                        </div>
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-black/40 font-serif italic h-40 flex items-center justify-center">
                        {language === 'zh' ? "正在洗牌..." : "Shuffling..."}
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

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

import React, { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";

export function InteractiveDeck() {
  const { placedCards, placeCard, selectedSpread, deck, language } = useStore();
  const t = getTranslation(language);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If spread is full, hide deck? Or just disable.
  const isFull = selectedSpread && Object.keys(placedCards).length >= selectedSpread.positions.length;

  if (isFull) return null;

  const handleDragEnd = (index: number, info: PanInfo) => {
    // Only place card if dragged significantly upwards
    if (info.offset.y < -50) {
        // Find if dropped on a slot
        const elements = document.elementsFromPoint(info.point.x, info.point.y);
        const slotElement = elements.find((el) => el.id.startsWith("slot-"));
        
        if (slotElement) {
          const slotId = slotElement.id.replace("slot-", "");
          
          // Check if slot is already filled
          if (!placedCards[slotId]) {
            // Get the specific card from the deck
            const cardToPlace = deck[index];
            if (cardToPlace) {
               placeCard(cardToPlace.card, slotId, cardToPlace.isReversed);
            }
          }
        }
    }
  };

  const handleDrag = (info: PanInfo) => {
    // Rotate deck based on horizontal drag
    // Adjust sensitivity as needed
    const sensitivity = isMobile ? 0.5 : 0.2;
    setRotation(prev => prev + info.delta.x * sensitivity);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Rotate based on scroll delta
    const delta = e.deltaY || e.deltaX;
    setRotation(prev => prev + delta * 0.1);
  };

  // Only render a subset for performance and visual clarity
  // Since deck is shuffled, taking the first N is effectively random cards
  const visibleCards = deck;
  
  // Wheel layout constants
  const radius = isMobile ? 200 : 350;
  const totalAngle = 360; // Full circle
  const anglePerCard = totalAngle / visibleCards.length;

  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center justify-end h-64 pointer-events-none overflow-visible"
    >
      <div 
        className="relative w-full h-full pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
      >
        <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-[1px] ${isMobile ? 'bottom-[-80px]' : 'bottom-[-150px]'}`}>
        {visibleCards.map((_, index) => {
            // Calculate position in circle
            const angleDeg = index * anglePerCard + rotation;
            const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 to start from top
            
            // Calculate x and y based on radius
            // We want the cards to be on the circumference
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            // Rotation of the card itself to point to center
            const cardRotate = angleDeg;
            
            // Calculate z-index based on y position (cards lower on screen are closer/on top)
            // Add offset to ensure positive values if needed, though not strictly required
            const zIndex = Math.floor(y + 1000);
            
            // Limit visibility to semicircle (upper half)
            // If y > 0 (relative to center), it's in the lower half.
            // We want to hide cards that rotate too far down.
            // Let's add a fade out effect near the edges.
            // y goes from -radius (top) to +radius (bottom)
            // We want to hide if y > 20 (just below horizontal center)
            const isVisible = y < 50; 
            const opacity = isVisible ? (y > 0 ? 1 - (y / 50) : 1) : 0;

            return (
              <motion.div
                key={deck[index].card.id} // Use stable ID from actual card
                drag
                dragSnapToOrigin
                whileDrag={{ scale: 1.1, zIndex: 2000 }} // Ensure dragged card is always on top
                onDrag={(_, info) => handleDrag(info)}
                onDragEnd={(_, info) => handleDragEnd(index, info)}
                initial={false}
                animate={{
                    x: x,
                    y: y + (isHovered ? -20 : 0), // Slight lift on hover
                    rotate: cardRotate,
                    zIndex: zIndex,
                    opacity: opacity
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute bg-white rounded-lg shadow-lg border border-black/10 cursor-grab active:cursor-grabbing hover:-translate-y-4 transition-all duration-300 ${isMobile ? 'w-16 h-24' : 'w-24 h-40'}`}
                style={{
                    // transformOrigin is handled by x/y positioning relative to center
                    transformOrigin: "center center",
                }}
              >
                 {/* Card Back Design */}
                 <div className="absolute inset-1 border border-black/5 rounded flex items-center justify-center bg-zinc-50">
                    <div className={`rounded-full border border-black/5 opacity-50 ${isMobile ? 'w-4 h-4' : 'w-8 h-8'}`} />
                 </div>
              </motion.div>
            );
        })}
        </div>
         
         {/* Hint Text */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center pointer-events-none z-50">
             <p className="text-[10px] uppercase tracking-widest text-black/40 bg-white/80 px-3 py-1 rounded-full backdrop-blur shadow-sm">
                 {isMobile ? "Scroll to Rotate • Drag to Pick" : t.deck.drag_instruction}
             </p>
         </div>
      </div>
    </div>
  );
}

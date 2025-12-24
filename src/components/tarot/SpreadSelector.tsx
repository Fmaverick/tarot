"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SpreadPosition } from "@/types/tarot";
import { getSpreads, getTranslation } from "@/lib/i18n";

const SpreadPreview = ({ positions }: { positions: SpreadPosition[] }) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-black/[0.02] rounded-md border border-black/5 overflow-hidden pointer-events-none">
      {positions.map((pos) => (
        <div
          key={pos.id}
          className="absolute w-[18%] h-[28%] bg-white border border-black/10 shadow-sm rounded-[2px]"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

export function SpreadSelector() {
  const { selectedSpread, selectSpread, language } = useStore();
  const t = getTranslation(language);
  const spreads = getSpreads(language);

  const handleSelect = (id: string) => {
    selectSpread(id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <h3 className="text-sm uppercase tracking-[0.2em] text-black/40 font-semibold mb-2">
          {t.spreadSelector.label}
        </h3>
        <p className="text-2xl font-serif text-black/80">
          {t.spreadSelector.title}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {spreads.map((spread) => {
          const isSelected = selectedSpread?.id === spread.id;
          
          return (
            <motion.button
              key={spread.id}
              type="button"
              onClick={() => handleSelect(spread.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}

              className={cn(
                "group relative flex flex-col gap-4 p-5 rounded-xl border text-left transition-all duration-300",
                isSelected
                  ? "bg-white/90 border-black/20 shadow-lg shadow-black/[0.02] ring-1 ring-black/5"
                  : "bg-white/40 border-black/5 hover:bg-white/70 hover:border-black/10 hover:shadow-md hover:shadow-black/[0.02]"
              )}
            >
              {/* Preview Area */}
              <div className="w-full opacity-80 group-hover:opacity-100 transition-opacity">
                <SpreadPreview positions={spread.positions} />
              </div>

              {/* Text Content */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className={cn(
                    "font-serif text-lg tracking-wide transition-colors",
                    isSelected ? "text-black" : "text-black/70 group-hover:text-black"
                  )}>
                    {spread.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-black/30 font-medium">
                    {spread.positions.length} {t.spreadSelector.cards_count}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-black/50 line-clamp-2">
                  {spread.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selection-indicator"
                  className="absolute inset-0 border-2 border-black/5 rounded-xl pointer-events-none"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

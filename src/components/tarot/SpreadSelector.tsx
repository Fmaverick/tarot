"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SpreadPosition } from "@/types/tarot";
import { getSpreads, getTranslation } from "@/lib/i18n";
import { useState } from "react";
import { Sparkles, Star } from "lucide-react";

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

const DifficultyBadge = ({ difficulty }: { difficulty?: 'beginner' | 'easy' | 'medium' | 'advanced' }) => {
  if (!difficulty) return null;

  const config = {
    beginner: { label: "入门", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    easy: { label: "简单", color: "bg-blue-50 text-blue-700 border-blue-200" },
    medium: { label: "中等", color: "bg-amber-50 text-amber-700 border-amber-200" },
    advanced: { label: "高级", color: "bg-purple-50 text-purple-700 border-purple-200" },
  };

  const { label, color } = config[difficulty];

  return (
    <span className={cn(
      "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium",
      color
    )}>
      {label}
    </span>
  );
};

const RecommendedBadge = () => (
  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200/50">
    <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
    <span className="text-[10px] font-semibold text-amber-800">推荐</span>
  </div>
);

export function SpreadSelector() {
  const { selectedSpread, selectSpread, language } = useStore();
  const t = getTranslation(language);
  const spreads = getSpreads(language);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = (id: string) => {
    if (isSelecting) return;
    setIsSelecting(true);

    setTimeout(() => {
      selectSpread(id);
      setIsSelecting(false);
    }, 200);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full min-h-full max-w-5xl mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h3 className="text-sm uppercase tracking-[0.2em] text-black/40 font-semibold mb-2">
            {t.spreadSelector.label}
          </h3>
          <p className="text-2xl font-serif text-black/80">
            {t.spreadSelector.title}
          </p>
          <p className="text-sm text-black/50 mt-2 max-w-md mx-auto">
            {language === 'zh' ? '选择适合你问题的牌阵，新手推荐从单张牌或三张牌开始' : 'Choose a spread that fits your question. Beginners start with Single Card or Three Card Spread'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spreads.map((spread) => {
            const isSelected = selectedSpread?.id === spread.id;

            return (
              <motion.button
                key={spread.id}
                type="button"
                onClick={() => handleSelect(spread.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative flex flex-col gap-4 p-6 rounded-2xl border text-left transition-all duration-300",
                  isSelected
                    ? "bg-white/95 border-black/30 shadow-xl shadow-black/[0.05] ring-2 ring-black/10"
                    : "bg-white/60 border-black/10 hover:bg-white/90 hover:border-black/20 hover:shadow-lg hover:shadow-black/[0.03]"
                )}
              >
                {/* Recommended Badge */}
                {spread.recommended && !isSelected && <RecommendedBadge />}

                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className={cn(
                        "font-serif text-xl tracking-wide",
                        isSelected ? "text-black" : "text-black/80 group-hover:text-black"
                      )}>
                        {spread.name}
                      </h4>
                      <DifficultyBadge difficulty={spread.difficulty} />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-black/30 font-medium">
                      {spread.positions.length} {t.spreadSelector.cards_count}
                    </p>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="w-full opacity-70 group-hover:opacity-100 transition-opacity">
                  <SpreadPreview positions={spread.positions} />
                </div>

                {/* Tags */}
                {spread.tags && spread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {spread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-1 rounded-full bg-black/5 text-black/60 font-medium border border-black/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed text-black/70 font-medium">
                    {spread.description}
                  </p>
                  {spread.detail && (
                    <p className="text-xs leading-relaxed text-black/50 line-clamp-2">
                      {spread.detail}
                    </p>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selection-indicator"
                    className="absolute inset-0 border-2 border-black/20 rounded-2xl pointer-events-none"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { TarotCard as TarotCardType } from "@/types/tarot";

interface CardDetailModalProps {
  card: TarotCardType;
  isReversed: boolean;
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'zh';
}

export function CardDetailModal({
  card,
  isReversed,
  isOpen,
  onClose,
  language = 'en'
}: CardDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-zinc-50/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 30,
              mass: 0.8
            }}
            className="relative bg-[#FCFCFC] w-full max-w-5xl h-[600px] lg:h-full lg:max-h-[80vh] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] flex flex-col md:flex-row rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Moved to Right Column for better layout control */}
            
            {/* Left Column: Image */}
            <div className="w-full md:w-[45%] bg-[#F8F8F8] flex items-center justify-center p-12 relative overflow-hidden group">
              {/* Gradient Edges */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/80 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/80 to-transparent z-10" />
              
              <motion.div 
                className="relative w-64 aspect-[3/5] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div 
                  className="w-full h-full relative"
                  style={{
                    transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.6s ease-out" 
                  }}
                >
                  <div className="absolute inset-0 border-[6px] border-white bg-white">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 p-4 text-center border border-black/5">
                      <span className="text-4xl font-serif italic text-black/80 mb-2">{card.value}</span>
                      <span className="text-sm font-serif text-black/60">{card.name}</span>
                    </div>
                  )}
                </div>
                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none mix-blend-multiply" />
              </div>
            </motion.div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-[55%] p-8 md:p-12 overflow-y-auto bg-white flex flex-col relative">
               {/* Close Button - Sticky at top right of content area */}
               <div className="absolute top-6 right-6 z-20">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-black/[0.03] rounded-full transition-colors group"
                >
                  <X className="w-5 h-5 text-black/40 group-hover:text-black/80 transition-colors" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 space-y-10 mt-4">
                
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-black/40 font-medium">
                      {card.arcana === 'major' 
                        ? (language === 'zh' ? '大阿卡纳' : 'Major Arcana') 
                        : (language === 'zh' ? '小阿卡纳' : 'Minor Arcana')}
                    </span>
                    <div className="h-px w-8 bg-black/10" />
                    <span className="text-[10px] uppercase tracking-[0.1em] text-black/40 font-medium">
                      {card.value}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-black">
                      {card.name}
                    </h2>
                    
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-black/[0.06] bg-zinc-50/50">
                      <span className="w-1 h-1 rounded-full bg-black/20 mr-2" />
                      <span className="text-[10px] uppercase tracking-widest text-black/50 font-medium">
                        {isReversed
                          ? (language === 'zh' ? '逆位' : 'Reversed')
                          : (language === 'zh' ? '正位' : 'Upright')
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meaning Section */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-black/30 font-semibold">
                      {language === 'zh' ? '含义' : 'Meaning'}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-black/80 font-serif font-light">
                      {isReversed ? card.meaning_reversed : card.meaning_upright}
                    </p>
                  </div>

                  {/* Description Section */}
                  {card.description && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-black/30 font-semibold">
                        {language === 'zh' ? '画面描述' : 'Description'}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed text-black/50 font-serif italic">
                        {card.description}
                      </p>
                    </div>
                  )}

                  {/* Keywords */}
                  <div className="pt-8 border-t border-black/[0.04]">
                    <div className="flex flex-wrap gap-2">
                      {(isReversed ? card.meaning_reversed : card.meaning_upright)
                        .split(',')
                        .slice(0, 5)
                        .map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-4 py-2 rounded-full bg-zinc-50 border border-black/[0.03] text-black/50 font-serif hover:bg-zinc-100 transition-colors cursor-default"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

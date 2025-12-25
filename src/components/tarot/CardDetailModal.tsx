"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { TarotCard as TarotCardType } from "@/types/tarot";
import { cn } from "@/lib/utils";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop & Modal Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 25
        }}
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-black/10 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.3em] text-black/40 font-serif">
              {card.arcana === 'major' ? (language === 'zh' ? '大阿卡纳' : 'Major Arcana') : (language === 'zh' ? '小阿卡纳' : 'Minor Arcana')}
            </span>
            <div className="h-px w-12 bg-black/10" />
            <span className="text-xs font-serif text-black/60">
              {card.value}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-black/5 rounded-full transition-colors group"
          >
            <X className="w-4 h-4 opacity-40 group-hover:opacity-60 transition-opacity" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-80px)]">
          {/* Card Image Section */}
          <div className="md:w-2/5 p-8 flex items-center justify-center bg-gradient-to-br from-zinc-50/50 to-white">
            <div
              className="relative w-56 h-96"
              style={{
                transform: isReversed ? "rotate(180deg)" : "rotate(0deg)"
              }}
            >
              <div className="absolute inset-0 rounded-xl border border-black/[0.08] bg-white shadow-xl overflow-hidden">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 224px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 p-4 text-center">
                    <span className="text-4xl font-serif italic text-black/80 mb-2">{card.value}</span>
                    <span className="text-sm font-serif text-black/60">{card.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-amber-50/10 pointer-events-none mix-blend-multiply" />
              </div>
            </div>
          </div>

          {/* Card Info Section */}
          <div className="md:w-3/5 p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Card Name */}
              <div>
                <h2 className="text-3xl font-serif font-light tracking-tight text-black mb-2">
                  {card.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs uppercase tracking-wider px-3 py-1 rounded-full border",
                    isReversed
                      ? "bg-red-50/50 border-red-200/50 text-red-700/70"
                      : "bg-emerald-50/50 border-emerald-200/50 text-emerald-700/70"
                  )}>
                    {isReversed
                      ? (language === 'zh' ? '逆位' : 'Reversed')
                      : (language === 'zh' ? '正位' : 'Upright')
                    }
                  </span>
                </div>
              </div>

              {/* Meaning */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
                  {language === 'zh' ? '含义' : 'Meaning'}
                </h3>
                <p className="text-sm leading-relaxed text-black/80 font-serif">
                  {isReversed ? card.meaning_reversed : card.meaning_upright}
                </p>
              </div>

              {/* Description */}
              {card.description && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
                    {language === 'zh' ? '描述' : 'Description'}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/60 font-serif italic">
                    {card.description}
                  </p>
                </div>
              )}

              {/* Keywords Tags */}
              <div className="pt-4 border-t border-black/5">
                <div className="flex flex-wrap gap-2">
                  {(isReversed ? card.meaning_reversed : card.meaning_upright)
                    .split(',')
                    .slice(0, 4)
                    .map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1.5 rounded-full bg-black/5 text-black/60 font-serif"
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
  );
}

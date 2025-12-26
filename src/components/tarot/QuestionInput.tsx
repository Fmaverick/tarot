"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function QuestionInput() {
  const { language, setQuestion } = useStore();
  const t = getTranslation(language);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setQuestion(input.trim());
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-black/80">
            {t.question.title}
          </h2>
          <p className="text-sm text-black/50">
            {t.question.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.placeholder_start}
              className="peer w-full text-center text-lg py-6 bg-transparent border-0 rounded-none focus-visible:ring-0 placeholder:text-black/20 shadow-none"
              autoFocus
            />
            {/* Custom Bottom Border with Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent peer-focus-visible:via-black/50 transition-all duration-300" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {t.question.presets.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-colors text-black/60 font-serif"
              >
                {q}
              </button>
            ))}
          </div>

          <Button 
            type="submit" 
            disabled={!input.trim()}
            className="rounded-full px-8 py-6 bg-black text-white hover:bg-black/80 transition-all disabled:opacity-50"
          >
            <span className="font-serif tracking-widest text-sm uppercase mr-2">
              {t.question.button}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

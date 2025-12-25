import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function Hero({ onStart }: { onStart: () => void }) {
  const { language } = useStore();
  const t = getTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6 max-w-2xl"
      >
        <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tight text-black">
            {t.hero.title}
        </h1>
        <p className="text-lg md:text-xl text-black/60 font-serif leading-relaxed">
            {t.hero.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Button 
            onClick={onStart}
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-6 border-black/10 hover:bg-black/5 hover:border-black/20 text-black/80 transition-all duration-500 group"
        >
            <span className="font-serif tracking-widest text-sm uppercase mr-2">{t.hero.cta}</span>
            <ArrowDown className="w-4 h-4 opacity-50 group-hover:translate-y-1 transition-transform" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-0 w-full text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 font-serif">
          Aether Tarot © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

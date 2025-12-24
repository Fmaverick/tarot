"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { SpreadSelector } from "@/components/tarot/SpreadSelector";
import { SpreadBoard } from "@/components/tarot/SpreadBoard";
import { InteractiveDeck } from "@/components/tarot/InteractiveDeck";
import { ChatInterface } from "@/components/tarot/ChatInterface";
import { RefreshCw, Settings2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIConfig } from "@/types/tarot";
import { getTranslation } from "@/lib/i18n";

export default function Home() {
  const { selectedSpread, placedCards, resetReading, isReading, language, setLanguage } = useStore();
  const t = getTranslation(language);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<AIConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tarot-ai-config');
      if (saved) return JSON.parse(saved);
    }
    return {
      baseUrl: "",
      apiKey: "",
      model: "",
    };
  });

  const saveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    localStorage.setItem('tarot-ai-config', JSON.stringify(newConfig));
    setShowSettings(false);
  };

  const isFull = selectedSpread 
    ? Object.keys(placedCards).length >= selectedSpread.positions.length 
    : false;

  React.useEffect(() => {
    document.title = t.app.title;
  }, [t]);

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-black font-sans overflow-hidden selection:bg-black/5 relative">
      {/* Header */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-8 py-6 mix-blend-difference text-black">
        <h1 className="text-sm tracking-[0.3em] uppercase font-serif font-semibold">{t.app.title}</h1>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center gap-2"
            title={t.app.lang_switch}
          >
            <Globe className="h-4 w-4 opacity-50" />
            <span className="text-xs font-serif opacity-50">{language === 'en' ? 'ZH' : 'EN'}</span>
          </button>
          {selectedSpread && (
            <button 
              onClick={resetReading}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              title={t.app.reset}
            >
              <RefreshCw className="h-4 w-4 opacity-50" />
            </button>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            title={t.app.settings}
          >
            <Settings2 className="h-4 w-4 opacity-50" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative w-full h-screen pt-24 pb-8 px-4 flex flex-col items-center">
        
        <AnimatePresence>
          {!selectedSpread ? (
            <motion.div 
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex items-center justify-center w-full"
            >
              <SpreadSelector />
            </motion.div>
          ) : (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "w-full h-full relative transition-all duration-500 ease-in-out",
                isFull ? "grid grid-cols-2 gap-12 items-center px-12 max-w-[1600px] mx-auto" : "flex flex-col items-center justify-center"
              )}
            >
               {/* Spread Board Area */}
               <div className={cn(
                 "w-full transition-all duration-500 flex flex-col items-center justify-center",
                 isFull ? "h-full" : ""
               )}>
                  <SpreadBoard />
                  
                  {/* Deck (only if not full and not reading) */}
                  {!isFull && !isReading && <InteractiveDeck />}
               </div>

               {/* Chat Interface (When Full) */}
               <AnimatePresence>
                {isFull && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full max-h-[80vh] w-full"
                  >
                    <ChatInterface config={config} onClose={resetReading} />
                  </motion.div>
                )}
               </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4"
            >
              <h2 className="text-lg font-serif mb-6">{t.settings.title}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                saveConfig({
                  baseUrl: formData.get('baseUrl') as string,
                  apiKey: formData.get('apiKey') as string,
                  model: formData.get('model') as string,
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">{t.settings.base_url}</label>
                  <input 
                    name="baseUrl"
                    defaultValue={config.baseUrl}
                    placeholder="https://api.openai.com/v1"
                    className="w-full p-3 bg-zinc-50 border border-black/10 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">{t.settings.api_key}</label>
                  <input 
                    name="apiKey"
                    type="password"
                    defaultValue={config.apiKey}
                    placeholder="sk-..."
                    className="w-full p-3 bg-zinc-50 border border-black/10 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">{t.settings.model}</label>
                  <input 
                    name="model"
                    defaultValue={config.model}
                    placeholder="gpt-4"
                    className="w-full p-3 bg-zinc-50 border border-black/10 rounded-lg text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm opacity-50 hover:opacity-100"
                  >
                    {t.settings.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-black/80"
                  >
                    {t.settings.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

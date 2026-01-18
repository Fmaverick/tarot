"use client";

import { CustomModeView } from "@/components/tarot/agent/CustomModeView";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";
import { Globe, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/auth/UserMenu";
import { Suspense } from "react";

export default function CustomModePage() {
  const { language, setLanguage } = useStore();
  const t = getTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc] selection:bg-black/5 relative">
      {/* Header */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <h1 className="text-sm tracking-[0.3em] uppercase font-serif font-semibold">
              {t.app.title}
            </h1>
          </Link>
          <div className="h-4 w-[1px] bg-black/10 hidden md:block" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-medium hidden md:block">
            {language === "zh" ? "定制解读" : "Custom Mode"}
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            className="flex p-2 hover:bg-black/5 rounded-full transition-colors items-center gap-2"
            title={t.app.lang_switch}
          >
            <Globe className="h-4 w-4 opacity-50" />
            <span className="text-xs font-serif opacity-50">
              {language === "en" ? "ZH" : "EN"}
            </span>
          </button>

          <Link
            href="/"
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            title={language === "zh" ? "返回首页" : "Back to Home"}
          >
            <ArrowLeft className="h-4 w-4 opacity-50" />
          </Link>

          <UserMenu />
        </div>
      </nav>

      <div className="w-full max-w-4xl h-[85vh] pt-20 px-4 lg:px-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-black/20" />
          </div>
        }>
          <CustomModeView />
        </Suspense>
      </div>
    </div>
  );
}

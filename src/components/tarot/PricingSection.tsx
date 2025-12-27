import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";
import { PricingCards } from "./PricingCards";

export function PricingSection() {
  const { language } = useStore();
  const t = getTranslation(language);

  return (
    <section className="w-full py-24 px-4 bg-[#fcfcfc] relative overflow-hidden" id="pricing">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-light tracking-wide"
          >
            {t.pricing.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-black/50 font-light"
          >
            {t.pricing.subtitle}
          </motion.p>
        </div>

        <PricingCards />
      </div>
    </section>
  );
}


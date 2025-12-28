import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";
import { PLANS, PRICING_PLANS } from "@/lib/pricing";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

interface PricingCardsProps {
  className?: string;
  isModal?: boolean;
}

export function PricingCards({ className, isModal = false }: PricingCardsProps) {
  const { language } = useStore();
  const { user } = useAuthStore();
  const t = getTranslation(language);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    if (!user) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    try {
      setLoading(planKey);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planKey }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      key: PLANS.BASIC,
      config: PRICING_PLANS[PLANS.BASIC],
      trans: t.pricing.plans.basic,
    },
    {
      key: PLANS.PRO,
      config: PRICING_PLANS[PLANS.PRO],
      trans: t.pricing.plans.pro,
      featured: true,
    },
    {
      key: PLANS.PREMIUM,
      config: PRICING_PLANS[PLANS.PREMIUM],
      trans: t.pricing.plans.premium,
    },
  ];

  const formatFeatureValue = (feature: string, value: number | boolean | string | { limit: number; type: string }) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="h-4 w-4 text-emerald-500" /> : <span className="text-black/20">-</span>;
    }
    
    if (typeof value === 'object' && 'limit' in value) {
        if (value.limit === -1) return t.pricing.values.unlimited;
        if (value.limit === 0) return <span className="text-black/20">-</span>;
        return `${value.limit} ${t.pricing.values.times}${value.type === 'month' ? t.pricing.monthly : ''}`;
    }

    if (feature === 'historyDays') {
        if (value === -1) return t.pricing.values.lifetime;
        return `${value} ${t.pricing.values.days}`;
    }
    
    if (feature === 'apiAccess') {
        if (value === 'none') return <span className="text-black/20">-</span>;
        return <Check className="h-4 w-4 text-emerald-500" />;
    }

    return value;
  };

  const featureKeys = [
    'aiReadings',
    'historyDays',
    'importOthers',
    'dailyFortune',
    'reportExport',
    'apiAccess',
    'consultation'
  ] as const;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", className)}>
      {plans.map((plan, index) => (
        <motion.div
          key={plan.key}
          initial={isModal ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 20 }}
          whileInView={isModal ? undefined : { opacity: 1, y: 0 }}
          animate={isModal ? { opacity: 1, scale: 1 } : undefined}
          viewport={isModal ? undefined : { once: true }}
          transition={{ delay: index * 0.1 + (isModal ? 0 : 0.2) }}
          className={cn(
            "relative p-8 rounded-2xl border bg-white/50 backdrop-blur-sm flex flex-col",
            plan.featured ? "border-black shadow-lg z-10" : "border-black/5 hover:border-black/20 transition-colors",
            plan.featured && !isModal ? "scale-105" : ""
          )}
        >
          <div className="mb-8 text-center">
            <h3 className="text-xl font-serif mb-2">{plan.trans.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-4xl font-light font-serif">${plan.config.price}</span>
              <span className="text-black/40 text-sm">{t.pricing.monthly}</span>
            </div>
            <p className="text-sm text-black/50 font-light min-h-[40px]">
              {plan.trans.description}
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            {featureKeys.map((key) => {
              const label = t.pricing.features[key === 'aiReadings' ? 'ai_readings' : 
                                             key === 'historyDays' ? 'history_days' :
                                             key === 'importOthers' ? 'import_others' :
                                             key === 'dailyFortune' ? 'daily_fortune' :
                                             key === 'reportExport' ? 'report_export' :
                                             key === 'apiAccess' ? 'api_access' : 'consultation'];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const value = formatFeatureValue(key, (plan.config.features as any)[key]);
              
              return (
                <div key={key} className="flex items-center justify-between text-sm group">
                  <span className="text-black/60 group-hover:text-black/80 transition-colors">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              );
            })}
          </div>

          <Button 
            variant={plan.featured ? "default" : "outline"}
            className={cn(
              "w-full rounded-full h-12 text-sm tracking-wider font-medium",
              plan.featured ? "bg-black text-white hover:bg-black/90" : "hover:bg-black/5"
            )}
            disabled={true}
          >
            {user?.plan === plan.key 
              ? (language === 'zh' ? '当前计划' : 'Current Plan')
              : (language === 'zh' ? '暂未开放' : 'Coming Soon')
            }
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

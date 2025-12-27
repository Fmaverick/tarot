export const PLANS = {
  BASIC: 'basic',
  PRO: 'pro',
  PREMIUM: 'premium',
} as const;

export type PlanLevel = typeof PLANS[keyof typeof PLANS];

export interface PlanFeature {
  limit: number; // -1 for unlimited
  type: 'total' | 'month';
}

export interface PlanConfig {
  name: string;
  price: number;
  interval: 'month';
  stripePriceId?: string;
  features: {
    aiReadings: PlanFeature;
    historyDays: number; // -1 for permanent
    importOthers: boolean;
    dailyFortune: boolean;
    reportExport: boolean;
    apiAccess: 'none' | 'basic' | 'custom';
    consultation: PlanFeature;
  };
}

export const PRICING_PLANS: Record<PlanLevel, PlanConfig> = {
  [PLANS.BASIC]: {
    name: '基础版',
    price: 0,
    interval: 'month',
    features: {
      aiReadings: { limit: 10, type: 'total' },
      historyDays: 30,
      importOthers: false,
      dailyFortune: true,
      reportExport: true,
      apiAccess: 'basic',
      consultation: { limit: 0, type: 'month' },
    },
  },
  [PLANS.PRO]: {
    name: '专业版',
    price: 9.9,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
    features: {
      aiReadings: { limit: 200, type: 'month' },
      historyDays: -1, // Permanent
      importOthers: true,
      dailyFortune: true,
      reportExport: true,
      apiAccess: 'basic',
      consultation: { limit: 3, type: 'month' },
    },
  },
  [PLANS.PREMIUM]: {
    name: '高级版',
    price: 49.9,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRICE_ID_PREMIUM,
    features: {
      aiReadings: { limit: 500, type: 'month' },
      historyDays: -1, // Permanent
      importOthers: true,
      dailyFortune: true,
      reportExport: true,
      apiAccess: 'custom',
      consultation: { limit: -1, type: 'month' }, // Unlimited
    },
  },
};

export const MAX_FREE_CREDITS = PRICING_PLANS[PLANS.BASIC].features.aiReadings.limit;

export function getPlanConfig(plan: PlanLevel): PlanConfig {
  return PRICING_PLANS[plan] || PRICING_PLANS[PLANS.BASIC];
}

export function checkLimit(
  user: { plan: PlanLevel; aiReadingsUsage: number; consultationUsage: number },
  feature: keyof PlanConfig['features']
): boolean {
  const config = getPlanConfig(user.plan);
  const featureConfig = config.features[feature];

  if (typeof featureConfig === 'object' && 'limit' in featureConfig) {
    if (featureConfig.limit === -1) return true;
    
    if (feature === 'aiReadings') {
      return user.aiReadingsUsage < featureConfig.limit;
    }
    if (feature === 'consultation') {
      return user.consultationUsage < featureConfig.limit;
    }
  }
  
  return !!featureConfig;
}

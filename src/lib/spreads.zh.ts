import { Spread } from "@/types/tarot";

export const SPREADS_ZH: Spread[] = [
  {
    id: "single",
    name: "单张牌",
    description: "简单的解读，用于快速回答或每日指引。",
    detail: "最适合新手，快速获得灵感和指引。",
    difficulty: "beginner" as const,
    recommended: true,
    tags: ["日常", "快速", "新手推荐"],
    positions: [
      { id: "1", name: "牌", description: "你寻求的答案或指引。", x: 50, y: 50 }
    ]
  },
  {
    id: "three-card",
    name: "过去、现在、未来",
    description: "经典的牌阵，用于理解情况的时间线。",
    detail: "探索问题的起源、当前状态和可能的发展方向。",
    difficulty: "easy" as const,
    recommended: true,
    tags: ["时间线", "通用", "新手推荐"],
    positions: [
      { id: "1", name: "过去", description: "来自过去的影响。", x: 20, y: 50 },
      { id: "2", name: "现在", description: "当前的情况。", x: 50, y: 50 },
      { id: "3", name: "未来", description: "潜在的结果。", x: 80, y: 50 }
    ]
  },
  {
    id: "relationship",
    name: "关系牌阵",
    description: "探索你与他人之间的动态。",
    detail: "深入了解人际关系、感情问题或合作伙伴关系。",
    difficulty: "medium" as const,
    recommended: false,
    tags: ["爱情", "人际关系", "感情"],
    positions: [
      { id: "1", name: "你", description: "你在关系中的角色。", x: 20, y: 50 },
      { id: "2", name: "动态", description: "关系的当前状态。", x: 50, y: 30 },
      { id: "3", name: "对方", description: "对方在关系中的角色。", x: 80, y: 50 }
    ]
  },
  {
    id: "celtic-cross",
    name: "凯尔特十字",
    description: "全面的牌阵，用于深入洞察复杂情况。",
    detail: "塔罗牌最著名的牌阵之一，全方位分析复杂问题的各个方面。",
    difficulty: "advanced" as const,
    recommended: false,
    tags: ["深度", "复杂问题", "全面分析"],
    positions: [
      { id: "1", name: "现状", description: "情况的核心。", x: 35, y: 50 },
      { id: "2", name: "挑战", description: "阻碍你的因素。", x: 35, y: 50 },
      { id: "3", name: "基础", description: "事情的基础。", x: 35, y: 75 },
      { id: "4", name: "过去", description: "正在消退的影响。", x: 15, y: 50 },
      { id: "5", name: "顶点", description: "可能的结果/目标。", x: 35, y: 25 },
      { id: "6", name: "未来", description: "即将到来的影响。", x: 55, y: 50 },
      { id: "7", name: "自我", description: "你的态度。", x: 80, y: 85 },
      { id: "8", name: "环境", description: "他人的影响。", x: 80, y: 65 },
      { id: "9", name: "希望与恐惧", description: "心理状态。", x: 80, y: 45 },
      { id: "10", name: "结果", description: "最终结果。", x: 80, y: 25 }
    ]
  }
];

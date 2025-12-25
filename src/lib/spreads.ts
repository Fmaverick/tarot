import { Spread } from "@/types/tarot";

export const SPREADS: Spread[] = [
  {
    id: "single",
    name: "Single Card",
    description: "A simple reading for a quick answer or daily guidance.",
    detail: "Perfect for beginners, quick insights and daily guidance.",
    difficulty: "beginner",
    recommended: true,
    tags: ["Daily", "Quick", "Beginner Friendly"],
    positions: [
      { id: "1", name: "The Card", description: "The answer or guidance you seek.", x: 50, y: 50 }
    ]
  },
  {
    id: "three-card",
    name: "Past, Present, Future",
    description: "A classic spread to understand the timeline of a situation.",
    detail: "Explore the origins, current state, and potential future of your question.",
    difficulty: "easy",
    recommended: true,
    tags: ["Timeline", "General", "Beginner Friendly"],
    positions: [
      { id: "1", name: "Past", description: "Influences from the past.", x: 20, y: 50 },
      { id: "2", name: "Present", description: "The current situation.", x: 50, y: 50 },
      { id: "3", name: "Future", description: "The potential outcome.", x: 80, y: 50 }
    ]
  },
  {
    id: "relationship",
    name: "Relationship Spread",
    description: "Explore the dynamics between you and another.",
    detail: "Deep dive into personal relationships, romantic interests, or partnerships.",
    difficulty: "medium",
    recommended: false,
    tags: ["Love", "Relationships", "Romance"],
    positions: [
      { id: "1", name: "You", description: "Your role in the relationship.", x: 20, y: 50 },
      { id: "2", name: "Dynamics", description: "The current state of the relationship.", x: 50, y: 30 },
      { id: "3", name: "Them", description: "Their role in the relationship.", x: 80, y: 50 }
    ]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description: "A comprehensive spread for deep insight into complex situations.",
    detail: "One of the most famous Tarot spreads for comprehensive analysis of complex issues.",
    difficulty: "advanced",
    recommended: false,
    tags: ["Deep", "Complex Issues", "Comprehensive"],
    positions: [
      { id: "1", name: "The Present", description: "The core of the situation.", x: 35, y: 50 },
      { id: "2", name: "The Challenge", description: "What crosses you (obstacle).", x: 35, y: 50 }, // Overlapping 1
      { id: "3", name: "The Foundation", description: "Basis of the matter.", x: 35, y: 75 },
      { id: "4", name: "The Past", description: "Receding influence.", x: 15, y: 50 },
      { id: "5", name: "The Crown", description: "Possible outcome/Goal.", x: 35, y: 25 },
      { id: "6", name: "The Future", description: "Approaching influence.", x: 55, y: 50 },
      { id: "7", name: "Self", description: "Your attitude.", x: 80, y: 85 },
      { id: "8", name: "Environment", description: "Others' influence.", x: 80, y: 65 },
      { id: "9", name: "Hopes & Fears", description: "Psychological state.", x: 80, y: 45 },
      { id: "10", name: "Outcome", description: "Final result.", x: 80, y: 25 }
    ]
  }
];

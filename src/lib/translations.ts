
export const translations = {
  en: {
    app: {
      title: "Aether Tarot",
      reset: "Reset Reading",
      settings: "AI Settings",
      lang_switch: "Switch Language",
    },
    spreadSelector: {
      label: "Select Spread",
      title: "Choose your path of inquiry",
      cards_count: "Cards",
    },
    chat: {
      placeholder: "Ask about your reading...",
      placeholder_start: "Ask your question...",
      placeholder_followup: "Ask a follow-up...",
      analyzing: "Analyzing the cards...",
      empty_state: "Your reading is ready. Ask any questions about the cards or spread.",
      interpret_button: "Interpret Reading",
    },
    deck: {
      draw_instruction: "Draw a card",
      drag_instruction: "Drag cards to the spread",
      shuffle_instruction: "Shuffle the deck",
    },
    settings: {
      title: "AI Configuration",
      api_key: "API Key",
      base_url: "Base URL",
      model: "Model",
      save: "Save Configuration",
      cancel: "Cancel",
    }
  },
  zh: {
    app: {
      title: "以太塔罗",
      reset: "重置解读",
      settings: "AI 设置",
      lang_switch: "切换语言",
    },
    spreadSelector: {
      label: "选择牌阵",
      title: "选择你的探索路径",
      cards_count: "张牌",
    },
    chat: {
      placeholder: "询问关于解读的问题...",
      placeholder_start: "输入你的问题...",
      placeholder_followup: "追问...",
      analyzing: "正在分析牌面...",
      empty_state: "解读已就绪。你可以询问关于牌面或牌阵的任何问题。",
      interpret_button: "解读牌阵",
    },
    deck: {
      draw_instruction: "抽取一张牌",
      drag_instruction: "拖动牌到牌阵",
      shuffle_instruction: "洗牌",
    },
    settings: {
      title: "AI 配置",
      api_key: "API Key",
      base_url: "Base URL",
      model: "模型",
      save: "保存配置",
      cancel: "取消",
    }
  }
};

export type Language = 'en' | 'zh';
export type Translation = typeof translations.en;

export const getTranslation = (lang: Language): Translation => {
  return translations[lang] || translations.en;
};


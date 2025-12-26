
export const translations = {
  en: {
    app: {
      title: "Aether Tarot",
      subtitle: "Mystic insights through the veil of digital consciousness",
      start: "Begin Consultation",
      reset: "Reset Reading",
      lang_switch: "Switch Language",
    },
    hero: {
        title: "The Oracle of Aether",
        subtitle: "Ancient wisdom meets digital consciousness. Ask the cards, and they shall answer.",
        cta: "Select a Spread",
    },
    spreadSelector: {
      label: "Select Spread",
      title: "Choose your path of inquiry",
      cards_count: "Cards",
      description_hint: "Choose a spread that fits your question. Beginners start with Single Card or Three Card Spread",
      recommended: "Recommended",
      difficulty: {
        beginner: "Beginner",
        easy: "Easy",
        medium: "Medium",
        advanced: "Advanced",
      },
    },
    chat: {
      placeholder: "Ask about your reading...",
      placeholder_start: "Ask your question...",
      placeholder_followup: "Ask a follow-up...",
      analyzing: "Analyzing the cards...",
      empty_state: "Your reading is ready. Ask any questions about the cards or spread.",
      interpret_button: "Interpret Reading",
      share_button: "Share Conversation",
      select_mode_title: "Select Messages",
      cancel_select: "Cancel",
      confirm_share: "Share Selected",
    },
    share: {
      title: "Share Reading",
      cards_list: "Placed Cards",
      dialogue: "Dialogue",
      copy_text: "Copy Text",
      download_image: "Download Image",
      copied: "Copied!",
      close: "Close",
      preview: "Preview",
      quote_action: "Share Quote",
      quote_title: "Share Quote",
      save_image: "Save Image",
    },
    deck: {
      draw_instruction: "Draw a card",
      drag_instruction: "Drag cards to the spread",
      shuffle_instruction: "Shuffle the deck",
    },
    question: {
      title: "Focus on your question",
      subtitle: "Hold the question in your mind as you prepare to draw",
      button: "Begin Drawing",
      current: "Current Question",
      presets: [
        "What should I know about my career?",
        "How can I improve my relationship?",
        "What is blocking my growth?",
        "Daily guidance for today",
        "What is the outcome of this situation?"
      ]
    },
    auth: {
      login_required: "Sign in to Consult",
      login_message: "Please sign in to start the AI interpretation of your spread.",
      login_action: "Sign In",
      cancel: "Cancel",
      account: "Account",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      email_placeholder: "m@example.com",
      error_generic: "An error occurred",
      history_title: "Reading History",
      no_history: "No readings yet.",
      credits: "Credits",
      history: "History",
      logout: "Logout",
    },
  },
  zh: {
    app: {
      title: "以太塔罗",
      subtitle: "透过数字意识的帷幕，探寻神秘洞见",
      start: "开始咨询",
      reset: "重置解读",
      lang_switch: "切换语言",
    },
    hero: {
        title: "以太神谕",
        subtitle: "古老智慧与数字意识的交汇。叩问塔罗，静听回响。",
        cta: "选择牌阵",
    },
    spreadSelector: {
      label: "选择牌阵",
      title: "选择你的探索路径",
      cards_count: "张牌",
      description_hint: "选择适合你问题的牌阵，新手推荐从单张牌或三张牌开始",
      recommended: "推荐",
      difficulty: {
        beginner: "入门",
        easy: "简单",
        medium: "中等",
        advanced: "高级",
      },
    },
    chat: {
      placeholder: "关于解读结果的提问...",
      placeholder_start: "输入你的问题...",
      placeholder_followup: "追问...",
      analyzing: "正在分析牌面...",
      empty_state: "解读已就绪。你可以询问任何关于牌面或牌阵的问题。",
      interpret_button: "开始解读",
      share_button: "分享对话",
      select_mode_title: "选择对话",
      cancel_select: "取消",
      confirm_share: "分享选中内容",
    },
    share: {
      title: "分享解读",
      cards_list: "牌面",
      dialogue: "对话",
      copy_text: "复制文本",
      download_image: "下载图片",
      copied: "已复制！",
      close: "关闭",
      preview: "预览",
      quote_action: "分享金句",
      quote_title: "分享金句",
      save_image: "保存图片",
    },
    deck: {
      draw_instruction: "抽取一张牌",
      drag_instruction: "拖动牌到牌阵",
      shuffle_instruction: "洗牌",
    },
    question: {
      title: "心中默念你的问题",
      subtitle: "保持专注，将你的意念注入即将抽取的卡牌中",
      button: "开始抽牌",
      current: "当前问题",
      presets: [
        "关于事业发展，我需要知道什么？",
        "我该如何改善亲密关系？",
        "当下什么在阻碍我的成长？",
        "今日指引",
        "这件事的结果会如何？"
      ]
    },
    auth: {
      login_required: "登录以咨询",
      login_message: "请登录以开始 AI 解读。",
      login_action: "登录",
      cancel: "取消",
      account: "账户",
      login: "登录",
      register: "注册",
      email: "邮箱",
      password: "密码",
      email_placeholder: "m@example.com",
      error_generic: "发生错误",
      history_title: "解读历史",
      no_history: "暂无解读记录",
      credits: "积分",
      history: "历史",
      logout: "退出登录",
    },
  }
};

export type Language = 'en' | 'zh';
export type Translation = typeof translations.en;

export const getTranslation = (lang: Language): Translation => {
  return translations[lang] || translations.en;
};


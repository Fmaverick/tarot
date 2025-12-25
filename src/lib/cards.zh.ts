import { TarotCard } from "@/types/tarot";
import { CARDS } from "./cards";

const cardTranslations: Record<string, Partial<TarotCard>> = {
  "major-0": {
    name: "愚者",
    meaning_upright: "新的开始，纯真，自发性，自由精神",
    meaning_reversed: "鲁莽，冒险，不成熟",
    description: "一个年轻人走向悬崖边缘，仰望天空。"
  },
  "major-1": {
    name: "魔术师",
    meaning_upright: "显化，足智多谋，力量，灵感行动",
    meaning_reversed: "操纵，计划不周，未开发的才能",
    description: "一个人一手指天，一手指地。"
  },
  "major-2": {
    name: "女祭司",
    meaning_upright: "直觉，神圣知识，神圣女性，潜意识",
    meaning_reversed: "秘密，与直觉断联，退缩和沉默",
    description: "一位女性坐在两根柱子之间，手持卷轴。"
  },
  "major-3": {
    name: "皇后",
    meaning_upright: "女性气质，美丽，自然，滋养，丰富",
    meaning_reversed: "创造力受阻，依赖他人",
    description: "一位母亲般的人物坐在被大自然包围的宝座上。"
  },
  "major-4": {
    name: "皇帝",
    meaning_upright: "权威，建立，结构，父亲形象",
    meaning_reversed: "支配，过度控制，缺乏纪律，僵化",
    description: "一位坚忍的统治者坐在装饰着羊头的石座上。"
  },
  "major-5": {
    name: "教皇",
    meaning_upright: "精神智慧，宗教信仰，从众，传统，机构",
    meaning_reversed: "个人信仰，自由，挑战现状",
    description: "一位宗教人物坐在神圣殿堂的两根柱子之间。"
  },
  "major-6": {
    name: "恋人",
    meaning_upright: "爱，和谐，关系，价值观一致，选择",
    meaning_reversed: "自爱，不和谐，不平衡，价值观不一致",
    description: "一男一女赤身裸体地站在天使之下。"
  },
  "major-7": {
    name: "战车",
    meaning_upright: "控制，意志力，成功，行动，决心",
    meaning_reversed: "自律，对立，缺乏方向",
    description: "一位战士站在战车内，由两只斯芬克斯驾驶。"
  },
  "major-8": {
    name: "力量",
    meaning_upright: "力量，勇气，说服力，影响力，同情心",
    meaning_reversed: "内在力量，自我怀疑，低能量，原始情感",
    description: "一位女性温柔地抚摸狮子，用同情心驯服它。"
  },
  "major-9": {
    name: "隐士",
    meaning_upright: "反省，内省，独处，内在指引",
    meaning_reversed: "孤立，孤独，退缩",
    description: "一位老人独自站在山顶，手持灯笼。"
  },
  "major-10": {
    name: "命运之轮",
    meaning_upright: "好运，业力，生命周期，命运，转折点",
    meaning_reversed: "厄运，抗拒改变，打破循环",
    description: "一个巨大的轮子在天空中旋转，周围有各种生物和符号。"
  },
  "major-11": {
    name: "正义",
    meaning_upright: "正义，公平，真理，因果，法律",
    meaning_reversed: "不公平，缺乏责任感，不诚实",
    description: "一个人坐在紫色帷幕前，手持剑和天平。"
  },
  "major-12": {
    name: "倒吊人",
    meaning_upright: "暂停，投降，放手，新视角",
    meaning_reversed: "拖延，抗拒，停滞，犹豫不决",
    description: "一个人倒挂在树上，看起来很安详。"
  },
  "major-13": {
    name: "死神",
    meaning_upright: "结束，改变，转变，过渡",
    meaning_reversed: "抗拒改变，个人转变，无法继续前进",
    description: "一副身穿盔甲的骷髅骑着白马。"
  },
  "major-14": {
    name: "节制",
    meaning_upright: "平衡，适度，耐心，目标",
    meaning_reversed: "不平衡，过度，自我疗愈，重新调整",
    description: "一位天使一只脚在陆地上，一只脚在水中，在杯子之间倒着液体。"
  },
  "major-15": {
    name: "恶魔",
    meaning_upright: "阴影自我，依恋，成瘾，限制，性",
    meaning_reversed: "释放限制性信念，探索黑暗思想，超脱",
    description: "一个有角的形象坐在被铁链锁住的一男一女上方。"
  },
  "major-16": {
    name: "高塔",
    meaning_upright: "突然改变，剧变，混乱，启示，觉醒",
    meaning_reversed: "个人转变，恐惧改变，避免灾难",
    description: "闪电击中一座高塔，人们从中坠落。"
  },
  "major-17": {
    name: "星星",
    meaning_upright: "希望，信仰，目标，更新，灵性",
    meaning_reversed: "缺乏信仰，绝望，自我信任，断联",
    description: "一位赤身裸体的女性跪在星空下的水池边。"
  },
  "major-18": {
    name: "月亮",
    meaning_upright: "幻觉，恐惧，焦虑，潜意识，直觉",
    meaning_reversed: "释放恐惧，压抑的情感，内心困惑",
    description: "一轮满月照耀在两座塔之间的小径上。"
  },
  "major-19": {
    name: "太阳",
    meaning_upright: "积极，乐趣，温暖，成功，活力",
    meaning_reversed: "内在小孩，情绪低落，过度乐观",
    description: "灿烂的阳光照耀着骑白马的小孩。"
  },
  "major-20": {
    name: "审判",
    meaning_upright: "审判，重生，内在召唤，赦免",
    meaning_reversed: "自我怀疑，内在批评，忽视召唤",
    description: "一位天使吹响号角，人们从坟墓中升起。"
  },
  "major-21": {
    name: "世界",
    meaning_upright: "完成，整合，成就，旅行",
    meaning_reversed: "寻求个人了结，捷径，延误",
    description: "一个人在月桂花环中跳舞，周围环绕着四种生物。"
  },
  // Wands (权杖)
  "wands-1": {
    name: "权杖一",
    meaning_upright: "灵感，新机会，成长，潜力",
    meaning_reversed: "新兴的想法，缺乏方向，分心",
    description: "一只手握着发芽的权杖。"
  },
  "wands-2": {
    name: "权杖二",
    meaning_upright: "未来规划，进步，决定，发现",
    meaning_reversed: "个人目标，内心调整，对未知的恐惧",
    description: "一个人手持地球仪和权杖，向外眺望。"
  },
  "wands-3": {
    name: "权杖三",
    meaning_upright: "进步，扩张，远见，海外机会",
    meaning_reversed: "谨慎行事，限制，缺乏进步",
    description: "一个人背对我们站立，眺望着海上的船只。"
  },
  "wands-4": {
    name: "权杖四",
    meaning_upright: "庆祝，欢乐，和谐，放松，回家",
    meaning_reversed: "个人庆祝，内心和谐，家庭冲突",
    description: "两个人举着花束在四根权杖下庆祝。"
  },
  "wands-5": {
    name: "权杖五",
    meaning_upright: "冲突，分歧，竞争，紧张，多样性",
    meaning_reversed: "避免冲突，尊重差异，内心冲突",
    description: "五个人挥舞着权杖，似乎在争斗。"
  },
  "wands-6": {
    name: "权杖六",
    meaning_upright: "成功，公众认可，进步，自信",
    meaning_reversed: "私下的成就，个人定义成功，自我怀疑",
    description: "一个人骑着马穿过人群，头戴桂冠。"
  },
  "wands-7": {
    name: "权杖七",
    meaning_upright: "挑战，竞争，保护，坚持",
    meaning_reversed: "疲惫，放弃，不知所措",
    description: "一个人站在高处，防御着下方的六根权杖。"
  },
  "wands-8": {
    name: "权杖八",
    meaning_upright: "速度，行动，空中旅行，快速移动",
    meaning_reversed: "延误，挫折，抵制变革，恐慌",
    description: "八根权杖在空中快速飞过。"
  },
  "wands-9": {
    name: "权杖九",
    meaning_upright: "韧性，勇气，坚持，信仰的考验",
    meaning_reversed: "精疲力竭，防御性，犹豫，挣扎",
    description: "一个受伤的人靠在一根权杖上，身后还有八根。"
  },
  "wands-10": {
    name: "权杖十",
    meaning_upright: "负担，额外的责任，努力工作，完成",
    meaning_reversed: "独自承担，无法承受，崩溃",
    description: "一个人费力地搬运着十根沉重的权杖。"
  },
  "wands-page": {
    name: "权杖侍从",
    meaning_upright: "灵感，想法，发现，无限可能，自由精神",
    meaning_reversed: "新想法受阻，缺乏动力，精力分散",
    description: "一个年轻人崇敬地看着一根权杖。"
  },
  "wands-knight": {
    name: "权杖骑士",
    meaning_upright: "能量，激情，灵感，行动，冲动",
    meaning_reversed: "冲动，鲁莽，急躁，分散精力",
    description: "一位骑士骑着马飞奔，手持权杖。"
  },
  "wands-queen": {
    name: "权杖王后",
    meaning_upright: "勇气，自信，独立，社交魅力，决心",
    meaning_reversed: "自我尊重，自信心缩水，内向",
    description: "一位王后坐在装饰着狮子的宝座上，手持权杖和向日葵。"
  },
  "wands-king": {
    name: "权杖国王",
    meaning_upright: "自然产生的领导力，远见，企业家，荣誉",
    meaning_reversed: "冲动，鲁莽，专横，高期望",
    description: "一位国王坐在装饰着狮子和蜥蜴的宝座上，手持权杖。"
  },

  // Cups (圣杯)
  "cups-1": {
    name: "圣杯一",
    meaning_upright: "爱，新感觉，情感觉醒，直觉",
    meaning_reversed: "自爱，压抑情感，情感受阻",
    description: "一只手托着溢出水的圣杯，鸽子衔着十字酥落下。"
  },
  "cups-2": {
    name: "圣杯二",
    meaning_upright: "统一，伙伴关系，吸引力，连接",
    meaning_reversed: "自爱，关系破裂，不和谐",
    description: "一男一女交换圣杯，象征着结合。"
  },
  "cups-3": {
    name: "圣杯三",
    meaning_upright: "庆祝，友谊，创造力，合作",
    meaning_reversed: "独立，独处时间，过度放纵，八卦",
    description: "三个女子举杯庆祝，周围是丰收的果实。"
  },
  "cups-4": {
    name: "圣杯四",
    meaning_upright: "冥想，沉思，冷漠，重新评估",
    meaning_reversed: "撤退，检查，错过机会",
    description: "一个人坐在树下，忽视了递过来的第四个圣杯。"
  },
  "cups-5": {
    name: "圣杯五",
    meaning_upright: "后悔，失败，失望，悲观",
    meaning_reversed: "个人挫折，自我原谅，继续前进",
    description: "一个人看着三个倒下的圣杯，身后有两个立着的。"
  },
  "cups-6": {
    name: "圣杯六",
    meaning_upright: "重温回忆，童年，纯真，快乐",
    meaning_reversed: "活在过去，原谅，缺乏玩乐",
    description: "两个孩子在花园里分享圣杯，充满怀旧气息。"
  },
  "cups-7": {
    name: "圣杯七",
    meaning_upright: "机会，选择，愿望，幻觉",
    meaning_reversed: "对齐价值观，不知所措，选择困难",
    description: "一个人看着云中的七个圣杯，每个装着不同的东西。"
  },
  "cups-8": {
    name: "圣杯八",
    meaning_upright: "失望，放弃，退缩，寻找真理",
    meaning_reversed: "尝试再试一次，犹豫不决，漫无目的，逃避",
    description: "一个人背对着八个圣杯，走向远山。"
  },
  "cups-9": {
    name: "圣杯九",
    meaning_upright: "满足，愿望成真，感激，奢侈",
    meaning_reversed: "内在快乐，唯物主义，不满，放纵",
    description: "一个人满意地坐在九个圣杯前。"
  },
  "cups-10": {
    name: "圣杯十",
    meaning_upright: "神圣的爱，幸福的关系，和谐，对齐",
    meaning_reversed: "断联，错位的价值观，挣扎的关系",
    description: "一家人在彩虹下的十个圣杯前欢呼。"
  },
  "cups-page": {
    name: "圣杯侍从",
    meaning_upright: "创意机会，直觉信息，好奇心",
    meaning_reversed: "新想法受阻，情感不成熟，创意受阻",
    description: "一个年轻人看着圣杯中探出的鱼。"
  },
  "cups-knight": {
    name: "圣杯骑士",
    meaning_upright: "创造力，浪漫，魅力，想象力，美",
    meaning_reversed: "过度活跃的想象力，不切实际，嫉妒，喜怒无常",
    description: "一位骑士骑着马，优雅地举着圣杯。"
  },
  "cups-queen": {
    name: "圣杯王后",
    meaning_upright: "富有同情心，关怀，情感稳定，直觉",
    meaning_reversed: "情感不安全，相互依赖，殉道者",
    description: "一位王后注视着一个装饰华丽的圣杯。"
  },
  "cups-king": {
    name: "圣杯国王",
    meaning_upright: "情感平衡，控制，慷慨，外交",
    meaning_reversed: "情绪操纵，喜怒无常，压抑情感",
    description: "一位国王坐在波涛汹涌的海中的宝座上，手持圣杯。"
  },

  // Swords (宝剑)
  "swords-1": {
    name: "宝剑一",
    meaning_upright: "突破，新想法，清晰，成功",
    meaning_reversed: "思维混乱，混乱，缺乏清晰度",
    description: "一只手从云中伸出，握着一把剑，剑尖穿过皇冠。"
  },
  "swords-2": {
    name: "宝剑二",
    meaning_upright: "艰难的决定，权衡选择，僵局，回避",
    meaning_reversed: "犹豫不决，困惑，信息过载",
    description: "一个蒙眼的人拿着两把交叉的剑，坐在水边。"
  },
  "swords-3": {
    name: "宝剑三",
    meaning_upright: "心碎，情感痛苦，悲伤，伤害",
    meaning_reversed: "消极的自言自语，释放痛苦，乐观",
    description: "一颗心被三把剑穿透，背景是雨云。"
  },
  "swords-4": {
    name: "宝剑四",
    meaning_upright: "休息，恢复，沉思，被动",
    meaning_reversed: "精疲力竭，倦怠，压力",
    description: "一位骑士躺在墓穴上休息，墙上挂着三把剑。"
  },
  "swords-5": {
    name: "宝剑五",
    meaning_upright: "冲突，分歧，竞争，失败，赢得不光彩",
    meaning_reversed: "和解，做出弥补，怨恨",
    description: "一个人拿着三把剑看着两个失败者离开。"
  },
  "swords-6": {
    name: "宝剑六",
    meaning_upright: "过渡，改变，释放包袱，移动",
    meaning_reversed: "个人转变，抗拒改变，未解决的问题",
    description: "一个人划着船带着两个人离开，船上插着六把剑。"
  },
  "swords-7": {
    name: "宝剑七",
    meaning_upright: "背叛，欺骗，侥幸逃脱，策略",
    meaning_reversed: "坦白，良心发现，被抓包",
    description: "一个人鬼鬼祟祟地带着五把剑溜走。"
  },
  "swords-8": {
    name: "宝剑八",
    meaning_upright: "消极思想，自我设限，受害者心态",
    meaning_reversed: "自我接受，新的视角，释放",
    description: "一个被蒙眼和束缚的人站在八把剑中间。"
  },
  "swords-9": {
    name: "宝剑九",
    meaning_upright: "焦虑，担心，恐惧，抑郁，噩梦",
    meaning_reversed: "内心动荡，极度恐惧，秘密",
    description: "一个人坐在床上掩面哭泣，墙上挂着九把剑。"
  },
  "swords-10": {
    name: "宝剑十",
    meaning_upright: "痛苦的结局，背叛，损失，危机",
    meaning_reversed: "恢复，再生，抵抗不可避免的事",
    description: "一个人趴在地上，背上插着十把剑。"
  },
  "swords-page": {
    name: "宝剑侍从",
    meaning_upright: "新想法，好奇心，渴望知识，沟通",
    meaning_reversed: "自我表达，只说不做，做事草率",
    description: "一个年轻人手持宝剑，看起来准备好行动。"
  },
  "swords-knight": {
    name: "宝剑骑士",
    meaning_upright: "雄心勃勃，行动导向，成功驱动，思维敏捷",
    meaning_reversed: "焦躁，注意力不集中，冲动，倦怠",
    description: "一位骑士骑着马冲锋，手持宝剑。"
  },
  "swords-queen": {
    name: "宝剑王后",
    meaning_upright: "独立，公正判断，清晰界限，直接沟通",
    meaning_reversed: "情绪化，易受影响，冷酷，尖酸刻薄",
    description: "一位王后坐在宝座上，手持宝剑。"
  },
  "swords-king": {
    name: "宝剑国王",
    meaning_upright: "头脑清晰，智力，权威，真理",
    meaning_reversed: "安静的力量，内在真理，滥用职权，操纵",
    description: "一位国王坐在宝座上，手持宝剑，表情严肃。"
  },

  // Pentacles (星币)
  "pentacles-1": {
    name: "星币一",
    meaning_upright: "新机会，繁荣，显化，丰富",
    meaning_reversed: "失去机会，缺乏计划和远见",
    description: "一只手从云中伸出，托着一枚巨大的星币。"
  },
  "pentacles-2": {
    name: "星币二",
    meaning_upright: "多重优先事项，时间管理，适应性",
    meaning_reversed: "过度承诺，杂乱无章，重新排序",
    description: "一个人在杂耍两枚星币，背景是起伏的波浪。"
  },
  "pentacles-3": {
    name: "星币三",
    meaning_upright: "团队合作，协作，学习，实施",
    meaning_reversed: "不和谐，各自为政，缺乏凝聚力",
    description: "一位雕刻师在教堂工作，两名僧侣拿着图纸。"
  },
  "pentacles-4": {
    name: "星币四",
    meaning_upright: "省钱，安全感，保守，稀缺，控制",
    meaning_reversed: "过度消费，贪婪，自我保护",
    description: "一个人紧紧抱住四枚星币。"
  },
  "pentacles-5": {
    name: "星币五",
    meaning_upright: "经济损失，贫穷，孤立，担忧",
    meaning_reversed: "从经济损失中恢复，精神贫乏",
    description: "两个衣衫褴褛的人在雪中走过教堂窗户。"
  },
  "pentacles-6": {
    name: "星币六",
    meaning_upright: "给予，接受，分享财富，慷慨，慈善",
    meaning_reversed: "自我照顾，无偿债务，单向给予",
    description: "一位商人向乞丐施舍钱币。"
  },
  "pentacles-7": {
    name: "星币七",
    meaning_upright: "长远眼光，坚持不懈，投资，可持续结果",
    meaning_reversed: "缺乏长期愿景，成果有限，分心",
    description: "一个人倚着锄头，看着藤蔓上的七枚星币。"
  },
  "pentacles-8": {
    name: "星币八",
    meaning_upright: "学徒，重复，精通，技能发展",
    meaning_reversed: "自我发展，完美主义，缺乏重点",
    description: "一个人专注地雕刻星币。"
  },
  "pentacles-9": {
    name: "星币九",
    meaning_upright: "富足，奢华，自给自足，财务独立",
    meaning_reversed: "自我价值，过度工作，过度投资",
    description: "一位优雅的女性站在充满果实的花园中。"
  },
  "pentacles-10": {
    name: "星币十",
    meaning_upright: "财富，遗产，家庭，长期成功",
    meaning_reversed: "财务失败或损失，阴暗面",
    description: "一家人站在拱门下，周围有十枚星币。"
  },
  "pentacles-page": {
    name: "星币侍从",
    meaning_upright: "显化，财务机会，技能发展",
    meaning_reversed: "缺乏进展，拖延，从错误中学习",
    description: "一个年轻人专注地看着手中的星币。"
  },
  "pentacles-knight": {
    name: "星币骑士",
    meaning_upright: "努力工作，生产力，常规，保守",
    meaning_reversed: "自律，无聊，感到受困，完美主义",
    description: "一位骑士骑着重马，手持星币。"
  },
  "pentacles-queen": {
    name: "星币王后",
    meaning_upright: "滋养，务实，提供经济支持，职场父母",
    meaning_reversed: "经济独立，自我照顾，工作家庭冲突",
    description: "一位王后坐在自然环绕的宝座上，手持星币。"
  },
  "pentacles-king": {
    name: "星币国王",
    meaning_upright: "财富，商业，领导力，安全感，纪律",
    meaning_reversed: "财务无能，痴迷财富和地位，固执",
    description: "一位国王坐在装饰着公牛的宝座上，手持星币。"
  }
};

export const CARDS_ZH: TarotCard[] = CARDS.map(card => {
  const trans = cardTranslations[card.id];
  if (trans) {
    return { ...card, ...trans };
  }
  
  // Minor Arcana Name Translation Logic
  let name = card.name;
  if (card.arcana === 'minor' && card.name.includes(" of ")) {
    const [rank, suit] = card.name.split(" of ");
    const suitZh = { "Wands": "权杖", "Cups": "圣杯", "Swords": "宝剑", "Pentacles": "星币" }[suit] || suit;
    const rankZh = { 
        "Ace": "一", "Two": "二", "Three": "三", "Four": "四", "Five": "五", 
        "Six": "六", "Seven": "七", "Eight": "八", "Nine": "九", "Ten": "十",
        "Page": "侍从", "Knight": "骑士", "Queen": "王后", "King": "国王"
    }[rank] || rank;
    name = `${suitZh}${rankZh}`;
  }

  return { ...card, name };
});

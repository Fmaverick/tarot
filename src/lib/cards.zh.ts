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

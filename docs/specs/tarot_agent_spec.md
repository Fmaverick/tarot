# Tarot Agent 功能开发文档

## 1. 概述
**Tarot Agent** 为应用引入了“定制模式”（Custom Mode）。与现有的固定牌阵模式不同，定制模式允许进行动态的、对话式的交互，AI Agent 会根据用户的意图决定最佳的行动方案。

### 核心特性
- **动态牌阵生成**：Agent 根据用户的具体问题设计定制的牌阵。
- **自适应流程**：Agent 根据对话历史决定是设计新牌阵还是直接根据现有信息回答。
- **卡牌管理模式**：
  - **宏观模式 (默认)**：每次牌阵都使用一副完整的、全新的 78 张塔罗牌。
  - **微观模式 (占位符)**：整个会话使用同一副牌。已抽出的卡牌会从可用牌库中移除。（作为后续扩展的占位符）。

---

## 2. 用户流程

### 2.1 初始交互
1. **用户入口**：用户从主屏幕选择“定制模式”。
2. **意图输入**：用户输入他们的问题或处境（例如，“我对我的职业生涯感到迷茫”）。
3. **Agent 规划**：
   - 系统调用 Agent 规划 API。
   - **约束**：对于*首次*交互，Agent **必须**设计一个牌阵。
4. **牌阵展示**：UI 渲染动态设计的牌阵（例如，“职业清晰度牌阵”，包含 3 个位置）。
5. **抽牌**：用户为各个位置抽牌。
6. **生成解读**：系统使用动态牌阵和抽出的卡牌生成解读。

### 2.2 交互式聊天流 (Embedded UI)
传统的聊天界面仅包含文本，而 Custom Mode 将采用“富交互流”（Rich Interactive Stream）设计，类似于人生 K 线图的嵌入方式。所有的功能组件（牌阵、抽牌、解读）都将作为“消息气泡”的一部分嵌入在对话流中。

**UI 布局原则**：
- **居中对齐**：核心交互区域（如牌阵）在聊天流中居中显示，占据较宽的视野，提供沉浸感。
- **组件化消息**：不仅仅是文本消息，Agent 可以发送“UI 组件消息”。

**交互流程示例**：
1. **用户**：(文本) "我最近很迷茫..."
2. **Agent**：(文本) "我感受到了你的困惑。让我们通过一个定制牌阵来探索..."
3. **Agent**：(组件 - `DynamicSpreadBoard`)
   - *[界面显示一个空白的牌阵布局]*
   - *[状态：等待抽牌]*
4. **用户**：(动作) 点击牌阵上的卡背进行抽牌。
5. **Agent**：(组件 - 更新状态)
   - *[牌阵更新：卡牌翻转，显示牌面]*
   - *[状态：抽牌完成]*
6. **Agent**：(文本/组件) 开始流式输出解读，并在文本下方可能再次引用关键卡牌的详情。
7. **用户**：(文本) "这张死神牌是什么意思？"
8. **Agent**：(文本 + 小组件) 针对单张牌进行深度解析。

### 2.3 后续交互
1. **用户输入**：用户提出后续问题。
2. **Agent 规划**：
   - 系统调用 Agent 规划 API。
   - Agent 分析当前的卡牌是否足以回答问题。
   - **决策 A (直接回答)**：如果信息充足，Agent 生成直接的文本回复。
   - **决策 B (新牌阵)**：如果问题需要新的洞察，Agent 设计一个新的牌阵（例如，“结果澄清”，包含 1 张卡牌）。
3. **执行**：
   - **如果是 A**：聊天正常继续。
   - **如果是 B**：Agent 发送一个新的 `DynamicSpreadBoard` 组件消息到流中 → 用户在流中直接抽牌 → 生成解读。

---

## 3. 架构设计

### 3.1 后端组件

#### A. Agent 规划 API (`POST /api/agent/plan`)
**目的**：定制模式的“大脑”。它分析上下文并输出结构化的计划。

**请求体**：
```typescript
interface AgentPlanRequest {
  sessionId: string;
  messages: CoreMessage[]; // 聊天历史
  currentSpread?: Spread;  // 当前激活的牌阵（如果有）
  mode: 'macro' | 'micro';
}
```

**响应体**：
```typescript
interface AgentPlanResponse {
  action: 'DESIGN_SPREAD' | 'DIRECT_REPLY';
  
  // 当 action === 'DESIGN_SPREAD' 时存在
  spread?: {
    name: string;
    description: string;
    positions: Array<{
      id: string; // 例如 "pos-1"
      name: string; // 例如 "当前状态"
      description: string; // 例如 "你现在的处境"
      x: number; // 0-100 (用于 UI 布局)
      y: number; // 0-100
    }>;
  };

  // 决策理由 (用于调试/透明度)
  reasoning: string;
}
```

#### B. 上下文管理器 (工具类)
**目的**：管理会话状态，特别是用于“微观”模式的卡牌追踪。

**函数**：
- `getAvailableCards(sessionId: string)`: 返回未抽出的卡牌列表。
- `markCardsAsDrawn(sessionId: string, cardIds: string[])`: 更新会话状态。
- *注意*：对于宏观模式，`getAvailableCards` 总是返回完整的牌组。

### 3.2 前端组件

#### B. `CustomModeView` (页面/容器)
- 包装聊天界面。
- 负责渲染“混合消息流”（Mixed Message Stream）：
  - 文本消息 (`role: user | assistant`)
  - **工具/UI 消息** (`role: assistant, type: tool_call/ui`)：渲染 `DynamicSpreadBoard` 等组件。
- 保持底部输入框常驻。

#### C. `DynamicSpreadBoard` (组件)
- 作为聊天流中的一个“卡片”存在。
- 状态管理：
  - `drawing`：用户抽牌中。
  - `completed`：抽牌完成，展示结果（只读或交互式查看）。
- 样式：宽度自适应，居中显示，具有精致的边框和背景，通过动画平滑进入聊天流。

---

## 4. 实现细节

### 4.0 代码文件结构
为保持代码库整洁，建议使用以下文件路径：

**后端与 API**
- `src/app/api/agent/plan/route.ts` - Agent 规划 API 端点
- `src/lib/agent/context.ts` - 上下文管理器 (Context Manager)
- `src/lib/agent/prompts.ts` - Agent 提示词模板
- `src/types/agent.ts` - Agent 相关的类型定义

**前端页面与组件**
- `src/app/custom/page.tsx` - 定制模式主页面路由
- `src/components/tarot/agent/CustomModeView.tsx` - 定制模式主要视图容器
- `src/components/tarot/agent/DynamicSpreadBoard.tsx` - 动态牌阵渲染组件

### 4.1 数据库 Schema 更新
我们需要存储定制牌阵和模式。

**表：`sessions`**
- 添加 `mode`: `text` ('fixed' | 'custom_macro' | 'custom_micro')
- 添加 `custom_spread_config`: `json` (存储当前的动态牌阵定义)

**表：`session_decks` (新增 - 用于微观模式)**
- `session_id`: uuid (外键)
- `available_cards`: text[] (剩余卡牌 ID 的数组)

### 4.2 Agent Prompts (提示词)

**规划提示词 (System)**：
```text
你是一位专业的塔罗牌阅读者 Agent。你的目标是引导整个会话。
当前模式: {mode} (Macro/Micro)
历史记录: {chat_history}

任务: 决定下一步行动。
1. 如果这是首次交互，你必须设计一个与用户问题相关的牌阵。
2. 如果这是后续交互，判断是否可以使用现有的卡牌/上下文回答，或者是否需要一个新的牌阵。

输出格式: JSON (AgentPlanResponse)
```

**牌阵设计提示词 (System)**：
```text
为以下问题设计一个塔罗牌阵: "{user_question}".
返回一个 JSON 对象，包含:
- name: 富有创意的标题
- description: 简短的意图说明
- positions: 数组 { id, name, description, x, y }
  - x, y 是 100x100 棋盘上的坐标。中心是 50,50。
  - 请视觉化地排列位置（例如，十字形、线性、圆形）。
```

---

## 5. 开发阶段

### 第一阶段：核心 Agent 与宏观模式 (MVP)
1. 实现 `POST /api/agent/plan`。
2. 创建 `DynamicSpreadBoard` 组件。
3. 更新 `ChatInterface` 以处理 `DESIGN_SPREAD` 动作。
4. 确保首轮对话总是触发牌阵设计。

### 第二阶段：微观模式 (占位符)
1. 在 `sessions` 表中添加 `mode` 字段。
2. 实现 `ContextManager` 结构（方法抛出“未实现”或仅返回完整牌组）。
3. 添加 UI 切换宏观/微观模式（禁用或标记为“即将推出”）。

### 第三阶段：优化
1. 改进牌阵布局逻辑（Agent 通常在处理 X/Y 坐标时比较吃力；可能需要预定义的模板库或智能布局算法）。
2. 为 `DIRECT_REPLY` 动作实现流式响应。

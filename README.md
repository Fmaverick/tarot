# Tarot Agent

**An AI-native tarot experience blending interface, narrative, and emotional clarity.**  
**一个融合界面体验、叙事感与情绪可感知性的 AI 原生塔罗产品。**

Tarot Agent is not just a digital card-drawing app. It explores what happens when spiritual interaction, product design, and lightweight intelligence are treated as one cohesive experience.  
Tarot Agent 不只是一个电子抽牌工具，它更像是一个产品实验：把精神性体验、界面设计和轻量智能合成到同一个可感知的产品里。

The goal is simple:
它想回答的问题很简单：

- can AI make guidance feel more personal without becoming noisy  
  AI 能不能让引导更个性化，同时不过度喧闹
- can interaction design make reflection feel immersive and calm  
  交互设计能不能让反思体验更沉浸、更安静
- can consumer-facing AI products feel emotionally legible, not just technically smart  
  面向消费者的 AI 产品，能不能不只“聪明”，还“有感觉”

That is the product bet behind Tarot Agent.  
这就是 Tarot Agent 这款产品背后的核心判断。

## ✨ 核心特性

- **🤖 AI 智能规划 (Custom Mode)**：Agent 会根据用户的具体问题，动态设计最适合的定制牌阵，而非死板的固定模板。
- **🎨 东方极简美学**：遵循“疏朗、宁静、克制”的设计原则，采用大面积留白、精致的排版和柔和的动效，提供沉浸式的冥想体验。
- **🃏 交互式抽牌体验**：支持动态牌阵展示、物理感抽牌交互以及实时流式解读输出。
- **💬 富交互对话流**：将牌阵、抽牌、解读等功能组件无缝嵌入聊天流中，实现如同人生 K 线图般的富媒体交互。
- **🌍 多语言支持**：内置国际化支持，提供中英文双语体验及专业的塔罗牌义库。
- **💳 商业化集成**：集成 Stripe 支付系统，支持订阅制与兑换码，提供完善的用户鉴权与历史记录管理。

## 🛠️ 技术栈

- **框架**: [Next.js 14 (App Router)](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **组件库**: [Shadcn UI](https://ui.shadcn.com/) + Coss UI + AI Elements
- **运行时**: [Bun](https://bun.sh/)
- **数据库/ORM**: [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **AI 能力**: [Vercel AI SDK](https://sdk.vercel.ai/) + OpenAI
- **支付**: [Stripe](https://stripe.com/)
- **认证**: [NextAuth.js](https://next-auth.js.org/)

## 🚀 快速开始

### 1. 安装依赖

推荐使用 `bun` 以获得最佳性能：

```bash
bun install
```

### 2. 环境配置

复制 `.env.example` 为 `.env` 并填写相关配置：

```bash
cp .env.example .env
```

需要配置的关键变量包括：
- `DATABASE_URL`: PostgreSQL 连接字符串
- `OPENAI_API_KEY`: OpenAI API 密钥
- `STRIPE_SECRET_KEY`: Stripe 密钥
- `NEXTAUTH_SECRET`: NextAuth 密钥

### 3. 数据库初始化

运行以下命令进行数据库迁移和基础数据同步：

```bash
bun db:init
bun db:migrate
```

### 4. 启动开发服务器

```bash
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可预览。

## 🎨 设计规范

本项目遵循严格的 [设计规范](.trae/rules/design.md)：
- **色彩**: 基于 OKLCH 空间，以纯白背景（#fff）和纯黑文字（#000）为主。
- **排版**: 使用大字号标题（4xl-6xl），衬线体（font-serif）用于标题，细体（font-light）用于正文。
- **质感**: 苹果风格液态玻璃感（Apple Liquid Glass），背景模糊，半透明表面。

## 📖 文档

- [API 文档](API_DOCS.md)
- [SEO 策略](SEO_STRATEGY.md)
- [Tarot Agent 功能规格](docs/specs/tarot_agent_spec.md)

---

Built with 🖤 by the Tarot Agent Team.

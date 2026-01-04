# Lumin Tarot SEO 优化策略方案

本文档旨在为 Lumin Tarot 网站提供一套全面的 SEO（搜索引擎优化）优化方案，涵盖技术、内容及多语言支持等方面，以提升网站在搜索引擎中的排名和曝光。

## 1. 技术 SEO (Technical SEO)

技术 SEO 是确保搜索引擎能够顺利抓取、索引和理解网站的基础。

### 1.1 Metadata 优化 (Next.js Metadata API)
当前网站主要使用静态 Metadata。应迁移到 Next.js 的动态 Metadata 生成机制。
- **动态标题与描述**：根据当前页面、语言及用户操作（如选中的牌阵）动态生成标题。
- **Open Graph (OG) & Twitter Cards**：优化社交媒体分享时的展示效果，包括 `og:title`, `og:description`, `og:image` 等。
- **Favicon & Icons**：完善不同设备下的图标配置。

### 1.2 多语言路由 (i18n Routing)
目前网站采用客户端状态切换语言，这对 SEO 不利。
- **方案**：采用 Next.js App Router 推荐的路径式路由（如 `/zh`, `/en`）。
- **优势**：
    - 每个语言版本都有独立的 URL，方便搜索引擎分别索引。
    - 使用 `hreflang` 标签告知搜索引擎不同语言版本之间的关系。

### 1.3 站点地图与抓取控制
- **Sitemap.xml**：自动生成站点地图，列出所有关键路径（首页、卡牌详情页、牌阵介绍等）。
- **Robots.txt**：明确规定搜索引擎可以抓取和禁止抓取的路径（如 `/api/`, `/checkout/` 等）。
- **Canonical Tags**：防止重复内容导致的权重分散，确保每个页面都有唯一的规范链接。

### 1.4 结构化数据 (JSON-LD)
添加 Schema.org 结构化数据，帮助搜索引擎在搜索结果中展示富摘要（Rich Snippets）。
- **SoftwareApplication**：描述 Lumin Tarot 作为一个 AI 驱动的塔罗应用。
- **FAQPage**：针对塔罗常见问题添加 FAQ 标记。
- **Service**：描述塔罗咨询服务。

---

## 2. 内容 SEO (Content SEO)

内容是 SEO 的核心，通过丰富、高质量的内容吸引流量。

### 2.1 静态化卡牌与牌阵页面
目前卡牌和牌阵数据仅存在于客户端代码中。
- **优化**：为 78 张塔罗卡牌和每种牌阵创建独立的静态页面（SSG）。
- **内容丰富化**：每个页面包含卡牌含义、正位/逆位解释、历史背景等文字内容。
- **内链策略**：在首页和详情页之间建立合理的内部链接，提升页面权重。

### 2.2 博客与知识库 (Blog/Knowledge Base)
- 建立“塔罗指南”或“神秘学百科”板块。
- 撰写高质量的原创文章（如“2026年运势预测”、“如何解读大阿卡纳”等），通过长尾关键词获取流量。

### 2.3 语义化 HTML
- 确保页面结构遵循语义化标签（`<h1>`, `<h2>`, `<article>`, `<nav>` 等）。
- 所有图片（尤其是塔罗牌图）必须包含描述性的 `alt` 属性。

---

## 3. 性能优化 (Performance & Web Vitals)

加载速度是搜索排名的重要因素。

- **图片优化**：使用 `next/image` 进行自动格式转换（WebP/Avif）和尺寸调整。
- **代码分割**：利用 Next.js 自动代码分割，减少首屏加载时间。
- **减少运行时 JS**：尽可能将组件转化为 Server Components，减少发送到客户端的 JavaScript。

---

## 4. 实施步骤建议

1. **第一阶段 (基础巩固)**：
    - 修复 `layout.tsx` 中的 Metadata。
    - 添加 `robots.txt` 和静态 `sitemap.xml`。
    - 完善图片 `alt` 标签。
2. **第二阶段 (架构调整)**：
    - 实施 `/[locale]` 路径式多语言路由。
    - 添加 JSON-LD 结构化数据。
3. **第三阶段 (内容扩张)**：
    - 开发卡牌详情页模板并进行静态生成。
    - 上线博客系统。

---

## 5. 推荐技术栈

- **Next.js Metadata API**：原生支持。
- **next-intl / next-i18n-router**：处理多语言路由。
- **next-sitemap**：自动生成 Sitemap。
- **Schema-dts**：TypeScript 定义下的 JSON-LD 构建。
- **Vercel Analytics / Google Search Console**：数据监控与分析。

# Lumen

Lumen is a minimalist, SEO‑friendly **WordPress theme** for bilingual (English / 中文) content sites.
Semantic, fast, mobile‑first, and i18n‑ready — with **zero JavaScript** and **no font files**.

[中文](#zh-cn)

---

## What it is

A lightweight **presentation** layer: layout, typography, color, navigation, and Gutenberg block defaults.
Business logic stays in plugins (e.g. the optional *Lumen Blog* companion). Lumen itself ships no JS,
no framework, and no custom font files — just pure CSS on a small set of design tokens.

## Releases

| Version | Status | Intended for |
|---|---|---|
| **1.0.0** | **Stable — `Latest`** | Production. The current recommended release. |
| **1.1.0-beta.1** | **Beta** (pre-release) | Consolidated pre-release of Lumen 1.1.0 (Archive/Search core correctness + text-first design). Not for production. |
| **1.1.0** | Planned | Final stable release. |

> **Commit ≠ Release.** Normal commits land on `main`; intermediate commits create **no** tag, ZIP, or
> GitHub Release. Releases follow the phase route: `1.1.0-dev.11` (final development build, immutable)
> → `1.1.0-beta.1` → (if needed) `beta.2` → `rc.1` → `1.1.0` → `1.1.1+` patch releases.
>
> The **stable** line (`1.0.0`) and the **1.1.0 pre-release** line are separate: 1.0.0 remains the
> *Latest* release until 1.1.0 stabilizes, and every 1.1.0 pre-release (dev, beta, rc) is published
> as a **pre-release** and is never marked Latest. See [Releases](#releases) for the authoritative list.

## Features

- Semantic HTML5 structure (header, nav, main, article, section, footer); single H1 per page.
- **Always‑accessible navigation** — a no‑JS horizontal menu that wraps on mobile (no hamburger, no keyboard trap, works with JS disabled).
- Skip‑to‑content link for keyboard users.
- Gutenberg‑ready via `theme.json` (palette, typography, spacing, block styles).
- Responsive, mobile‑first (desktop / tablet / mobile).
- Accessible: landmarks, skip link, `:focus‑visible` styles, reduced‑motion awareness, lazy‑loaded thumbnails.
- Core Web Vitals friendly: zero JavaScript and minimal CSS.
- Nav menus: **Primary** (header) + **Footer**.
- Post thumbnails (lazy), automatic feed links, RSS in the footer.
- Previous/next post navigation on single posts; comments, search, 404, and archives included.
- i18n ready (text domain `lumen`); `languages/lumen.pot` provided.
- No hardcoded URLs; **no** schema.org microdata (defer to an SEO plugin like Rank Math / Yoast).
- Optional companion plugin **Lumen Blog** (thin bootstrap at 0.1.0).

## Requirements

- WordPress 6.3 or later
- PHP 8.2 or later
- MySQL or MariaDB (MySQL 8 recommended)

## Installation

1. Download / clone the theme folder.
2. In wp‑admin: **Appearance → Themes → Add New → Upload Theme** → select the `lumen‑*.zip` release,
   or clone into `wp‑content/themes/` (the theme folder is `lumen/`).
3. Activate the theme.
4. *(Optional)* Install and activate the **Lumen Blog** companion plugin.
5. **Settings → Reading**: choose *Your latest posts* for the homepage.
6. **Appearance → Menus**: assign the **Primary** menu (header) and **Footer** menu.

## What the 1.1.0 pre-releases add

The `1.1.0-dev.x` line (final development build: **1.1.0-dev.11**, immutable) and the
consolidated pre-release **1.1.0-beta.1** refine the reading experience toward Lumen 1.1.0
without touching the stable line. Recent builds have added (among other things):

- **Archive/Search core correctness** — archive H1 titles derived from Core
  `get_queried_object()` (category / tag / any public custom taxonomy / author / date archives
  via `wp_date()`), localized context labels ("Category · N posts", "Tag · N posts",
  "Author · N posts", "N posts" — singular/plural via `_n()`), term/author descriptions,
  and context-aware list order (archive: meta → title → excerpt; search: title → meta →
  excerpt).
- **Search page** — dedicated `search.php` with "N result(s) for 'query'" counts (localized,
  always shown even at 0 hits) and a form that submits to `home_url('/')`.
- **Homepage metadata typography** — the date / category line is set in the FangSong reading font
  (small, muted, secondary; no layout change).
- **Header / footer interaction feedback** — soft‑background hover on header nav and footer
  RSS/menu links, a persistent current‑page/category active state, and a subtle site‑title hover.

The current build and full changelog: [GitHub Releases](https://github.com/wwintj/lumen/releases).

Stable **1.0.0** is unchanged and remains the production "Latest" release.

## Repository layout

```
lumen/                  # the theme (wp-content/themes/lumen)
  style.css             # design tokens + reset + base typography + theme header
  functions.php         # LUMEN_VERSION constant + inc/ loading
  theme.json            # Gutenberg defaults (version 2)
  header.php footer.php # site chrome
  home.php single.php   # templates (+ page.php search.php 404.php index.php)
  inc/                  # setup, enqueue, template functions/tags
  assets/css/main.css   # component / layout styles
  languages/lumen.pot   # translation stub
lumen-blog/             # optional thin companion plugin (0.1.0)
```

## Releases

- GitHub Releases: [wwintj/lumen/releases](https://github.com/wwintj/lumen/releases)
- **1.0.0** is the `Latest` release.
- All 1.1.0 pre-releases (`1.1.0-dev.11`, `1.1.0-beta.1`, `rc.1`, …) are **pre-releases** — never the "Latest" release. No tag/ZIP/Release per commit; commits land on `main` and releases are phase-gated (`1.1.0-dev.11` → `1.1.0-beta.1` → (if needed) `beta.2` → `rc.1` → `1.1.0` → `1.1.1+`).
- For the full version‑by‑version history, see [lumen/readme.txt](lumen/readme.txt#changelog).

---

<a id="zh-cn"></a>

## 中文（中文）

Lumen 是一个极简、SEO 友好的 **WordPress 主题**，面向中英文双语内容网站。
结构语义化、速度快、移动端优先、国际化就绪，且**零 JavaScript、无字体文件**。

## 版本

| 版本 | 状态 | 用途 |
|---|---|---|
| **1.0.0** | **稳定版 — `Latest`** | 生产环境。当前推荐发布。 |
| **1.1.0-beta.1** | **Beta**（预发布） | Lumen 1.1.0 整合预发布（归档/搜索核心正确性 + 文本优先设计）。不面向生产。 |
| **1.1.0** | 计划中 | 最终稳定版本。 |

> **Commit ≠ Release。** 正常提交合入 `main`；中间提交不产生 tag、ZIP 或 GitHub Release。
> 发布遵循阶段路线：`1.1.0-dev.11`（最终开发构建，不可变）→ `1.1.0-beta.1` →（如需）`beta.2` → `rc.1` → `1.1.0` → `1.1.1+`。
> **稳定版**（`1.0.0`）与 **1.1.0 预发布**是两条独立的版本线：1.0.0 保持 *Latest* 直到 1.1.0 稳定；每个 1.1.0 预发布（dev、beta、rc）均作为**预发布**发布，从不标记为 Latest。
> 权威版本列表见 [Releases](#releases)。

## 特性

- 语义化 HTML5 结构（header, nav, main, article, section, footer）；每页单一 H1。
- **始终可访问的导航** — 无 JS 的水平菜单，移动端自动换行（无汉堡菜单、无键盘陷阱、禁用 JS 可用）。
- 面向键盘用户的「跳转到内容」链接。
- 通过 `theme.json` 就绪 Gutenberg（配色、排版、间距、块样式）。
- 响应式、移动端优先（桌面 / 平板 / 移动）。
- 可访问性：地标、跳转链接、`:focus-visible` 样式、reduced‑motion 感知、懒加载缩略图。
- Core Web Vitals 友好：零 JavaScript，CSS 保持轻量。
- 导航菜单：**Primary**（页头）+ **Footer**（页脚）。
- 文章缩略图（懒加载）、自动 feed 链接、页脚 RSS。
- 单篇文章上/下一篇导航；自带评论、搜索、404、归档。
- i18n 就绪（text domain `lumen`）；提供 `languages/lumen.pot`。
- 无硬编码 URL；**不**输出 schema.org 微数据（交给 SEO 插件，如 Rank Math / Yoast）。
- 可选配套插件 **Lumen Blog**（0.1.0 薄壳）。

## 要求

- WordPress 6.3 或更高
- PHP 8.2 或更高
- MySQL 或 MariaDB（推荐 MySQL 8）

## 安装

1. 下载 / 克隆主题文件夹。
2. wp‑admin：**外观 → 主题 → 添加新主题 → 上传主题** → 选择 `lumen‑*.zip` 发布，
   或将克隆放入 `wp‑content/themes/`（主题文件夹为 `lumen/`）。
3. 启用主题。
4. *(可选)* 安装并启用 **Lumen Blog** 配套插件。
5. **设置 → 阅读**：首页选择 *你的最新文章*。
6. **外观 → 菜单**：分别指定 **Primary**（页头）与 **Footer**（页脚）菜单。

## 1.1.0 预发布新增了什么

`1.1.0-dev.x` 线（最终开发构建：**1.1.0-dev.11**，不可变）与整合预发布 **1.1.0-beta.1**
在不改动稳定线的前提下持续完善 Lumen 1.1.0 的阅读体验。近期版本新增（包括但不限于）：

- **归档/搜索核心正确性** — 归档 H1 标题基于 Core `get_queried_object()` 派生（分类 / 标签 /
  任意公开自定义分类法 / 作者 / 日期归档经 `wp_date()`），本地化上下文标签（"Category · N posts"、
  "Tag · N posts"、"Author · N posts"、"N posts"，单复数经 `_n()`），分类/作者描述，
  以及上下文感知列表顺序（归档：元数据 → 标题 → 摘要；搜索：标题 → 元数据 → 摘要）。
- **搜索页** — 独立 `search.php`，"N result(s) for 'query'" 计数（本地化，0 命中也显示），
  表单提交至 `home_url('/')`。
- **首页元数据排版** — 日期 / 分类行改用仿宋阅读字体（小号、柔和、辅助级；无布局变化）。
- **页头 / 页脚交互反馈** — 页头导航与页脚 RSS/菜单链接悬停柔和背景、当前页/分类常驻高亮、站点标题轻微悬停。

当前版本与完整变更列表见 [Releases](https://github.com/wwintj/lumen/releases)。

稳定版 **1.0.0** 保持不变，仍为生产 "Latest" 发布。

## Releases

- GitHub Releases: [wwintj/lumen/releases](https://github.com/wwintj/lumen/releases)
- **1.0.0** 为 `Latest` 发布（直至 1.1.0 稳定）。
- 所有 1.1.0 预发布（`1.1.0-dev.11`、`1.1.0-beta.1`、`rc.1`…）均为**预发布**，从不标记为 `Latest`。无逐提交 tag/ZIP/Release；提交合入 `main`，发布按阶段门控。
- 完整版本历史见 [lumen/readme.txt](lumen/readme.txt#changelog)。

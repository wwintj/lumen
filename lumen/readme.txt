=== Lumen ===
Contributor Name: Lumen Team
Contributor URI: https://lumen.example/
Author: Lumen Team
Author URI: https://lumen.example/
Homepage URL: https://lumen.example/
Version: 1.1.0-dev.9
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 8.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lumen
Domain Path: /
Tags: blog, content, minimalist, responsive-layout, custom-menu, translation-ready, rss-icons

A minimalist, SEO-friendly content blog theme built for a bilingual (English + Chinese) site. Development preview of the 1.1.0 release.

== Features ==
* Semantic HTML5 structure (header, nav, main, article, section, footer).
* Single H1 per page; correct heading hierarchy.
* Always-accessible navigation: a no-JS horizontal menu that wraps on mobile (no hamburger, no keyboard trap, works with JS disabled).
* Skip-to-content link for keyboard users.
* Gutenberg-ready: theme.json color palette, typography, spacing, and block styles (full-bleed alignment, gallery, quote).
* Responsive (mobile-first) — desktop, tablet, mobile.
* Accessible: semantic landmarks, skip link, focus-visible styles, reduced-motion aware, lazy-loaded thumbnails.
* Core Web Vitals friendly: zero JavaScript, no framework, single CSS file.
* Nav menus: Primary + Footer.
* Post thumbnails (lazy loading), automatic feed links, RSS in footer.
* Previous/next post navigation on single posts.
* Comments, search, 404, and archives out of the box.
* i18n ready: full translation support (text domain "lumen"); languages/lumen.pot provided.
* No hardcoded URLs (home_url / site_url / get_template_directory_uri / get_template_directory()).
* No theme output of schema.org microdata — defer to an SEO plugin (Rank Math / Yoast) to avoid duplication.
* Pairs with the Lumen Blog companion plugin (thin bootstrap only at 0.1.0).

== Requirements ==
* WordPress 6.3 or later.
* PHP 8.2 or later.
* MySQL 8 or later.

== Installation ==
1. Download / clone the Lumen theme folder.
2. In wp-admin: Appearance > Themes > Add New > Upload Theme > select the theme zip.
3. Activate the theme.
4. (Recommended) Install and activate the Lumen Blog companion plugin (thin bootstrap; no features at 0.1.0).
5. Settings > Reading: choose "Your latest posts" for the homepage.
6. Settings > Appearance > Menus: assign the Primary menu (and Footer menu if desired).

== Companion plugin: Lumen Blog (0.1.0) ==
At 0.1.0 the plugin is a thin bootstrap: plugin header, LBN_VERSION constant, and a text-domain load (lumen-blog) so future extensions are i18n-ready. It ships no features, no UI, no REST endpoints, and no hooks beyond the text-domain load. Concrete features (CPTs, forms, REST API) are added in later phases only when a concrete need exists (YAGNI).

== Changelog ==
* 1.1.0-dev.9 (Comments — reading + interaction refinement)
  * EN — Comments section now wraps in a semantic <section id="comments" class="lumen-comments"> (a single landmark). Top-level comments are wrapped in an <ol class="lumen-comment-list"> so the document is valid HTML while the nested <ul class="children"> remain valid Core child lists.
  * EN — Core args corrected: wp_list_comments() now passes only valid args (avatar_size); the former 'class'/'time_on' args were no-ops and are removed. comment_form() is left untouched (no new class/form args).
  * EN — CSS now targets the real Core DOM (xhtml format): comment body text — the only reading content — uses the FangSong reading typeface; author name, date, reply link, count title, and form use the sans UI layer. No card, no shadow — a single top border and generous spacing separate the section from the Previous/Next nav.
  * EN — Nested replies render as a left guide (1px border) with a modest per-level indent, so 3-4 deep replies stay readable without infinite indentation.
  * EN — URL-based threading (#respond, ?replytocom=ID) works without JavaScript; pagination, accessibility, translations, moderation notes, and edit-link are preserved exactly.
  * EN — No layout changes to homepage, archive, search, page, header, footer, Gutenberg, or stable v1.0.0.
  * 中文 — 评论区现包裹为语义化 <section id="comments" class="lumen-comments">（单一地标）。顶级评论包裹于 <ol class="lumen-comment-list">，使文档结构有效，嵌套 <ul class="children"> 保持有效的 Core 子列表。
  * 中文 — 修正 Core 参数：wp_list_comments() 仅传有效参数（avatar_size）；原 'class'/'time_on' 参数为无效参数（no-op），已移除。comment_form() 保持不变（未新增 class/form 参数）。
  * 中文 — 样式现针对真实 Core DOM（xhtml 格式）：评论正文（唯一阅读内容）使用仿宋阅读字体；作者名、日期、回复链接、计数标题与表单使用无衬线 UI。无卡片、无阴影——用单条顶部边框与宽松间距将该区与上一篇/下一篇导航区分开。
  * 中文 — 嵌套回复以左侧引导线（1px 边框）+ 每层适度缩进呈现，3–4 层深度回复仍可阅读，不会无限缩进。
  * 中文 — 基于 URL 的线程（#respond、?replytocom=ID）无需 JavaScript；精确保留分页、可访问性、翻译、审核提示与编辑链接。
  * 中文 — 首页、分类、搜索、页面、页头、页脚、Gutenberg 及稳定版 v1.0.0 布局不变。
* 1.1.0-dev.8 (Single post content typography, phase 2)
  * EN — Single post body content (.lumen-post-body) refines long-form typography: an H2–H6 reading-serif size scale, list spacing, a minimal left-rule blockquote, a subtle persistent link underline, true non-wrapping code blocks (horizontal scroll confined to the block), compact tables, quiet captions, and generous separators. Global typography and the 720px content column are unchanged.
  * EN — Zero-JS: no new scripts; code-block scrolling uses CSS overflow only.
  * EN — Homepage, archive, search, page, header, footer, comments, and the dev.7 single header / Previous-Next navigation are unchanged; stable v1.0.0 untouched.
  * 中文 — 单篇文章正文排版（第二阶段，仅 .lumen-post-body）：H2–H6 阅读衬线字号阶梯、列表间距、极简引言块、微妙持久的链接下划线、真正不折行的代码块（仅在代码块内部横向滚动）、紧凑表格、安静图注、宽松分隔线。全局排版与 720px 内容栏保持不变。
  * 中文 — 零 JavaScript：无新增脚本；代码块横向滚动仅用 CSS overflow 实现。
  * 中文 — 首页、分类、搜索、页面、页头、页脚、评论，以及 dev.7 单篇页头 / 上一篇-下一篇导航保持不变；稳定版 v1.0.0 未改动。
* 1.1.0-dev.7 (Single post reading layout)
  * EN — Single post title now sits above the featured image, tuned to the reading scale (clamp 1.75–2.5rem, FangSong, line-height 1.5); default single meta shows only "Date · Category" (no author) in the FangSong reading typeface with a middle-dot separator and a tabular-nums date.
  * EN — Previous/Next post navigation reworked as a two-layer link (small sans "← Previous" / "Next →" label + FangSong title), with a top border, generous spacing, and a full-width stacked layout on mobile.
  * EN — No layout changes to homepage, archive, search, page, header, footer, comments structure, or Gutenberg; stable v1.0.0 untouched.
  * 中文 — 单篇阅读版式：标题移至特色图上方，按阅读比例微调（clamp 1.75–2.5rem，仿宋，行高 1.5）；默认单篇元数据只显示"日期 · 分类"（不显示作者），采用仿宋阅读字体、居中点分隔与日期 tabular-nums。
  * 中文 — 上一篇/下一篇导航重构为两层链接（小号无衬线"← 上一篇"/"下一篇 →"标签 + 仿宋标题），顶部边框、宽松间距，移动端堆叠全宽布局。
  * 中文 — 首页、分类、搜索、页面、页头、页脚、评论结构、Gutenberg 布局保持不变；稳定版 v1.0.0 未改动。
* 1.1.0-dev.6 (Header/footer interactions + homepage metadata typography)
  * EN — Homepage date/category metadata typography now uses the FangSong reading font (font-family: --lumen-font-reading, weight 400); size, muted tone, line-height, tabular-nums date, and hover contrast unchanged.
  * EN — Header nav links get a soft hover background (--lumen-bg-soft) + a persistent current-page/category active state (current-menu-item/-parent/-ancestor); the site title gains a subtle hover color.
  * EN — Footer RSS feed and footer-menu links get a soft hover background; the copyright line stays static.
  * EN — Interactions reuse only existing tokens; :focus-visible and the no-underline policy are preserved; a bilingual README.md is added at the repo root.
  * 中文 — 首页日期/分类元数据改用仿宋阅读字体（--lumen-font-reading，字重 400）；尺寸、柔和色、行高、日期 tabular-nums、悬停对比度保持不变。
  * 中文 — 顶部导航链接悬停显示柔和背景（--lumen-bg-soft），并添加常驻当前页/分类高亮；站点标题添加轻微悬停效果。
  * 中文 — 页脚 RSS 与页脚菜单链接悬停显示柔和背景；版权信息保持不变。
  * 中文 — 仅复用既有颜色/尺寸令牌；保留 :focus-visible 与无下划线策略；在仓库根目录添加双语 README.md。
* 1.1.0-dev.5 (Typography — FangSong reading font)
  * Unified reading typography around a FangSong-style Chinese serif stack (token --lumen-font-reading)
  * Homepage post titles and excerpts now use the FangSong reading stack (medium 500 weight; excerpt line-height 1.85)
  * Single-post titles and article content use the same reading font (body line-height 1.9)
  * Page titles and page content use the same reading font
  * Navigation, metadata, pagination, and footer remain sans-serif; archive card titles unchanged
  * code / pre / kbd / samp remain monospace (no FangSong pollution)
  * Preserved all dev.4 UX fixes (hover, focus-visible, sticky header, Previous/Next pagination)
* 1.1.0-dev.4 (UX & bug-fix revision)
  * Fixed the logged-in mobile sticky-header / admin-bar gap: three-breakpoint header offset (46px bar → top:46px on tablet, top:0 on mobile; 32px bar → top:32px on desktop) so the header never overlaps the bar or leaves a gap.
  * Balanced the homepage post-divider vertical rhythm: equal whitespace above and below the line (~32px/32px desktop, 28px/28px mobile).
  * Renamed homepage pagination to "Previous" / "Next" (previous page on the left, next page on the right; page 1 shows Next only, last page shows Previous only); arrows remain decorative in CSS.
  * Removed underline on link hover across the Lumen frontend (color-shift only; :focus-visible outline preserved; WP admin-bar core CSS untouched).
  * Strengthened category hover contrast (muted → text color, ~160ms transition; no underline/pill/bold).
  * Reworked header nav hover to a color transition (no underline, no font-weight, no background pill).
* 1.1.0-dev.3 (Development preview — version alignment)
  * Theme development version now matches the prerelease build
  * WordPress admin reports 1.1.0-dev.3; asset cache version follows LUMEN_VERSION
  * Includes the homepage reading improvements from 1.1.0-dev.2
* 1.0.0 (Initial stable release)
  * Release freeze: all Phase 1.2 / 1.3 browser validations pass; no new features or redesign.
* 0.2.0 (Phase 2 — visual polish; release candidate)
  * Constrained the home/archive column to ~68ch, centered (flat editorial post list; no full-width).
  * Fixed post-card titles to 1.5rem (were 48px, same size as the single-post title).
  * Reduced archive headings to match the heading hierarchy (were 52px, larger than the single title).
  * Removed the sticky-header glassmorphism (solid background, no blur).
  * Aligned blockquote borders (base + block-editor) to a consistent soft tone.
  * Styled the 404 "Back to home" link as a quiet outlined button.
  * Increased home whitespace for a calmer rhythm.
  * Corrected the theme.json "Muted" palette value to match --lumen-muted (#6e6e6e).
  * Regenerated screenshot.png from a real 1200x900 home render.
  * No new JavaScript, no new fonts, no template refactoring.
* 0.1.0 (Phase 1 — development)
  * Initial minimalist theme skeleton (no-JS always-accessible nav, skip link, semantic HTML, theme.json).
  * Removed schema.org microdata from the theme (defer to SEO plugin).
  * Removed the JS overlay nav, the read-time estimate, the unused sidebar, and the block-support helper (YAGNI).
  * Companion plugin reduced to a thin bootstrap (REST endpoint + contract class + unused functions removed).

== Support & Contributing ==
* Report issues with the Lumen project.
* Follow WordPress Coding Standards and the WP theme standards.
* Keep the theme/plugin separation: Theme = presentation; Plugin = business logic.
* Do not add code "for later"; add it only when a concrete feature is required.

== License ==
GPL v2 or later.

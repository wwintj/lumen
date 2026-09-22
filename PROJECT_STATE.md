# Lumen Project State

## 1. Project

Project:
Lumen

Theme:
lumen/

Theme version:
0.2.0

Theme text domain:
lumen

Theme function prefix:
lumen_

Companion plugin:
lumen-blog/

Plugin version:
0.1.0

Plugin text domain:
lumen-blog

Plugin prefix:
lbn_

Current status:

Lumen Theme MVP = RELEASE CANDIDATE

Final validation:

Phase 1.4 Final Release Gate: CONDITIONAL PASS
Lumen 0.2.0: RELEASE CANDIDATE APPROVED

说明这里的 CONDITIONAL PASS 只来自两个 runtime 无法测试的 Gutenberg Editor 项目，不代表存在已知 Lumen runtime defect。

---

## 2. Current Architecture

准确描述当前 Theme 结构。

当前主题文件（21 个）：

- style.css
- functions.php
- theme.json
- header.php
- footer.php
- index.php
- single.php
- page.php
- search.php
- 404.php
- comments.php
- inc/enqueue.php
- inc/setup.php
- inc/template-functions.php
- inc/template-tags.php
- template-parts/post-list-item.php
- template-parts/post-list.php
- assets/css/main.css
- languages/lumen.pot
- screenshot.png
- readme.txt

说明：

Lumen 是经典 PHP WordPress Theme + theme.json 支持。theme.json 为 v2，含 `settings`（color palette / typography）、`style`、`typography`、`blocks`。

不要为了"结构完整"声称存在实际不存在的：

- home.php
- archive.php
- category.php
- tag.php
- author.php

当前 archive/category/tag/author/date 等通过 WordPress Template Hierarchy fallback 到 index.php。

---

## 3. Design Direction

记录当前已经确认的视觉原则：

- minimal editorial
- content-first
- typography-first
- quiet
- generous whitespace
- low visual noise
- system font stack
- no remote font
- no JavaScript dependency
- no UI framework
- no gradients
- no glassmorphism
- no excessive shadows
- no dark mode at current stage

正文阅读宽度：

approximately 68ch（`--lumen-content-max: 68ch`）

Home / Archive：

constrained editorial column rather than full-width desktop layout.

Post card title：

approximately 24px after visual polish（`.lumen-post-card .lumen-post-title { font-size: 1.5rem; }`）

Header：

solid background, sticky, no glass blur.

Muted color：

#6e6e6e

说明该颜色已经因 contrast validation 从较浅的 #8a8a8a 调整。

字体栈（system fonts，无 remote）：

- --lumen-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- --lumen-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace

---

## 4. Important Technical Decisions

### SEO

Theme 不自己输出重复 Schema / SEO metadata。

Schema / canonical / OpenGraph 等优先交给 SEO Plugin，例如 Rank Math。

Theme 负责：

- semantic HTML
- heading hierarchy
- accessibility
- layout
- performance

不要重新在 Theme 中加入：

- schema.org microdata
- JSON-LD
- canonical
- OpenGraph

除非以后有明确需求。

### JavaScript

Lumen 当前：

Theme JavaScript = NONE

不要因为移动导航等简单功能重新加入 JS。

Primary navigation 是 progressive / HTML + CSS。

### Plugin

lumen-blog 当前只是 minimal bootstrap。

目前没有：

- REST endpoint
- CPT
- settings
- newsletter
- forms
- frontend assets
- business logic

这是刻意设计。

不要为了"Plugin 看起来太空"而自动增加功能。

YAGNI。

只有未来出现真正独立于 Theme 的业务功能时才扩展 Plugin。

---

## 5. Important Bugs Already Fixed

简洁记录已经修复的重要问题，防止未来重新引入。

### WordPress API correctness

曾错误使用不存在或错误的 API，包括：

- get_archive_title()
- has_prev_post()
- get_previous_post_title()
- comments_allowed()
- align-large

均已经删除 / 修复。

当前使用 Core API。

### Post navigation

使用：

the_post_navigation()

CSS 对应真实 Core classes：

- .post-navigation
- .nav-links
- .nav-previous
- .nav-next

不要重新使用猜测 class。

### Comments

正确加载模式：

comments_open() || get_comments_number()

comments.php 已支持：

- existing comments
- closed comments
- comment form
- password protected post
- threaded comments
- the_comments_pagination()

曾存在 translation getter 未 echo 的问题，已修复。

### i18n

曾发现：

esc_html__()
esc_attr__()

作为 standalone expression 被调用但没有 echo。

已完成全 Theme sweep。

当前目标：

0 discarded translation getter calls.

不要重新引入：

<?php esc_html__( ... ); ?>

这种无输出写法。

### Dates

曾错误调用：

get_post_time( null, $format )

根因是 Theme 参数位置错误，不是 WordPress API signature change。

当前日期实现已修复并通过 runtime。

### Categories

曾依赖：

$term->link

导致 archive list category links 为空。

现在通过正常 WordPress term link API 处理。

### Featured images

真实测试：

1600x900 source
lumen-card = 800x450

确认：

- width
- height
- srcset
- sizes

均正确。

### body_class

当前实现：`<body <?php body_class(); ?>>`（在 body 标签内直接输出 body classes）。

Core 的 `wp_body_open()` 是在 body 打开后调用、只触发 `wp_body_open` action 的函数，但它**不会输出 body classes**。不要误以为 `wp_body_open()` 会输出 body classes。

这个修复使真实登录状态下 `body.admin-bar` 正常存在（从而 sticky header 偏移 `body.admin-bar .lumen-site-header { top: 32px; }` 生效）。

### custom logo

使用：

the_custom_logo()

不要重新改回不存在 / 错误的：

custom_logo()

并避免 nested `<a>`。

### CSS

style.css 必须显式 enqueue，同时 main.css 继续加载。

不要假设 theme.json 会自动让 style.css 以当前需要的方式加载。

---

## 6. Validation History

不要写大量测试日志。

只做摘要：

### Static validation

PASS

### Server runtime

PASS

验证包括：

- WordPress runtime
- PHP runtime
- author archives
- comments
- comment pagination
- closed comments
- featured images
- search
- categories
- 404
- plugin lifecycle
- debug.log

最终：

0 Lumen-generated runtime errors.

### Browser validation

PASS

使用：

Playwright / Chromium

回归：

78 cases

viewports：

- 1440
- 768
- 767
- 390
- 375
- 320

最终：

- 0 global horizontal overflow
- 0 skip-link failures
- 0 Lumen console errors on normal pages
- 0 missing Lumen assets

### Visual polish

PASS

### Final Release Gate

CONDITIONAL PASS

Theme RC approved.

---

## 7. Known Limitations

这里只记录真正仍未验证的两项。

### 1. Gutenberg Editor block-content rendering

Status:

BLOCKED / NOT TESTABLE IN CURRENT RUNTIME

已验证 Editor shell：

- toolbar
- menu
- title
- admin bar
- 0 JS errors

但当前 runtime 中 block content 不渲染。

跨多个 post/page、headless/non-headless 均无法完成视觉测试。

不要在新 Session 自动重新测试。

不要把它当成 Theme bug。

只有未来换到正常 WordPress Editor runtime，或者用户明确要求时再验证。

### 2. Editor-style visual consistency

Status:

BLOCKED / NOT TESTABLE

因为 Gutenberg block content 不渲染，所以无法视觉确认。

theme.json 中相关样式已经存在。

这是上一项 limitation 的后果，不是独立 Theme defect。

---

## 8. Do Not Re-run

新 Agent 默认不要重新运行：

- Phase 1.1
- Phase 1.2
- Phase 1.2.1
- Phase 1.2.2
- Phase 1.3
- Phase 1.4
- 78-case regression
- Admin Bar validation
- comment fixtures
- image fixtures
- translation sweep
- visual polish tests

除非：

1. 新代码可能影响对应功能；
2. 用户明确要求；
3. 出现实际 regression。

不要因为"想确认一下"重新跑所有历史测试。

---

## 9. Regression Guardrails

未来修改必须避免破坏：

- no Theme JavaScript
- semantic HTML
- one primary H1 where appropriate
- skip link
- body_class()
- wp_body_open()
- keyboard navigation
- visible focus
- no global horizontal overflow
- 68ch reading width
- responsive images
- comment pagination
- closed-comments behavior
- translation output
- no duplicate SEO Schema
- Rank Math compatibility
- mobile 320px usability
- style.css + main.css loading
- no Lumen PHP Warning/Notice/Deprecated/Fatal

未来功能修改只重新测试受影响范围。

不要默认重跑完整 Phase 1.x。

---

## 10. Test Infrastructure

说明：

.runtime/

属于测试环境，不是 Theme 产品代码。

现有测试资料可能包括：

- browser validation scripts
- Playwright scripts
- results.json
- screenshots
- runtime WordPress installation
- reports（含 .runtime/browser/phase14-final-report.md）

不要把 .runtime/ 内容打进 Theme release package。

不要把 test scripts 移入：

lumen/
lumen-blog/

---

## 11. Release Files

当前 Theme screenshot：

lumen/screenshot.png

尺寸：

1200x900

来源：

real browser-rendered Lumen home page

不是 marketing mockup。

旧：

screenshot-source.svg

已经删除，因为无引用。

---

## 12. Git State

当前 workspace：

NO GIT REPOSITORY

之前明确没有执行：

git init

不要在新 Session 自动：

git init

只有用户明确要求建立 Git repository 时才执行。

---

## 13. Current Product Status

明确写：

Theme:
Lumen 0.2.0

Status:
RELEASE CANDIDATE

Plugin:
lumen-blog 0.1.0

Status:
minimal bootstrap

Actionable technical blockers:
NONE

Known test limitations:
2

Active task:
NONE

---

## 14. Next Phase

不要自行决定下一功能。

写：

Next development phase has NOT started.

Possible future directions, only when requested:

- visual refinement based on user taste
- real alignwide enhancement
- production packaging
- Git/GitHub baseline
- WordPress.org submission audit
- Companion Plugin functional planning
- new Theme features

不要自动开始其中任何一项。

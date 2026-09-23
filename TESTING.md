# Lumen — Phase 1 Runtime Validation Checklist

Phase 1.2: deploy to a real WordPress environment and validate.

## Environment

- WordPress: latest stable (6.7+)
- PHP: 8.2+
- MySQL: 8+
- Browsers: Chrome, Safari, Firefox, Edge (current)
- Viewports: desktop (≥1024px), tablet (768–1023px), mobile (≤767px)
- Theme: Lumen `0.1.0` (active)
- Companion plugin: Lumen Blog `0.1.0` (active, no-op bootstrap)
- SEO plugin (optional, for schema check): Rank Math or Yoast

## Pages

| Page | What to check |
|---|---|
| Blog Home (latest posts) | H1 = site title; post list; no JS needed; no 404 |
| Single post | One H1; title, date, author, category; content; previous/next nav; comments; readable width (~68ch) |
| Page (static) | One H1; content; no extra H1 |
| Category archive | H1 = category name; posts in category; search form present |
| Tag archive | H1 = tag name; posts in tag |
| Author archive | H1 = author name; author's posts |
| Date archive | H1 = date; posts in date range |
| Search results (hits) | H1 = “Search results for “q””; matching posts; search form |
| Search results (no hits) | “No posts found.” message |
| 404 | 404 code + message + “Back to home” link |
| Comments enabled | Comments list renders; form renders; submit works |
| Comments disabled | “Comments are closed.” shown; no form |
| Post without image | No empty image box; title/meta/content aligned |
| Post with image | Featured image loads (eager), 16/9 ratio, no CLS |
| Very long title | Wraps; no layout break; no overflow |
| Very long content | Long code/URLs don't overflow; tables scroll horizontally on mobile |
| Gutenberg blocks | Paragraph, heading, image, quote, gallery, full-bleed alignment all render; theme.json styles apply |

## Mobile

| Check | Expected |
|---|---|
| Navigation | No-JS horizontal list; wraps below title; all links tap-targeted; works with JS disabled |
| Long titles | Wrap to multiple lines; no horizontal scroll of the container |
| Images | 16/9 thumbnails; featured 16/9; lazy-loaded on list |
| Tables | Scroll horizontally (not clipped) |
| Code blocks | Scroll horizontally; long tokens wrap |
| Comments | Form fields stack; focus visible; labels present |
| Skip link | Focusable; moves to content |
| Footer | Wraps; RSS link visible |

## Accessibility

| Check | Expected |
|---|---|
| Keyboard only | Skip → content; Tab through nav; Enter to navigate; all interactive elements reachable |
| Focus visibility | Clear focus indicator (2px outline) on links, inputs, buttons |
| No keyboard trap | Nav menu does not trap focus; ESC/Tab exit works (no menu = no trap) |
| Screen-reader labels | “Primary menu” (nav aria-label), “Footer menu”, “Skip to content”, “Previous and next posts” |
| Contrast | Text `#1b1b1b` on `#fdfdfd` > 14:1 (AAA); muted `#8a8a8a` on `#fdfdfd` ≈ 3.9:1 (acceptable for large text / secondary; review if used for body copy) |
| Reduced motion | No auto-animation; transitions are subtle (120ms) and respect `prefers-reduced-motion` |
| ARIA | `aria-expanded`/`aria-controls` removed (no toggle); skip link uses `href="#lumen-main"` |

## SEO

| Check | Expected |
|---|---|
| H1 | Exactly one H1 per page; correct hierarchy (H1 → H2 for post titles) |
| Title | Managed by SEO plugin (Rank Math/Yoast) — theme does NOT output `<title>` (title-tag support) |
| Canonical | Managed by SEO plugin — theme does NOT output `<link rel=canonical>` |
| Schema duplication | Theme outputs **no** schema.org microdata (WebSite, BlogPosting, QAPage removed); verify in browser dev-tools Network/JSON that only the SEO plugin's JSON-LD is present (no duplicate microdata) |
| Meta description | Managed by SEO plugin — theme does NOT output meta description |
| OpenGraph / Twitter | Managed by SEO plugin — theme does NOT output OG/Twitter tags |

## Performance

- Zero JavaScript loaded (verify in Network tab: no `main.js`).
- Single CSS file (main.css) + base in style.css.
- Featured image eager; list thumbnails lazy.
- No render-blocking JS.

## Plugin (Lumen Blog 0.1.0)

- Activates cleanly (no errors in admin).
- No REST endpoint registered (verify `/wp-json/lbn/v1/status` returns 404 or the namespace is absent).
- No options written on activation.
- Deactivation is clean.

## Sign-off

[ ] All pages pass
[ ] Mobile passes
[ ] Accessibility passes
[ ] SEO (no schema duplication) passes
[ ] No console errors
[ ] Version `0.1.0` confirmed in theme + plugin

=== Lumen ===
Contributor Name: Lumen Team
Contributor URI: https://lumen.example/
Author: Lumen Team
Author URI: https://lumen.example/
Homepage URL: https://lumen.example/
Version: 1.1.0-dev.4
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

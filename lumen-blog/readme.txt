=== Lumen Blog ===
Contributor Name: Lumen Team
Contributor URI: https://lumen.example/
Author: Lumen Team
Author URI: https://lumen.example/
Homepage URL: https://lumen.example/
Version: 0.1.0
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 8.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lumen-blog
Domain Path: /

Thin companion bootstrap for the Lumen theme.

== Plugin Overview ==
Lumen Blog is intentionally minimal. At 0.1.0 it ships:
* A proper plugin header.
* A version constant (LBN_VERSION).
* A text domain (lumen-blog), loaded on init so future extensions are i18n-ready.

It ships NO features, NO UI, NO REST endpoints, and NO hooks beyond the text-domain load. This is a deliberate, YAGNI-driven decision: no code is added for "future use."

== Future Extensions (Phase 2+) ==
When a concrete feature is added (e.g. a CPT, a form, a REST API), register it in a dedicated includes/ file loaded from lumen-blog.php. Do not add code "for later."

== Uninstall ==
uninstall.php is a reserved extension point for future option cleanup. It currently performs no cleanup (the bootstrap stores nothing).

== Changelog ==
* 0.1.0 (Phase 1 — development)
  * Initial thin bootstrap.
  * Removed the /wp-json/lbn/v1/status REST endpoint, the LBN_Main contract class, and unused lbn_* functions (no current use).
  * Kept only: plugin header, LBN_VERSION, text-domain load.

== License ==
GPL v2 or later.

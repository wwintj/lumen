# Lumen QA — beta.1 runtime suite

## A. Purpose

`qa-beta1.js` is the runtime QA suite for the **Lumen 1.1.0-beta.1** theme. It drives a
real WordPress install with a headless browser and WordPress Core APIs, then asserts
theme behaviour: typography per viewport, archive/search headers and ordering, single
post rendering, comments, admin bar, and security/edge cases.

Structure:

- `qa-beta1.js` — the QA driver (Node.js). Creates the fixture, runs assertions,
  writes a report, then tears the fixture down.
- `wp_cli_bootstrap.php` — loads the real WordPress Core (`wp-load.php`) so helpers
  operate through Core rather than hand-written SQL.
- `wp_comment_helper.php`, `wp_term_helper.php`, `wp_user_helper.php` — Core-native
  helpers for comments, terms and users, invoked over stdin/stdout JSON.

**The suite creates and deletes temporary test content** (posts, terms, comments, one
temp administrator, a temp MU plugin) and temporarily changes a few WordPress options,
restoring them during teardown.

> **Never run this against a production WordPress install.** A mandatory safety gate
> refuses to proceed unless the target is provably the local isolated test install.

## B. Prerequisites

Use whatever versions your platform provides; the suite does not pin exact versions.
It has been exercised with:

- **Node.js** (tested on v24) and **npm**
- **Playwright** with **Chromium** installed (`playwright` is declared in `package.json`)
- **PHP** CLI (tested on 8.5)
- **WP-CLI** (tested on 2.12)
- **WordPress** Core (tested on 7.1.1)
- **MariaDB / MySQL** (tested on MariaDB 13)
- The **Lumen theme** present and activatable

`node`, `php` and `wp` must be resolvable on `PATH` (override with `LUMEN_QA_PHP` /
`LUMEN_QA_WPCLI` if needed).

## C. Repository assets

The two fixture inputs are **version-controlled** and ship with the repository:

```
.lumen-qa/fixtures/content.html   # long-form post body (Gutenberg/blocks fixture)
.lumen-qa/fixtures/img.png        # 900x540 image used as the featured-image fixture
```

They are test inputs — **do not recreate or hand-edit them**. The driver reads them
from `.lumen-qa/fixtures/` and intentionally has **no fallback** to any machine-local
copy: if an asset is missing, the run fails with an explicit error rather than silently
using something else.

## D. Isolated runtime setup

The driver expects this layout:

```
<project root>/
  lumen/                     # the theme under test
  .lumen-qa/                 # this suite
  .runtime/wordpress/        # the WordPress install used for QA
```

The safety gate enforces all of the following before any fixture write:

| Requirement | Expected value |
| --- | --- |
| Database actually connected | `lumen_test` |
| Database host | local (`localhost` / `127.0.0.1` / local socket) |
| `siteurl` and `home` | `http://127.0.0.1:4242` |
| WordPress root (`ABSPATH`, symlinks resolved) | `<project root>/.runtime/wordpress` |
| `WP-CLI` root vs PHP-helper root | must resolve to the same install |

WordPress must also have:

- test administrator login **`admin`** with the **administrator** role — its numeric
  **ID is resolved dynamically** at runtime, so any ID is fine;
- the **Lumen theme active**;
- permalink structure `/%year%/%monthnum%/%day%/%postname%/`;
- `comments_per_page = 10`, `page_comments = 1`, `default_comments_page = oldest`.

Setting up WordPress in `.runtime/wordpress` and creating/initialising `lumen_test`
is a **manual, environment-specific step** — this repository does not ship an
automated installer for it. Do not run destructive database commands (`wp db reset`,
`wp db clean`, `DROP DATABASE`) as a casual one-liner; take a backup first and confirm
which database you are pointing at.

## E. Start the web server

The suite talks to `http://127.0.0.1:4242`. **The driver does not start a server** —
start it yourself and leave it running:

```bash
wp --path=.runtime/wordpress server --host=127.0.0.1 --port=4242
```

It binds to loopback only. Confirm it is up before running QA:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4242/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4242/wp-login.php
```

Both should return `200`. Override the target with `LUMEN_QA_BASE` only if you know
what you are doing — the safety gate still requires the `siteurl`/`home` above.

## F. Install dependencies

From `.lumen-qa/`, install exactly what the lockfile pins:

```bash
cd .lumen-qa
npm ci
```

Then ensure the Chromium browser binary is present:

```bash
npx playwright install chromium
```

## G. Run the QA

With the server running and the environment prepared:

```bash
cd .lumen-qa
node qa-beta1.js
```

Expected behaviour:

1. The **safety gate** verifies the database, host, URLs and WordPress root, plus that
   `wp` and the PHP helpers agree on the same install. If anything mismatches, the run
   aborts **before creating fixtures and without touching the database**.
2. The fixture is created (15 posts, categories, tags, a custom-taxonomy topic,
   12 comments, a featured image, a temporary administrator).
3. Assertions run across viewports; screenshots are written under `.runtime/`.
4. Teardown removes the fixture and **restores the original option values**.
5. A report is written to `.lumen-qa/report-beta1.json` with `runId`, timestamps,
   `status`, per-check results and a `clean` flag.

The process exit code is `0` only on a full pass.

Reports, logs and screenshots are **generated artefacts, not source** — they are
git-ignored.

**On failure:** read the current report and the run output first, then check for
leftover QA content before re-running. Do not blindly re-run the suite, and do not
"fix" failures by weakening assertions.

## H. Troubleshooting

| Symptom | Likely cause / action |
| --- | --- |
| Connection refused / HTTP 000 | Web server not running — see **E**. |
| `QA ENVIRONMENT REFUSED — database is ...` | You are pointed at a different database. The gate requires `lumen_test`. |
| `... database host is not local` | The configured DB host is remote. QA will not run against it. |
| `... siteurl/home are ...` | `siteurl`/`home` are not `http://127.0.0.1:4242`. |
| `... WordPress root resolves to ...` | `.runtime/wordpress` is a symlink/environment pointing at another install. |
| `... WP-CLI targets ...` | `wp` and the PHP helpers resolve to different installs. |
| `missing QA fixture ...` | `.lumen-qa/fixtures/` is incomplete — restore the tracked assets. |
| `wp: command not found` / PHP errors | `wp` or `php` not on `PATH`; set `LUMEN_QA_WPCLI` / `LUMEN_QA_PHP`. |
| Browser launch failure | Chromium missing — `npx playwright install chromium`. |
| `site admin "admin" does not exist` | The test admin login/role is missing or wrong — see **D**. |
| `... lacks the administrator role` | The `admin` user is not an administrator. |

### Scope of validation

A successful local run means the suite passed **in that environment**. It does **not**
by itself prove that a clean `git clone` reproduces end-to-end on a fresh machine —
that requires a separate, independent verification.

=== Lumen Blog ===
Contributor Name: Lumen Team
Contributor URI: https://github.com/wwintj
Author: Lumen Team
Author URI: https://github.com/wwintj
Homepage URL: https://github.com/wwintj/lumen
Version: 0.1.0
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 8.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lumen-blog
Domain Path: /

Lumen Theme 的輕量配套啟動外掛。

== Plugin Overview ==
Lumen Blog 刻意保持精簡。在 0.1.0 版，它僅提供：
* 標準的外掛標頭（plugin header）。
* 版本常數（LBN_VERSION）。
* 文字域（lumen-blog），於 init 時載入，使日後的擴充具備 i18n 基礎。

它**不提供**任何功能、**沒有**管理介面 UI、**沒有** REST 端點，除文字域載入外也**沒有**其他 hook。
這是刻意採取的 YAGNI 決策：不為「日後可能用到」而預先加入程式碼。

== Future Extensions (Phase 2+) ==
當出現**具體**功能需求時（例如自訂內容類型 CPT、表單、REST API），請於專屬的 includes/ 檔案中註冊，
並由 lumen-blog.php 載入。不要預先加入「以備將來」的程式碼。

== Uninstall ==
uninstall.php 是保留給日後選項清理用的擴充點。它目前**不執行**任何清理工作
（此啟動外掛不儲存任何資料）。

== Changelog ==
* 0.1.0 (Phase 1 — development)
  * 初始輕量啟動外掛。
  * 移除 /wp-json/lbn/v1/status REST 端點、LBN_Main contract 類別，以及未使用的 lbn_* 函式（目前無用途）。
  * 僅保留：外掛標頭、LBN_VERSION、文字域載入。

== License ==
GPL v2 或更新版本（GPL v2 or later）。

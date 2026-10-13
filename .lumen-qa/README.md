# Lumen QA —— beta.1 執行階段測試套件

## A. 測試目的

`qa-beta1.js` 是 **Lumen 1.1.0-beta.1** 佈景主題的執行階段 QA 測試套件。它會以真實的
WordPress 網站搭配無頭瀏覽器與 WordPress Core API 進行驗證，並檢查佈景主題行為：
各視窗尺寸的排版、彙整頁／搜尋頁標題與排序、單篇文章呈現、留言、管理列，以及安全性與
邊界情境。

組成：

- `qa-beta1.js` —— QA 驅動程式（Node.js）。負責建立 fixture、執行斷言、寫出報告，最後拆除 fixture。
- `wp_cli_bootstrap.php` —— 載入真實的 WordPress Core（`wp-load.php`），讓各 helper 透過
  Core 運作，而非手寫 SQL。
- `wp_comment_helper.php`、`wp_term_helper.php`、`wp_user_helper.php` —— 分別處理留言、分類法
  與使用者的 Core 原生 helper，透過 stdin／stdout 以 JSON 溝通。

**本測試套件會建立並刪除暫時性的測試內容**（文章、分類法、留言、一個暫時管理員、一個暫時
MU 外掛），並暫時變更少數 WordPress 設定值，於 teardown 時還原。

> **嚴禁對正式營運中的 WordPress 網站執行本測試套件。**
> 強制性安全門禁（safety gate）會先確認目標確實是本機隔離測試環境，否則拒絕繼續執行。

## B. 前置軟體需求

請使用你的平台所提供的版本即可，測試套件不鎖定特定版本。已知可運作的組合為：

- **Node.js**（已於 v24 驗證）與 **npm**
- **Playwright** 與已安裝的 **Chromium**（`playwright` 已宣告於 `package.json`）
- **PHP** CLI（已於 8.5 驗證）
- **WP-CLI**（已於 2.12 驗證）
- **WordPress** Core（已於 7.1.1 驗證）
- **MariaDB / MySQL**（已於 MariaDB 13 驗證）
- 已存在且可啟用的 **Lumen 佈景主題**

`node`、`php`、`wp` 必須可於 `PATH` 中解析（必要時可用 `LUMEN_QA_PHP` / `LUMEN_QA_WPCLI` 覆寫）。

## C. Fixture 資產位置

兩個 fixture 輸入檔**已納入版本控制**，隨儲存庫一併提供：

```
.lumen-qa/fixtures/content.html   # 長文文章內文（Gutenberg／區塊 fixture）
.lumen-qa/fixtures/img.png        # 900x540 圖片，作為精選圖片 fixture
```

它們是測試輸入 —— **請勿重新製作或手動編輯**。驅動程式會從 `.lumen-qa/fixtures/` 讀取，
且刻意**不設任何回退機制**：若資產缺失，執行會以明確錯誤中止，而不會悄悄改用其他來源。

## D. 隔離測試環境設定

驅動程式預期以下目錄結構：

```
<專案根目錄>/
  lumen/                     # 受測佈景主題
  .lumen-qa/                 # 本測試套件
  .runtime/wordpress/        # 供 QA 使用的 WordPress 安裝
```

安全門禁會在任何 fixture 寫入之前，強制驗證下列所有條件：

| 要求項目 | 預期值 |
| --- | --- |
| 實際連線的資料庫 | `lumen_test` |
| 資料庫主機 | 本機（`localhost` / `127.0.0.1` / 本機 socket） |
| `siteurl` 與 `home` | `http://127.0.0.1:4242` |
| WordPress 根目錄（`ABSPATH`，已解析符號連結） | `<專案根目錄>/.runtime/wordpress` |
| `WP-CLI` 根目錄 與 PHP helper 根目錄 | 必須解析為同一個安裝 |

WordPress 另需具備：

- 測試管理員帳號 **`admin`**，且具備 **administrator** 角色 —— 其數字 **ID 於執行階段動態解析**，
  因此任何 ID 皆可；
- 已啟用 **Lumen 佈景主題**；
- 固定網址結構為 `/%year%/%monthnum%/%day%/%postname%/`；
- `comments_per_page = 10`、`page_comments = 1`、`default_comments_page = oldest`。

在 `.runtime/wordpress` 中架設 WordPress，以及建立／初始化 `lumen_test`，屬於**依環境而異的
手動步驟** —— 本儲存庫並未提供自動化安裝程式。請勿將破壞性資料庫指令（`wp db reset`、
`wp db clean`、`DROP DATABASE`）當作隨手一行指令執行；請先備份，並確認你正指向哪個資料庫。

### 資料庫安全門禁

驅動程式在建立任何 fixture 之前，會執行 `assertQaEnvironment()`。它會查詢實際載入的
WordPress 處理程序（而非設定檔文字），並驗證資料庫名稱、資料庫主機的區域性、`siteurl`／`home`、
解析後的 WordPress 根目錄，以及 `wp` 與 PHP helper 指向同一個安裝。任一項不符即**立即拒絕執行**
（fail closed），且不會寫入資料庫。

常數 `WP_HOME` / `WP_SITEURL` 允許存在（本安裝即以它們鎖定本機網址），但**僅在指向預期網址時**
才被接受；若指向其他位置則會被拒絕。

門禁通過後會設定 `ENV_VERIFIED` 旗標。若門禁失敗，該旗標維持為 false，`teardown()` 與後續的
乾淨狀態檢查**全部跳過**，並改寫出一份 `status: aborted` 的報告。

### 管理員 ID 動態解析

fixture 內容的作者身分，來自執行階段以登入帳號 `admin` 動態解析出的真實管理員 ID
（`resolveSiteAdminId()`），程式碼中**不硬編碼**任何使用者 ID。若該帳號不存在或角色不正確，
執行會明確失敗，而非以猜測值繼續。

## E. 啟動 Web Server

測試套件會連線至 `http://127.0.0.1:4242`。**驅動程式不會自行啟動伺服器** —— 請自行啟動並保持運作：

```bash
wp --path=.runtime/wordpress server --host=127.0.0.1 --port=4242
```

它僅監聽 loopback。執行 QA 前請先確認狀態：

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4242/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4242/wp-login.php
```

兩者皆應回傳 `200`。僅在你確知後果時才以 `LUMEN_QA_BASE` 覆寫目標 —— 安全門禁仍會要求上述
`siteurl`／`home`。

## F. 安裝依賴

在 `.lumen-qa/` 中，依 lockfile 精確安裝：

```bash
cd .lumen-qa
npm ci
```

接著確認 Chromium 瀏覽器執行檔已存在：

```bash
npx playwright install chromium
```

## G. 執行 QA

在伺服器運行且環境就緒後：

```bash
cd .lumen-qa
node qa-beta1.js
```

預期行為：

1. **安全門禁**會驗證資料庫、主機、網址與 WordPress 根目錄，並確認 `wp` 與 PHP helper 指向
   同一個安裝。任一項不符即在**建立 fixture 之前、且不觸碰資料庫**的情況下中止。
2. 建立 fixture（15 篇文章、分類、標籤、一個自訂分類法主題、12 則留言、一張精選圖片、
   一個暫時管理員）。
3. 於各視窗尺寸執行斷言；截圖寫入 `.runtime/` 之下。
4. Teardown 移除 fixture，並**還原原本的設定值**。
5. 報告寫入 `.lumen-qa/report-beta1.json`，內含 `runId`、時間戳記、`status`、各項檢查結果
   與 `clean` 旗標。

只有在完全通過時，行程結束碼才會是 `0`。

報告、日誌與截圖屬於**產生物，而非原始碼** —— 已被 git 忽略。

**失敗時**：請先閱讀目前報告與執行輸出，再檢查是否有殘留的 QA 內容，然後才考慮重新執行。
請勿盲目重跑測試套件，也請勿以弱化斷言的方式「修正」失敗。

## H. 失敗處理與故障排除

| 症狀 | 可能原因／處置 |
| --- | --- |
| 連線被拒／HTTP 000 | Web Server 未執行 —— 請見 **E**。 |
| `QA ENVIRONMENT REFUSED — database is ...` | 指向了不同的資料庫。門禁要求 `lumen_test`。 |
| `... database host is not local` | 設定的資料庫主機為遠端。QA 不會對其執行。 |
| `... siteurl/home are ...` | `siteurl`／`home` 並非 `http://127.0.0.1:4242`。 |
| `... WordPress root resolves to ...` | `.runtime/wordpress` 是符號連結／環境變數指向了其他安裝。 |
| `... WP-CLI targets ...` | `wp` 與 PHP helper 解析到不同的安裝。 |
| `missing QA fixture ...` | `.lumen-qa/fixtures/` 不完整 —— 請還原已納入版本控制的資產。 |
| `wp: command not found`／PHP 錯誤 | `wp` 或 `php` 不在 `PATH` 中；請設定 `LUMEN_QA_WPCLI` / `LUMEN_QA_PHP`。 |
| 瀏覽器啟動失敗 | 缺少 Chromium —— 執行 `npx playwright install chromium`。 |
| `site admin "admin" does not exist` | 測試管理員帳號或角色缺失／不正確 —— 請見 **D**。 |
| `... lacks the administrator role` | `admin` 使用者不具備 administrator 角色。 |

## I. Clean Checkout 可重現性限制

在本機成功執行，僅代表測試套件**在該環境中**通過。這本身**不**證明在全新機器上以
`git clone` 能端到端重現 —— 那需要另一次獨立的驗證。

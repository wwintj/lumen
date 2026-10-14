# Lumen

Lumen 是一個極簡、對 SEO 友善的 **WordPress 佈景主題**，專為中英雙語內容網站設計。
語意化、快速、行動優先、i18n 就緒，且**零 JavaScript、不含字型檔案**。

---

## 專案簡介

Lumen 是一層輕量的**呈現層**：版面、排版、色彩、導覽，以及 Gutenberg 區塊預設樣式。
商業邏輯留在外掛中（例如選用的 *Lumen Blog* 配套外掛）。Lumen 本身不附帶 JS、
不依賴框架，也沒有自訂字型檔案 —— 只有純 CSS 與一組精簡的設計變數。

## 設計理念

- **語意優先**：以 HTML5 語意標籤構成頁面，每頁僅有一個 H1。
- **無障礙**：完整鍵盤操作、跳至內容連結、`:focus-visible` 樣式、尊重 reduced-motion。
- **文字優先**：以閱讀體驗為核心，排版與間距服務於長文閱讀。
- **零依賴前端**：不使用 JavaScript 與自訂字型，換取速度與 Core Web Vitals 表現。

## 版本與發布政策

目前**正式發布**版本為 **1.1.1**（GitHub `Latest`）。`main` 分支會持續整併尚未發布的開發內容，
因此 **`main` 的內容可能領先於正式版 ZIP**。實際發布版本、下載檔案及 `Latest` 狀態，
一律以 [GitHub Releases](https://github.com/wwintj/lumen/releases) 頁面為準。

> **Commit ≠ Release（提交不等於發布）。** 一般提交合入 `main` 分支；**原始碼提交不代表正式發布**。
> 並非每個提交都會建立 tag、ZIP 或 GitHub Release。
>
> 目前不建立 Beta、RC 或 Dev 形式的 Release。正式版在公開發布前會先完成驗證，
> 再以單一穩定 Release 對外提供。權威清單請見 [GitHub Releases](#github-releases)。

三種 Git 概念務必區分：

- **Git Commit（提交）**：原始碼的變更紀錄，合入 `main` 分支。
- **Git Tag（標籤）**：指向特定提交的版本標記，一經發布即不可變更。
- **GitHub Release（發布）**：正式的發布紀錄，附帶發布說明與 ZIP 等相關資產。

> **發布狀態**：最新發布狀態、版本說明及下載檔案，
> 請以 [GitHub Releases](https://github.com/wwintj/lumen/releases) 頁面為準。

## 主要功能

- 語意化 HTML5 結構（header、nav、main、article、section、footer）；每頁單一 H1。
- **永遠可用的導覽** —— 無 JS 的水平選單，行動裝置自動換行（無漢堡選單、無鍵盤陷阱、停用 JS 仍可用）。
- 為鍵盤使用者提供的「跳至內容」連結。
- 透過 `theme.json` 支援 Gutenberg（調色盤、排版、間距、區塊樣式）。
- 響應式、行動優先（桌面／平板／行動）。
- 無障礙：地標、跳轉連結、`:focus-visible` 樣式、reduced-motion 感知、縮圖延遲載入。
- 對 Core Web Vitals 友善：零 JavaScript，CSS 保持精簡。
- 導覽選單：**Primary**（頁首）＋ **Footer**（頁尾）。
- 文章縮圖（延遲載入）、自動 feed 連結、頁尾 RSS。
- 單篇文章的上／下一篇導覽；內建留言、搜尋、404 與彙整頁。
- i18n 就緒（text domain `lumen`）；提供 `languages/lumen.pot`。
- 無硬編碼 URL；**不**輸出 schema.org 微資料（交由 SEO 外掛處理，如 Rank Math / Yoast）。
- 選用配套外掛 **Lumen Blog**（0.1.0 薄殼）。
- **頁首圖示式搜尋**（1.1.1 新增）—— 頁首預設僅顯示一個放大鏡圖示，點擊（或以鍵盤
  Enter／Space）後才展開搜尋輸入框，再次啟用即收合。以原生 HTML `<details>`／`<summary>`
  實作，**零 JavaScript**，沿用 WordPress 內建 `?s=` 搜尋，不新增外掛、不引入 AJAX、
  REST 或自動完成。

## 系統需求

- WordPress 6.3 或更新版本
- PHP 8.2 或更新版本
- MySQL 或 MariaDB（建議 MySQL 8）

## 安裝方式

### 從正式 Release 安裝（建議）

1. 至 [GitHub Releases](https://github.com/wwintj/lumen/releases) 下載最新正式版 ZIP
   （目前為 `lumen-1.1.1.zip`）。
2. 於 wp-admin：**外觀 → 佈景主題 → 安裝佈景主題 → 上傳佈景主題** → 選擇該 ZIP。
3. 啟用佈景主題。
4. *（選用）* 安裝並啟用 **Lumen Blog** 配套外掛。
5. **設定 → 閱讀**：首頁選擇 *你的最新文章*。
6. **外觀 → 選單**：分別指定 **Primary**（頁首）與 **Footer**（頁尾）選單。

### 從 `main` 原始碼安裝（開發版）

`main` 分支可能領先最新正式 Release，因此**不一定**對應任何已發布的穩定版本：

1. 將 clone 放入 `wp-content/themes/`（佈景主題資料夾須為 `lumen/`）。
2. 同上第 3–6 步。

### 歷史版本

舊版 Release 保留於 [GitHub Releases](https://github.com/wwintj/lumen/releases) 頁面，
可作為回退用途；`v1.1.0` 為 1.1.1 之前的穩定版本。

## Lumen 1.1.1 版本重點

1.1.1 為 Lumen 的正式穩定版本，在 1.1.0 的基礎上新增下列改進：

- **頁首圖示式可展開搜尋** —— 預設僅顯示放大鏡圖示，點擊或按鍵盤 Enter／Space 展開
  輸入框，再次啟用即收合。以原生 HTML `<details>`／`<summary>` 實作，**未新增任何
  Theme JavaScript**，亦未自行維護 `aria-expanded`。
- **WordPress 原生搜尋** —— `method="get"`、`action` 為 `home_url('/')`、參數為 `s`；
  未使用 Ajax、REST API 或外部搜尋服務，也未新增外掛依賴。
- **HTML ID 唯一性** —— 頁首搜尋使用獨立 id（`lumen-header-search-input`），
  與搜尋結果頁面原有的 `lumen-search` 並存時不產生重複 id；
  `lumen_search_form()` 無參數呼叫的既有行為不變。
- **Header／Footer 閱讀字體統一** —— 網站標題、頁首導覽，以及頁尾導覽、版權宣告、
  RSS 連結皆改用既有變數 `--lumen-font-reading`，與正文形成一致的閱讀字型系統。
  網站標題字重自 700 調整為 400，避免明體類中文字型被套用合成粗體而使筆畫模糊；
  字級與版面結構未變更。
- **未新增字型檔案或 CDN**，維持不捆綁字型的政策；正文、文章標題、摘要、留言區、
  Gutenberg 內容、搜尋頁與程式碼區塊的字體均未受影響。
- **公開文件完善** —— 補充 `main` 開發內容與最新正式 Release 的區別說明。

> **實際 WordPress 執行環境驗證尚未由本專案執行**，將由使用者在 WordPress VPS 上
> 自行完成。相容性宣告維持 `Requires at least: 6.3`／`Requires PHP: 8.2` 不變。

## Lumen 1.1.0 版本重點

1.1.0 為 Lumen 的正式穩定版本，彙整 `1.1.0-dev.x` 開發系列與整合預發布期間的閱讀體驗改進。
本版本包含（包括但不限於）：

- **歸檔／搜尋核心正確性** —— 歸檔 H1 標題衍生自 Core `get_queried_object()`
  （分類／標籤／任意公開自訂分類法／作者／日期歸檔，經 `wp_date()`），本地化上下文標籤
  （"Category · N posts"、"Tag · N posts"、"Author · N posts"、"N posts"，單複數經 `_n()`）、
  分類與作者描述，以及具上下文感知的清單順序（歸檔：中繼資料 → 標題 → 摘要；
  搜尋：標題 → 中繼資料 → 摘要）。
- **搜尋頁** —— 專屬 `search.php`，提供 "N result(s) for 'query'" 計數（本地化，0 筆結果時仍顯示），
  表單提交至 `home_url('/')`。
- **首頁中繼資料排版** —— 日期／分類列改用仿宋閱讀字型（小字、柔和、次要層級；版面不變）。
- **頁首／頁尾互動回饋** —— 頁首導覽與頁尾 RSS／選單連結的柔和背景懸停效果、目前頁面／分類的
  常駐作用中狀態，以及網站標題的細緻懸停效果。

目前原始碼版本：**1.1.1**。完整變更紀錄：[lumen/readme.txt](lumen/readme.txt#changelog)。
實際發布版本與下載檔案，請以 [GitHub Releases](https://github.com/wwintj/lumen/releases) 為準。

## 專案目錄結構

```
lumen/                  # 佈景主題（wp-content/themes/lumen）
  style.css             # 設計變數 + reset + 基礎排版 + 佈景主題標頭
  functions.php         # LUMEN_VERSION 常數 + 載入 inc/
  theme.json            # Gutenberg 預設值（version 2）
  header.php footer.php # 網站頁首／頁尾
  home.php single.php   # 樣板（另有 page.php search.php 404.php index.php）
  inc/                  # 設定、資源載入、樣板函式／標籤
  assets/css/main.css   # 元件／版面樣式
  languages/lumen.pot   # 翻譯字串範本
  LICENSE               # GPL v2 授權全文（隨佈景主題提供）
lumen-blog/             # 選用的薄殼配套外掛（0.1.0；不包含於 Theme ZIP）
```

## GitHub Releases

- GitHub Releases（發布狀態的權威來源）：[wwintj/lumen/releases](https://github.com/wwintj/lumen/releases)
- [lumen/readme.txt](lumen/readme.txt#changelog)：完整版本沿革。
- 請使用正式 Release 所附的 **Theme ZIP** 進行安裝；該 ZIP **不包含** Lumen Blog 外掛。
- 普通 Git Commit 不是正式發布；原始碼中的開發版本不代表對外提供多個正式下載包。

## 相關文件與資源

- [TESTING.md](TESTING.md) —— 測試與驗證說明。
- [.lumen-qa/README.md](.lumen-qa/README.md) —— Beta 執行階段 QA 測試套件使用說明。
- [lumen/readme.txt](lumen/readme.txt) —— 佈景主題資訊與版本沿革。

## 實際使用範例

- [zhec.org](https://zhec.org) —— 使用 Lumen 的實際網站範例。

> 此為社群實際使用案例，**不代表**該站已通過任何正式相容性或主題審查認證。

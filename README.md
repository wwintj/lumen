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

| 版本 | 狀態 | 用途 |
|---|---|---|
| **1.0.0** | **穩定版 —— `Latest`** | 正式營運環境。目前推薦的發布版本。 |
| **1.1.0-beta.1** | **Beta**（預發布） | Lumen 1.1.0 的整合預發布（歸檔／搜尋核心正確性 ＋ 文字優先設計）。不適用於正式營運環境。 |
| **1.1.0** | 規劃中 | 最終穩定版本。 |

> **Commit ≠ Release（提交不等於發布）。** 一般提交合入 `main`；中途提交**不會**產生
> tag、ZIP 或 GitHub Release。發布依階段推進：`1.1.0-dev.11`（最終開發建置，不可變更）
> → `1.1.0-beta.1` →（如需）`beta.2` → `rc.1` → `1.1.0` → `1.1.1+` 修補版本。
>
> **穩定版**（`1.0.0`）與 **1.1.0 預發布**是兩條獨立的版本線：在 1.1.0 穩定之前，1.0.0 持續
> 作為 *Latest* 發布；每個 1.1.0 預發布（dev、beta、rc）一律以**預發布**形式發布，永不標記為
> Latest。權威清單請見 [GitHub Releases](#github-releases)。

三種 Git 概念務必區分：

- **Git Commit（提交）**：原始碼的變更紀錄，合入 `main` 分支。
- **Git Tag（標籤）**：指向特定提交的版本標記，一經發布即不可變更。
- **GitHub Release（發布）**：正式的發布紀錄，附帶發布說明與 ZIP 等相關資產。

> **現況說明**：`1.1.0-beta.1` 的原始碼已在 `main` 分支完成開發與 QA 驗證，
> 但**尚未建立對應的 GitHub Beta Release**。原始碼存在於 `main`，不等於已正式發布。

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

## 系統需求

- WordPress 6.3 或更新版本
- PHP 8.2 或更新版本
- MySQL 或 MariaDB（建議 MySQL 8）

## 安裝方式

1. 下載／複製佈景主題資料夾。
2. 於 wp-admin：**外觀 → 佈景主題 → 安裝佈景主題 → 上傳佈景主題** → 選擇 `lumen-*.zip`
   發布檔，或將 clone 放入 `wp-content/themes/`（佈景主題資料夾為 `lumen/`）。
3. 啟用佈景主題。
4. *（選用）* 安裝並啟用 **Lumen Blog** 配套外掛。
5. **設定 → 閱讀**：首頁選擇 *你的最新文章*。
6. **外觀 → 選單**：分別指定 **Primary**（頁首）與 **Footer**（頁尾）選單。

## Lumen 1.1.0 開發進度

`1.1.0-dev.x` 系列（最終開發建置：**1.1.0-dev.11**，不可變更）與整合預發布
**1.1.0-beta.1**，在不更動穩定線的前提下持續精進 Lumen 1.1.0 的閱讀體驗。
近期建置新增（包括但不限於）：

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

目前建置與完整變更紀錄：[GitHub Releases](https://github.com/wwintj/lumen/releases)。

穩定版 **1.0.0** 維持不變，仍為正式營運的 "Latest" 發布。

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
lumen-blog/             # 選用的薄殼配套外掛（0.1.0）
```

## GitHub Releases

- GitHub Releases：[wwintj/lumen/releases](https://github.com/wwintj/lumen/releases)
- [lumen/readme.txt](lumen/readme.txt#changelog)：完整版本沿革。
- **1.0.0** 為 `Latest` 發布（在 1.1.0 穩定之前維持）。
- 所有 1.1.0 預發布（`1.1.0-dev.11`、`1.1.0-beta.1`、`rc.1`…）皆為**預發布**，永不標記為
  `Latest`。沒有逐提交的 tag／ZIP／Release；提交合入 `main`，發布依階段門控
  （`1.1.0-dev.11` → `1.1.0-beta.1` →（如需）`beta.2` → `rc.1` → `1.1.0` → `1.1.1+`）。

## 相關文件與資源

- [TESTING.md](TESTING.md) —— 測試與驗證說明。
- [.lumen-qa/README.md](.lumen-qa/README.md) —— Beta 執行階段 QA 測試套件使用說明。
- [lumen/readme.txt](lumen/readme.txt) —— 佈景主題資訊與版本沿革。

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

目前**正式發布**版本為 **1.1.4**（GitHub `Latest`）。`main` 分支會持續整併尚未發布的開發內容，
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
- **頁首圖示式全域搜尋**（1.1.1 新增，1.1.2 調整版面，1.1.3 改為原生 Popover，
  1.1.4 視覺柔化）—— 頁首預設僅顯示一個放大鏡圖示；點擊（或以鍵盤 Enter／Space）後於瀏覽器
  **可視區域正中央**開啟單一搜尋輸入框。搜尋框為**完整膠囊造型**（圓角 999px），
  背景中性淺灰並搭配 1px 低對比邊框與單一邊界；聚焦時顯示**柔和綠色**焦點環。
  開啟時背景以半透明淺色底加上 `blur(6px)` 霧化，使後方文字明顯失焦、注意力集中於搜尋框。
  再次點擊圖示、按 `Esc` 或點擊浮層外部皆可關閉。
  以原生 HTML Popover API（`popover="auto"` 搭配原生按鈕 `popovertarget`）實作，
  **零 JavaScript**，沿用 WordPress 內建 `?s=` GET 搜尋，按 Enter 即前往搜尋結果頁；
  不新增外掛、不引入 AJAX、搜尋建議或自動完成。彈出視窗內只有一個輸入框，
  沒有標題、說明文字、第二個放大鏡、送出按鈕、關閉按鈕或底部說明。
  1.1.3 起桌面版頁首改為左右對齊。
- **日期與分類膠囊標籤**（1.1.2 新增）—— 部落格首頁、歸檔頁與搜尋結果頁的日期與分類
  統一為膠囊標籤，多個分類各自獨立成一個可點擊的膠囊。
- **純箭頭膠囊分頁與導覽**（1.1.2 新增）—— 部落格首頁分頁與單篇文章上／下一篇導覽
  只顯示 `←`／`→`，仍完全使用 WordPress Core 原生連結與方向邏輯；
  螢幕閱讀器名稱由視覺隱藏文字提供，缺少目標時整顆膠囊收合。

## 系統需求

- WordPress 6.3 或更新版本
- PHP 8.2 或更新版本
- MySQL 或 MariaDB（建議 MySQL 8）

## 安裝方式

### 從正式 Release 安裝（建議）

1. 至 [GitHub Releases](https://github.com/wwintj/lumen/releases) 下載最新正式版 ZIP
   （目前為 `lumen-1.1.4.zip`）。
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
可作為回退用途；`v1.1.3` 為 1.1.4 之前的穩定版本，`v1.1.2`、`v1.1.1`、`v1.1.0` 為更早的穩定版本。

## Lumen 1.1.4 版本重點

1.1.4 為 Lumen 的正式穩定版本，在 1.1.3 的基礎上完成全域搜尋的視覺柔化。
**搜尋功能與互動完全未變更**，僅調整外觀。

1. **搜尋框改為完整膠囊造型** —— 彈出視窗與內部輸入框統一使用 `border-radius: 999px`，
   與首頁日期、分類膠囊及箭頭分頁的既有視覺語彙一致。1.1.3 的輸入框雖寫了 `border-radius: inherit`，
   但因直接父層是 `<form>` 而非浮層，實際解析為 `0px`。
2. **消除突兀的黑色邊框** —— 1.1.3 的聚焦外框使用 `--lumen-accent`（`#1b1b1b`，接近黑色）
   並向內偏移 `-2px`，在 `autofocus` 觸發的瞬間即被視為黑色粗框。1.1.4 改為**柔和綠色**
   `#176d39`（與分類膠囊同色系），並改為**向外偏移 2px**，維持鍵盤可存取性且不再有壓迫感。
   綠色僅以元件層級 CSS 變數套用於全域搜尋，全站 `--lumen-accent` 與其他表單元件不受影響。
3. **背景改為柔和霧化遮罩** —— 由原本的 `rgba(0,0,0,0.10)`（無模糊）改為半透明淺色底
   `rgba(248,249,248,0.68)` 加上 `blur(6px) saturate(0.9)`，使後方標題與正文明顯失焦。
   實測正文對比度下降約 **93%**；不支援 `backdrop-filter` 的瀏覽器仍有約 **68%** 的降幅。
   整體保持輕量，不會變成深黑色模態遮罩。

既有功能全部保留：桌面 Header 左右對齊、手機 M2 版面、日期與分類膠囊、
首頁純箭頭分頁、單篇純箭頭導覽、頁首與頁尾字體、文章閱讀字體皆未變更。
本次僅修改 `lumen/assets/css/main.css` 一個功能檔案，未更動任何 HTML 模板。

> **驗證狀態**：本版已於 Chromium 與 Google Chrome 完成真實滑鼠點擊、計算樣式、
> 截圖差異與像素分析驗證。**WordPress 實際執行環境驗證（WordPress Runtime QA）尚未執行**，
> 將由使用者下載 ZIP 後在自己的 WordPress 網站完成。
> Firefox 與 WebKit／Safari 因測試環境無對應瀏覽器而未執行。

## Lumen 1.1.3 版本重點

1.1.3 為 Lumen 的正式穩定版本，在 1.1.2 的基礎上完成下列兩項改進：

1. **桌面版頁首改為左右對齊** —— 網站標題或 Custom Logo 貼齊容器左緣，搜尋圖示與主要導覽
   組成一個群組整組靠右，最後一個選單項目的右緣與頁尾 RSS 的右緣一致。取消先前用於強制
   置中導覽的三欄 Grid，並移除左右平衡用的空白 Spacer，改用單純的 flex 自動邊距。
   頁首字體、導覽 hover／active 顏色與字級皆未變更；行動版維持既有的兩列配置（M2）。
2. **全站搜尋改為原生 HTML Popover** —— 點擊頁首放大鏡後，於瀏覽器可視區域正中央開啟
   單一搜尋輸入框，背景以 `::backdrop` 輕微變暗。開啟與關閉（再次點擊、`Esc`、點擊外部）
   全部交由瀏覽器原生 Popover API 處理，**零 JavaScript**。按下 Enter 沿用 WordPress
   原生 GET 搜尋前往結果頁，支援中文、英文、空白與特殊字元。

既有功能全部保留：日期與分類膠囊標籤、純箭頭膠囊分頁與導覽、頁首與頁尾字體、
文章閱讀字體與搜尋結果頁排版皆未變更。

> **驗證狀態**：本版已於 Chromium 與 Google Chrome 完成真實滑鼠點擊、鍵盤操作、
> 焦點行為與版面座標驗證。**WordPress 實際執行環境驗證（WordPress Runtime QA）尚未執行**，
> 將由使用者下載 ZIP 後在自己的 WordPress 網站完成。

## Lumen 1.1.2 版本重點

1.1.2 為 Lumen 的正式穩定版本，在 1.1.1 的基礎上完成下列四項 UI 調整：

- **頁首搜尋版面調整** —— 搜尋圖示不再孤立於頁首最右端，而是與主要導覽視為同一個視覺群組：
  桌面版將兩者一起置中，圖示緊接在第一個導覽連結之前（間距約 16px）；網站標題或 Custom Logo
  維持靠左，超長標題與長導覽文字會自然換行降級，不會互相重疊。
- **行動版兩列配置（M2）** —— 第一列為品牌與右側搜尋圖示，第二列為可自由換行的主要導覽；
  搜尋面板改為對齊整個頁首區域下方浮出，展開時不遮蓋第二列導覽，也不推動導覽位移。
- **搜尋圖示與面板簡化** —— 移除灰色矩形底色、明顯邊框與按鈕感，預設只保留簡潔線條放大鏡
  （桌面點擊區域 36px、行動版 44px，焦點樣式維持可見）；展開後的面板僅保留單一輸入框
  （約 250×40px、淺灰 1px 邊框、圓角 4px），不再輸出第二個送出按鈕，按 Enter 即沿用
  WordPress 原生 `?s=` 搜尋送出。Header 高度不變、導覽不位移，全程仍為**零 JavaScript**。
- **日期與分類膠囊標籤** —— 部落格首頁、分類／標籤／作者／日期等歸檔頁，以及搜尋結果頁
  統一使用灰色日期膠囊（`#F0F1F2`／`#52565C`）與綠色分類膠囊（`#E0F3E5`／`#176D39`），
  字級 13px、圓角 999px、內距 `4px 10px`、間距 8px，無陰影、無漸層、無圖示；
  多個分類各自獨立成一個膠囊並可換行。同時移除上述列表情境中日期與分類之間的中點
  （`·`）分隔符；**單篇文章頁 `.lumen-single-meta` 的既有外觀與分隔樣式完全未變**。
  列表順序維持不變：首頁與歸檔頁為「膠囊 → 標題 → 摘要」，搜尋結果頁維持
  「標題 → 膠囊 → 摘要」。
- **純箭頭膠囊分頁與導覽** —— 部落格首頁分頁與單篇文章上／下一篇導覽改為純箭頭膠囊
  （52×44px、背景 `#F0F1F2`、箭頭 `#52565C`、圓角 999px、無陰影），視覺上只顯示
  `←` 與 `→`，不再顯示 Previous／Next 文字或文章標題。仍完全使用 WordPress Core 的
  `previous_posts_link()`／`next_posts_link()`／`the_post_navigation()`，未自行計算頁碼、
  未修改 `WP_Query`、未重寫文章查找邏輯，箭頭方向依 Core 實際輸出的
  `nav-previous`／`nav-next` 對應。整個膠囊皆可點擊，螢幕閱讀器名稱由視覺隱藏文字提供
  （`Previous page`／`Next page`、`Previous post: <標題>`／`Next post: <標題>`）；
  缺少目標時該側整顆膠囊收合為 `display: none`，不留空膠囊或孤立箭頭；
  行動版維持左右分佈，不再縱向堆疊。
- **未新增任何 Theme JavaScript、外部字型或圖示庫**，亦未變更 `theme.json`、
  `Requires at least`、`Requires PHP` 與 `Tested up to`。新增 5 個可翻譯字串並同步更新
  `languages/lumen.pot`。

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

目前原始碼版本：**1.1.4**。完整變更紀錄：[lumen/readme.txt](lumen/readme.txt#changelog)。
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

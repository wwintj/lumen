=== Lumen ===
Contributor Name: Lumen Team
Contributor URI: https://github.com/wwintj
Author: Lumen Team
Author URI: https://github.com/wwintj
Homepage URL: https://github.com/wwintj/lumen
Version: 1.1.15
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 8.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lumen
Domain Path: /
Tags: blog, content, minimalist, responsive-layout, custom-menu, translation-ready, rss-icons

極簡、對 SEO 友善的內容部落格佈景主題，專為中英雙語網站設計。1.1.15 為 Lumen 的正式穩定版本，在 1.1.0 的歸檔與搜尋核心正確性、文字優先閱讀排版，以及零 Theme JavaScript 設計之上，於 1.1.1 新增頁首圖示式可展開搜尋並統一 Header／Footer 閱讀字體，1.1.2 進一步調整頁首搜尋與導覽的版面、為列表加上日期與分類膠囊標籤，並將首頁分頁與單篇文章導覽改為純箭頭膠囊，1.1.6 精修分類頁頂部介紹區，1.1.7 進一步校正該介紹區的版式節奏，1.1.8 讓分類頁第一篇文章與分隔線的間距對齊首頁節奏並改為低飽和暗紫色統計膠囊，1.1.9 收緊分類頁標題與統計膠囊之間的垂直留白，1.1.10 將該留白進一步收至約 4px，1.1.11 則將分類介紹面板的上下內距縮減一半，1.1.12 進一步將分類標題與統計膠囊改為同行垂直居中，並修正面板上下實際可見留白不對稱的問題，1.1.13 則為手機端分類頁補上更舒適的左右可見留白，1.1.14 進一步統一分類頁文章分隔線的上下留白並與首頁對齊，1.1.15 將單篇文章頁頂部中繼資料改為與列表一致的日期／分類膠囊樣式（並移除圓點分隔符），同時把留言區改為極簡柔和的淺灰氣泡風格（虛線分隔、作者／日期／Reply 同行、綠色膠囊動作）並完整支援遊客留言。

== Features ==
* 語意化 HTML5 結構（header、nav、main、article、section、footer）。
* 每頁單一 H1；標題層級正確。
* 永遠可用的導覽：無 JS 的水平選單，行動裝置自動換行（無漢堡選單、無鍵盤陷阱、停用 JS 仍可用）。
* 為鍵盤使用者提供的「跳至內容」連結。
* 支援 Gutenberg：theme.json 調色盤、排版、間距與區塊樣式（全出血對齊、圖庫、引言）。
* 響應式（行動優先）—— 桌面、平板、行動。
* 無障礙：語意地標、跳轉連結、focus-visible 樣式、reduced-motion 感知、縮圖延遲載入。
* 對 Core Web Vitals 友善：零 JavaScript、無框架、單一 CSS 檔案。
* 導覽選單：Primary ＋ Footer。
* 文章縮圖（延遲載入）、自動 feed 連結、頁尾 RSS。
* 單篇文章的上／下一篇導覽。
* 內建留言、搜尋、404 與彙整頁。
* i18n 就緒：完整翻譯支援（文字域 `lumen`）；提供 languages/lumen.pot。
* 無硬編碼 URL（home_url / site_url / get_template_directory_uri / get_template_directory()）。
* 佈景主題不輸出 schema.org 微資料 —— 交由 SEO 外掛（Rank Math / Yoast）處理，避免重複。
* 可搭配 Lumen Blog 配套外掛（0.1.0 僅為薄殼啟動）。

== Requirements ==
* WordPress 6.3 或更新版本。
* PHP 8.2 或更新版本。
* MySQL 8 或更新版本。

== Installation ==
1. 下載／複製 Lumen 佈景主題資料夾。
2. 於 wp-admin：外觀 > 佈景主題 > 安裝佈景主題 > 上傳佈景主題 > 選擇佈景主題 zip。
3. 啟用佈景主題。
4. （建議）安裝並啟用 Lumen Blog 配套外掛（薄殼啟動；0.1.0 尚無功能）。
5. 設定 > 閱讀：首頁選擇「你的最新文章」。
6. 設定 > 外觀 > 選單：指定 Primary 選單（如需亦可指定 Footer 選單）。

== Companion plugin: Lumen Blog (0.1.0) ==
在 0.1.0 版，此外掛僅為薄殼啟動：外掛標頭、LBN_VERSION 常數，以及文字域載入（lumen-blog），
讓日後擴充具備 i18n 基礎。它不含功能、不含 UI、不含 REST 端點，除文字域載入外沒有其他 hook。
具體功能（自訂內容類型、表單、REST API）僅在出現明確需求時，才於後續階段加入（YAGNI）。

== Changelog ==
* 1.1.15 (Stable release)
  * 單篇文章頁頂部中繼資料改為與首頁／分類頁一致的**膠囊樣式**：
    日期為淺灰底膠囊、分類為淺綠底膠囊，並**移除日期與分類之間的圓點分隔符**。
  * 留言區改為**極簡、柔和、統一**的視覺語言：留言正文改為淺灰「聊天氣泡」
    （WhatsApp 風格但保留部落格閱讀感），留言之間以**淺灰虛線**分隔，
    作者名稱改為灰色膠囊，日期與 Reply 與作者名稱**同一行**排列，
    Reply 與送出按鈕改為**綠色膠囊按鈕**。
  * 留言區不再輸出任何可見標題：`Comments`、`Comments (N)`、`Leave a comment`
    皆已移除；`#comments` landmark 與 `aria-label` 保留，維持語意與可存取性。
  * 無留言且留言開放時，只顯示表單（不再顯示「No comments yet」樣板文字）；
    留言關閉且無留言時，完全不輸出留言區塊。
  * 評論輸入框加上 `Write your comment...` placeholder；
    原生 `<label>` 保留於 DOM 並以無障礙方式視覺隱藏，不以 placeholder 取代標籤。
  * 留言送出按鈕由原本的生硬黑底改為與全站一致的**柔和綠色膠囊**。
  * 遊客留言（未登入）沿用 WordPress 原生權限模型：當站點設定允許未註冊留言時，
    主題完整呈現 Name／Email／Website／Comment 欄位並接受送出；
    主題**不會**、也**不得**在任何站點設定下強制開放遊客留言。
  * 未新增任何 JavaScript、外部字型、外部資源或外掛依賴；首頁、分類頁、
    搜尋頁、頁面與 404 的既有凍結樣式不變。
* 1.1.14 (Stable release)
  * 修正分類頁文章列表中，**分隔線下方留白不足**的問題，使分隔線上下留白一致，
    並與首頁既有的垂直節奏完全對齊。
  * 問題根因有兩處：
    1. 共用文章列表只有「上一篇文章的底部內距」，**缺少首頁對應的
       「下一篇文章頂部內距」**。首頁以 `--lumen-home-divider-gap` 同時作為
       上一頁的 `padding-bottom` 與下一頁的 `padding-top`，因此分隔線上下等距；
       分類頁只有前者，導致第二篇之後的日期膠囊過於貼近分隔線。
    2. 分隔線上方的數值固定為 `1.75rem`（首頁的**行動端**數值），
       使桌機版比首頁的 `2rem` 少了 4px。
  * 另有一項在量測中才發現的細節：文章列表為 CSS Grid，而
    `post-list.php` 中 `<li>` 之間的換行空白會形成容器的行內格式化上下文，
    其 strut 使每個 grid row 多出約 6px（實測恰為 5.94px，
    即繼承行高 28.9px 與字級 17px 之差的一半），
    這正是下一篇日期膠囊距離分隔線變成 38px 而非首頁 32px 的原因。
    由於本輪**不得修改 PHP 模板**，改以 CSS 中和該 strut，
    並在文章卡片上明確還原字級，實測 meta／標題／摘要的字級完全不變。
  * 修正後新增 `--lumen-category-post-divider-gap`（桌機 `2rem`、
    行動端 `1.75rem`），僅作用於 `body.category`：
    非最後一篇的 `padding-bottom` 與第二篇之後的 `padding-top` 皆採用此值。
    第一篇文章**不额外增加**頂部內距，避免與分類介紹區分隔線的既有
    `margin-block-end` 形成雙重間距。
  * 於 320／360／361／390／430／600／767／768／769／860／861／1024／1440／1920
    共 14 種寬度實測：行動端分隔線上下皆為 **28px**、桌機皆為 **32px**，
    與首頁對應數值**逐值相同**，誤差 0px。
  * 逐像素比對：**首頁、標籤、日期、作者、搜尋、單篇文章、頁面、404
    與 1.1.13 完全相同（0 個差異像素）**；
    分類頁在分隔線之前的畫面（介紹面板、介紹區分隔線、第一篇文章位置）
    亦逐像素相同。
  * 文章內部節奏（Meta → 標題 → 摘要）、最後一篇文章的無分隔線規則、
    1px 分隔線寬度均維持不變；內容變化（無摘要、多行中文標題、
    長英文無空格標題、分頁、單篇、空分類）共 117 組檢查全部通過。
  * 分類介紹面板、統計膠囊、手機端左右 Gutter（34px／36px）、
    標題同行垂直居中、日期與分類膠囊配色全部維持不變。
  * **僅修改 `assets/css/main.css`**，未修改任何 PHP、HTML 或文章模板；
    未新增任何 JavaScript。

* 1.1.13 (Stable release)
  * 修正分類頁在**手機端橫向留白不足**的問題，為淺綠色介紹面板補上
    左右各約 **16px** 的可見外部留白。
  * 問題根因並非留白數值過小，而是**負 Margin 溢出機制把橫向內距完全抵消**：
    行動端 `--lumen-cat-intro-gutter` 與面板 `--lumen-cat-intro-pad-x` 相等，
    使 `margin-inline: calc(-1 * min(pad-x, room))` 的抵銷量剛好等於內距。
    實測 320px 至 768px 的綠色面板左右可見留白皆為 **0px**，面板緊貼畫面邊緣。
  * 修正方式為**只提高 Archive Wrap 的橫向 Gutter**，使其高於面板橫向內距：
    一般行動端 20px → **36px**、超窄螢幕 18px → **34px**。
    由於溢出量受 `pad-x` 上限約束，`gutter - pad-x` 的差額即成為面板外的真實留白，
    面板內部文字位置完全不動。
  * **未修改** `--lumen-cat-intro-pad-x`（維持 20px／18px）、
    `--lumen-cat-intro-pad-y` 與負 Margin 公式，因此既有的內容左對齊機制完整保留。
  * 於 320／360／361／375／390／430／600／720／767／768 共 10 種行動端寬度實測，
    綠色面板左右留白**皆精確增加 16px 且左右完全對稱**，無任何橫向溢出。
  * 文章列表、文章標題、摘要、日期膠囊、分類膠囊與分隔線**同步內縮並保持一致**：
    標題／膠囊／描述／Meta／文章標題／摘要／第二篇文章標題的左緣誤差為 **0px**，
    介紹區分隔線與文章分隔線的左右邊界**逐值相同**。
  * **769px 以上完全未變**：平板（769–860px）、861px 與桌機的
    Gutter、內距與面板邊界逐值與 1.1.12 相同。
  * 非分類頁面（首頁、標籤、日期、作者、搜尋、單篇文章、頁面、404）
    於 7 種寬度逐像素比對，**與 1.1.12 完全相同（0 個差異像素）**；
    分類頁在 769px 以上亦逐像素相同。
  * 上下光學平衡、標題與統計膠囊同行垂直居中（0.00px）、
    固定 40px 行高、膠囊配色與文章垂直節奏全部維持不變。
  * **僅修改 `assets/css/main.css` 中的兩個 Gutter 變數賦值**，
    未新增或移除任何選擇器，未修改任何 PHP、HTML 或文章模板。
  * 未新增任何 JavaScript，維持零 Theme JavaScript 設計。

* 1.1.12 (Stable release)
  * 重新組織分類頁頂部介紹面板，將**分類標題與統計膠囊排在同一行並垂直居中**。
  * 統計膠囊改為置於分類名稱右側，兩者水平間距固定 **16px**；
    於 320／360／361／390／768／769／860／861／1024／1440／1920
    共 11 種寬度實測，**標題與膠囊的中心垂直誤差為 0.00px**。
  * 修正**面板上下實際可見留白不對稱**的問題：以真實螢幕像素逐列掃描量測，
    修正前最大偏差為 13px，修正後降至 **2px 以內（多數寬度為 0～1px）**。
  * 不對稱的根因並非內距，而是標題使用了**比例行高**，
    使行框半行距隨 `clamp()` 字級放大而增加（量測值自 360px 的 8px 成長至 1440px 的 16px），
    因此改為在標題列內將 `<h1>` 行高固定為 **40px**，使半行距不再隨字級變動。
  * 為維持「緊湊、極簡」，**未以加大底部內距的方式偽造對稱**：
    上下內距在每個斷點皆保持相等，面板因標題與膠囊共用一行而變得更矮
    （桌機 191.78px → 141.59px）。
  * 描述文字維持在標題列下方，順序為標題 → 統計膠囊 → 描述；
    僅在描述存在時才套用標題列至描述的間距。
  * 新增 `overflow-wrap: anywhere` 與 `min-width: 0`，
    避免超長單字分類名稱造成水平溢出（此問題在 1.1.11 已存在）。
  * **僅修改 `index.php` 與 `assets/css/main.css` 兩個檔案**；
    標題字體、字級、字重、描述字級與行高、全域排版變數皆未變更。
  * 非分類頁面（首頁、標籤、日期、作者、搜尋、單篇文章、頁面、404）
    於 6 種寬度逐像素比對，**與 1.1.11 完全相同（0 個差異像素）**。
  * 未新增任何 JavaScript，維持零 Theme JavaScript 設計。

* 1.1.11 (Stable release)
  * 將分類頁淺綠色介紹面板的**上下內距縮減為原本的一半**，
    使面板更緊湊，同時**頂部與底部保持完全對稱**。
  * 三種斷點的縱向內距皆精確減半：
    桌機（>860px）28px → **14px**、
    行動／平板（361–860px）20px → **10px**、
    超窄螢幕（≤360px）18px → **9px**。
  * 於 320／360／361／390／768／769／860／861／1024／1440／1920
    共 11 種寬度實測，**上下內距完全相等**，
    且「H1 頂端至面板頂部」與「描述底端至面板底部」皆精確等於該內距值。
  * 面板高度相應減少：桌機 −28px、行動 −20px、超窄 −18px，全部符合預期。
  * **僅修改三處 `--lumen-cat-intro-pad-y` 變數賦值**，未新增或移除任何選擇器。
  * **橫向內距完全未變**（32px／20px／18px），維持 v1.1.7 完成的左邊線對齊機制；
    `margin-inline`、`padding` shorthand、`--lumen-cat-intro-pad-x` 皆逐字未變。
  * 標題至統計膠囊的 **4px** 間距未變；膠囊至描述的間距未變；
    標題與描述的樣式、字級、行高、顏色未變。
  * 淺綠色面板（`#eef6ef`）、圓角（16px／14px）、暗紫色統計膠囊
    （`#d8cbea`／`#49375f`、`999px`、`4px 12px`、13px）完全未變。
  * **面板外部間距完全未變**：「Header 分隔線 → 面板」與「面板 → 分隔線」
    維持 24／20／18px 對稱，「分隔線 → 第一篇文章」維持桌機 32px、≤768px 為 28px。
    `.lumen-category-intro-divider` 與 `body.category .lumen-site-main` 逐字未變。
  * 文章列表間距、日期膠囊（`#f0f1f2`／`#52565c`）與分類綠色膠囊
    （`#e0f3e5`／`#176d39`）完全未變。
  * 首頁、標籤、日期、作者、搜尋、單篇文章、頁面、404 逐像素與 1.1.10 相同。
  * 本次僅修改 `lumen/assets/css/main.css`，未修改任何模板與 JavaScript。
* 1.1.10 (Stable release)
  * 再次收緊分類頁「分類標題 → `Category · N posts` 統計膠囊」之間的垂直留白，
    由 1.1.9 的 14px 進一步縮小至 **約 4px**（約為原本的 28.6%）。
  * 實作僅將分類頁標題的 `margin-bottom` 由 `0.75rem`（12px）改為 `2px`。
    由於膠囊位於行內格式化上下文，其行盒會額外貢獻約 2px 的支柱空白，
    因此 **CSS 值為 2px，實際量測 DOM 間距為 4px**。
  * 於 320／360／390／768／769／860／1024／1440／1920 共 9 種寬度
    **實測皆為 4px**，7 種分類頁情境（一般／無描述／單篇／多篇／空／長標題／分頁第 2 頁）
    全部一致。
  * 107 字元長分類名稱在 2～6 行換行下，間距仍為 4px，左對齊保持、無重疊、無溢出。
  * 未新增或移除任何選擇器；僅修改既有規則中的一行屬性。
  * 共用的 `.lumen-archive-wrap .lumen-archive-title` 規則**逐字未變**，
    標籤／日期／作者／搜尋彙整頁仍維持 24px 節奏。
  * 標題的字體、字級、字重、行高、字距與顏色（`#1b1b1b`）皆未變更。
  * 暗紫色統計膠囊（`#d8cbea`／`#49375f`、`999px`、`4px 12px`、13px）
    尺寸與顏色完全未變。
  * 淺綠色介紹面板（`#eef6ef`）、圓角與內距未變；面板上下內距對稱
    （18/18、20/20、28/28）與「分隔線 → 第一篇文章」距離
    （桌機 32px、≤768px 為 28px）皆未改變。
  * 面板因內容變緊而自然變矮 10px，其下方元素僅隨文件流整體上移。
  * 文章列表日期膠囊（`#f0f1f2`／`#52565c`）與分類綠色膠囊
    （`#e0f3e5`／`#176d39`）完全未變。
  * 首頁、標籤、日期、作者、搜尋、單篇文章、頁面、404 逐像素與 1.1.9 相同。
  * 本次僅修改 `lumen/assets/css/main.css`，未修改任何模板與 JavaScript。
* 1.1.9 (Stable release)
  * 收緊分類頁「分類標題 → `Category · N posts` 統計膠囊」之間的垂直留白，
    由原本的 24px 下邊距減半為 12px（`0.75rem`）。
  * 此調整僅作用於分類頁介紹面板內的標題（`.lumen-category-intro .lumen-archive-title`），
    共用的 `.lumen-archive-wrap .lumen-archive-title` 規則完全未動，
    標籤／日期／作者／搜尋彙整頁仍維持原有 24px 節奏。
  * 未新增或移除任何選擇器；僅在既有規則中新增一行 `margin-bottom` 宣告。
  * 標題的字體、字級、字重、行高、字距與顏色（`#1b1b1b`）皆未變更。
  * 暗紫色統計膠囊（`#d8cbea`／`#49375f`、`999px`、`4px 12px`、13px）
    尺寸與顏色完全未變。
  * 淺綠色介紹面板（`#eef6ef`）、圓角與內距未變；
    面板上下對稱（24/24、20/20、18/18）與「分隔線 → 第一篇文章」
    距離（桌機 32px、≤768px 為 28px）皆未改變。
  * 文章列表日期膠囊（`#f0f1f2`／`#52565c`）與分類綠色膠囊
    （`#e0f3e5`／`#176d39`）完全未變。
  * 首頁、搜尋、單篇文章、404、標籤、日期、作者彙整頁逐像素與 1.1.8 相同。
  * 本次僅修改 `lumen/assets/css/main.css`，未修改任何模板與 JavaScript。
* 1.1.8 (Stable release)
  * 分類頁分隔線與第一篇文章之間的間距改為與首頁文章分隔線節奏一致：
    桌機（>768px）32px、行動裝置（≤768px）28px，實測 320–1920px 共 9 種寬度皆與首頁相同。
  * 為此將 `.lumen-category-intro-divider` 的 `margin-block` 拆分為獨立的
    `margin-block-start`（面板→分隔線）與 `margin-block-end`（分隔線→第一篇文章）。
    上方維持 1.1.7 已驗收的對稱值 24px／20px／18px，不受影響。
  * 新增分類頁專屬變數 `--lumen-cat-intro-gap-below`（2rem，≤768px 為 1.75rem），
    未讀取或修改首頁的 `--lumen-home-divider-gap`。
  * 分類統計膠囊由淡紫改為**低飽和暗紫色**：`#d8cbea` 底、`#49375f` 字，
    對比 6.84:1（WCAG AA）。較 1.1.7 的 `#ece7f6` 明顯更深，飽和度仍僅 13%。
  * 膠囊幾何完全未變（`inline-flex`、`4px 12px`、`999px`、13px／1.4、相同外距），
    文字仍由 WordPress 動態產生（`found_posts`、單複數與 i18n 未動）。
  * 分類介紹面板淺綠底色（`#eef6ef`）、標題色（`#1b1b1b`）、圓角與內距皆未變。
  * 文章列表日期膠囊（`#f0f1f2`／`#52565c`）與分類綠色膠囊（`#e0f3e5`／`#176d39`）
    完全未變；首頁、搜尋、單篇文章、404、標籤、日期、作者彙整頁逐像素與 1.1.7 相同。
  * 本次僅修改 `lumen/assets/css/main.css`，未修改任何模板與 JavaScript。
* 1.1.7 (Stable release)
  * 分類頁介紹面板的左右內距改以等量負邊界抵銷，使面板內的標題、統計膠囊與描述，
    與下方第一篇文章的標題／摘要／meta 共用同一條左側垂直基線（A2）。
  * 面板左右改為對稱溢出閱讀欄；窄螢幕為分類頁加上與內距等寬的留白，
    讓文字仍精準落在欄位邊緣，且 320–1920px 全區間皆無橫向溢出。
  * 介紹面板上下留白改為對稱：頁首下緣分隔線到面板、面板到列表分隔線，桌面皆為 24px，
    行動裝置 20px、≤360px 為 18px（A3）。
  * 面板與列表之間維持獨立 1px 淺灰分隔線（#dde1e2），第一篇文章因此與後續文章
    共用同一套「分隔線 + meta + 標題 + 摘要」節奏，不再是特例（A4）。
  * 分類統計膠囊由淡藍改為淡紫（#ece7f6 底、#3d3357 字，對比 9.58:1 / WCAG AAA），
    與淺綠面板及下方綠色分類膠囊在色相上明確區隔（B）。
  * 文章列表的日期膠囊（#f0f1f2／#52565c）與分類綠色膠囊（#e0f3e5／#176d39）完全未變；
    首頁、搜尋、單篇文章、404、標籤、日期、作者彙整頁逐像素與 1.1.6 相同。
  * 本次僅修改 lumen/assets/css/main.css，未新增或修改任何模板與 JavaScript，
    並以 body.category 作用域限定，不使用 :has()，維持零 Theme JavaScript 設計。
* 1.1.6 (Stable release)
  * 分類頁頂部介紹區改為淺綠色圓角面板（#eef6ef），讓「分類說明」與下方文章列表的層級一眼可辨。
  * 分類標題維持原本的閱讀襯線大標與 --lumen-fg（#1b1b1b）深灰色，不另造新色。
  * 分類統計改為淡藍色膠囊（#e6f2fc 底、#355b76 字），以 inline-flex 依內容自然撐開，不整行鋪滿。
  * 分類描述維持既有正文字體、字級與 #4b4b4b 顏色，僅在面板內取消多餘下緣留白並加上長字詞換行保護。
  * 介紹面板與文章列表之間新增一條 1px 淺灰分隔線（#dde1e2），上下各留 24px；行動裝置縮為 20px／18px。
  * 上述樣式一律以 is_category() 產生的 .lumen-category-intro 作用域限定，屬分類頁專屬；
    標籤、日期、作者、分類法與文章類型彙整頁，以及首頁、搜尋、單篇文章均維持原樣。
  * 文章列表的日期膠囊（#f0f1f2／#52565c）與分類綠色膠囊（#e0f3e5／#176d39）完全未變。
  * 未新增任何 JavaScript，維持零 Theme JavaScript 設計。
* 1.1.5 (Stable release)
  * 全域搜尋框改為真正的純白、無邊框膠囊：背景改為 #ffffff，並移除 1px 灰色邊框。
    1.1.4 的底色為 --lumen-bg-soft（#f4f4f4）且帶 1px #e6e6e6 邊框，
    灰底與灰框疊加會產生「盒子感」，使膠囊看起來不夠圓潤。
  * 以極淡的兩層柔和陰影取代邊框，作為與背景的分離方式：
    0 1px 2px rgba(16, 24, 20, 0.04) 與 0 4px 14px rgba(16, 24, 20, 0.05)。
    陰影刻意維持極低透明度，避免變成浮起的卡片。
  * 圓角維持完整膠囊 999px，並確認三層（popover／form／input）皆為 999px。
    經逐點量測，左右兩端為完全對稱的半圓，無圓角截斷、無方角、
    無灰色矩形底層露出，亦無雙重圓角邊界。
  * 焦點呈現方式改為「膠囊內側的細緻綠色邊」：焦點存在時才出現，
    且為 inset（向內），因此不會像 1.1.4 那樣在白色膠囊外圍形成明顯的綠色外框。
    預設（未聚焦）狀態下，膠囊完全沒有綠色、沒有任何描邊。
    此內側邊緣與白色的對比約 6.4:1，高於 WCAG 1.4.11 對焦點指示的 3:1 要求；
    若僅以陰影表現焦點，實測僅約 1.05:1，不足以作為可辨識的焦點指示。
  * 背景霧化維持不變（Feature C 凍結）：rgba(248, 249, 248, 0.68) 搭配
    blur(6px) saturate(0.9)，未提高或降低模糊強度，未新增 Overlay 元素。
  * 高對比／forced-colors 模式改用系統 Highlight 色繪製焦點外框，
    且該規則使用輸入框自身的 :focus-visible，不依賴 :has() 支援。
  * 搜尋行為完全未變更：原生 popover="auto"、原生按鈕觸發、
    Esc 關閉、點擊外部關閉、再次點擊關閉、自動聚焦、
    WordPress 原生 GET 搜尋（method="get"、參數 s、type="search"）。
  * 仍然維持零 JavaScript：主題內沒有任何 .js 檔案。
  * 本次僅修改 lumen/assets/css/main.css 一個功能檔案，未更動任何 HTML 模板。

* 1.1.4 (Stable release)
  * 全域搜尋改為完整膠囊造型：彈出視窗與內部輸入框統一使用 border-radius: 999px，
    與首頁日期、分類膠囊及箭頭分頁的既有視覺語彙一致。
    （1.1.3 的輸入框因 border-radius: inherit 實際解析為 0px，外觀仍為小圓角矩形。）
  * 搜尋輸入框背景改為中性淺灰（--lumen-bg-soft），維持 1px 低對比淺色邊框與
    單一邊界，不再出現黑色粗框、陰影或第二層輸入框邊界。
  * 聚焦指示改為柔和的綠色（#176d39，與分類膠囊同一色系），並改為向外偏移 2px。
    1.1.3 的聚焦外框為 --lumen-accent（#1b1b1b，接近黑色）且向內偏移 -2px，
    因而在彈出瞬間被誤認為突兀的黑色邊框。
    綠色僅以元件層級 CSS 變數套用於全域搜尋，全站 --lumen-accent 與其他表單元件不受影響。
  * 背景遮罩改為柔和霧化：半透明淺色底（rgba(248, 249, 248, 0.68)）搭配
    blur(6px) 與 saturate(0.9)，使後方標題與正文明顯失焦，搜尋框成為唯一清晰焦點；
    整體仍保持輕量，不會變成深黑色模態遮罩。
    同時提供 -webkit-backdrop-filter 供 Safari 使用。
  * 不支援 backdrop-filter 的瀏覽器仍可透過半透明底色大幅降低背景可讀性
    （實測對比度下降約 68%，支援模糊時約 93%）。
  * 支援 forced-colors / 高對比模式：改以系統 Highlight 色繪製焦點外框，
    不因顏色覆寫而失去鍵盤焦點提示。
  * 搜尋行為完全未變更：仍為原生 popover="auto"、原生按鈕觸發、
    Esc 關閉、點擊外部關閉、再次點擊關閉、自動聚焦、
    WordPress 原生 GET 搜尋（method="get"、參數 s、type="search"）。
  * 仍然維持零 JavaScript：主題內沒有任何 .js 檔案，未新增外掛、框架、
    外部字體或外部圖示庫。
  * 本次僅修改 lumen/assets/css/main.css 一個功能檔案，未更動任何 HTML 模板。

* 1.1.3 (Stable release)
  * 桌面版頁首改為左右對齊：網站標題或 Custom Logo 貼齊容器左緣，搜尋圖示與主要導覽組成
    一個群組整組靠右，最後一個選單項目的右緣與頁尾 RSS 的右緣一致。取消先前用於強制置中
    導覽的三欄 Grid，並移除左右平衡用的空白 Spacer，改用單純的 flex 自動邊距；
    頁首字體、導覽 hover／active 顏色與字級皆未變更。
  * 行動版維持既有的兩列配置（M2）：第一列為品牌與右側搜尋圖示，第二列為可自由換行的導覽；
    320px 不產生橫向溢出，未複製第二套搜尋元件，Sticky Header 與 Admin Bar 行為不變。
  * 全站搜尋改為原生 HTML Popover：頁首只保留一個放大鏡按鈕，點擊後於瀏覽器可視區域
    「正中央」開啟單一搜尋輸入框，背景以 ::backdrop 輕微變暗（rgba(0,0,0,0.10)）。
  * Popover 使用原生 popover="auto" 與原生按鈕觸發（type="button"、
    popovertarget="lumen-site-search-popover"、popovertargetaction="toggle"）：
    再次點擊圖示、按 Esc、點擊浮層外部皆可關閉，關閉後焦點回到觸發按鈕，
    全部交由瀏覽器處理。
  * 彈出視窗內只有一個搜尋輸入框：無標題、無說明文字、無第二個放大鏡、無送出按鈕、
    無關閉按鈕、無底部說明、無搜尋歷史、無推薦關鍵字、無結果預覽。
    輸入框內僅提供 placeholder「Search articles…」，且不取代真正的可存取 Label。
  * 搜尋沿用 WordPress 原生 GET 機制（method="get"、action 為 home_url('/')、
    參數 s、type="search"），輸入關鍵字後按 Enter 前往搜尋結果頁；
    支援中文、英文、空白與特殊字元的正確 URL 編碼，既有搜尋關鍵字亦安全回顯。
  * 彈出視窗寬度：桌面約 420px、輸入區高度約 48px、1px 淺灰邊框、圓角 8px、
    無陰影、無動畫；行動版最大寬度為可視區域減去左右各 16px，不溢出、不產生橫向捲動。
  * 浮層由瀏覽器 Top Layer 呈現，不再依賴 Header 的 position: sticky 或 z-index，
    也不再以 right: 0 綁定頁首右緣；開啟時不改變頁首高度、不推動文章列表、
    捲動頁面後仍能正常置中彈出。
  * 移除舊版 details／summary 下拉式搜尋的專屬 CSS 與其浮層定位規則，
    不再保留互相衝突的過時樣式；未使用 Popover API 的瀏覽器仍可透過一般表單使用搜尋。
  * 仍然維持零 JavaScript：主題內沒有任何 .js 檔案，未新增外掛、第三方框架、
    外部字體或外部圖示庫，未使用 AJAX 搜尋、搜尋建議或自訂搜尋索引，
    亦未新增任何 WordPress 管理後台設定。
  * 既有功能全部保留：部落格首頁、歸檔與搜尋結果的日期與分類膠囊、
    首頁純箭頭分頁、單篇文章純箭頭導覽、頁首與頁尾字體、文章閱讀字體、
    程式碼字體與搜尋結果頁排版皆未變更。
  * 新增可翻譯字串並同步更新 languages/lumen.pot。
* 1.1.2 (Stable release)
  * 頁首搜尋版面調整：搜尋圖示改與主要導覽視為同一個視覺群組，桌面版將兩者一起置中，
    圖示緊接在第一個導覽連結之前（間距約 16px），不再被孤立推到頁首最右端；
    網站標題或 Custom Logo 維持靠左，超長標題與長導覽文字會自然降級換行，不互相重疊。
  * 行動版改為兩列配置（M2）：第一列為品牌與右側搜尋圖示，第二列為可自由換行的主要導覽；
    搜尋面板改為對齊整個頁首區域下方浮出，因此展開時不會遮蓋第二列導覽，也不會推動導覽位移。
  * 搜尋圖示外觀簡化：移除灰色矩形底色、明顯邊框與按鈕感，預設只保留簡潔線條放大鏡；
    桌面點擊區域 36px、行動版 44px，鍵盤 focus-visible 焦點樣式維持清楚可見。
  * 展開後的搜尋面板僅保留單一輸入框（約 250×40px、淺灰 1px 邊框、圓角 4px），
    不再輸出第二個送出按鈕或獨立送出圖示；按 Enter 即沿用 WordPress 原生 GET 搜尋送出。
     Header 高度不變、導覽不位移，面板以 CSS 定位浮出，全程仍為零 JavaScript。
  * 日期與分類改為膠囊標籤：部落格首頁、分類／標籤／作者／日期等歸檔頁，
    以及搜尋結果頁統一使用灰色日期膠囊（背景 `#F0F1F2`、文字 `#52565C`）與
    綠色分類膠囊（背景 `#E0F3E5`、文字 `#176D39`），字級 13px、圓角 999px、
    內距 `4px 10px`、間距 8px，無陰影、無漸層、無圖示；多個分類各自獨立成一個膠囊並可換行。
  * 移除上述三個列表情境中日期與分類之間的中點（`·`）分隔符，並同步清除殘留的
    `margin-left` 與間距，避免舊版面留下多餘空隙；**單篇文章頁 `.lumen-single-meta`
    既有的分隔樣式與外觀完全未變**。
  * 列表順序維持不變：部落格首頁與歸檔頁為「膠囊 → 標題 → 摘要」，
    搜尋結果頁維持「標題 → 膠囊 → 摘要」，未為了樣式一致而重排任何 DOM。
  * 部落格首頁分頁改為純箭頭膠囊：左側 `←` 對應 `previous_posts_link()`（較新的文章），
    右側 `→` 對應 `next_posts_link()`（較舊的文章），方向語意與 WordPress Core 原生邏輯一致；
    仍由 Core 產生連結與網址，未自行計算頁碼或修改 `WP_Query`。
  * 單篇文章上／下一篇導覽同樣改為純箭頭膠囊，仍使用 Core `the_post_navigation()`，
    未重寫文章查找邏輯、未變更排序或連結網址；箭頭方向依 Core 實際輸出的
    `nav-previous`／`nav-next` 對應，未憑主觀「新舊」理解顛倒。
  * 兩種箭頭膠囊共用同一套視覺規則（52×44px、背景 `#F0F1F2`、箭頭 `#52565C`、
    圓角 999px、Hover 背景略深、無陰影），並以 `.lumen-pager` 與 `.lumen-post-nav`
    限定作用範圍，不影響歸檔／搜尋的數字分頁、Gutenberg 按鈕、一般文章連結、
    頁尾 RSS 或留言送出按鈕。
  * 箭頭為連結自身的 CSS 裝飾（`aria-hidden` 性質），整個膠囊皆可點擊；
    螢幕閱讀器名稱由視覺隱藏文字提供（`Previous page`／`Next page`、
    `Previous post: <標題>`／`Next post: <標題>`），連結不會成為無名稱控制項。
    缺少上一頁／下一頁或相鄰文章時，該側整顆膠囊收合為 `display: none`，
    不會留下空膠囊、停用按鈕或孤立的偽元素箭頭。
  * 行動版單篇文章導覽維持左右分佈（`← … →`），不再強制改為縱向堆疊；
    頁面正文寬度、正文排版、留言區與其他 Single 模板結構均未變更。
  * 新增 5 個可翻譯字串並同步更新 `languages/lumen.pot`
    （`Previous page`、`Next page`、`Previous post`、`Next post`、`Site search`）。
  * 本版本未新增任何 Theme JavaScript、未新增外部字型或圖示庫、未新增外掛依賴，
    亦未變更 `theme.json`、`Requires at least`、`Requires PHP` 與 `Tested up to`。
* 1.1.1 (Stable release)
  * 新增頁首圖示式可展開搜尋：預設僅顯示放大鏡圖示，點擊（或以鍵盤 Enter／Space）後
    展開搜尋輸入框，再次啟用即收合。以原生 HTML `<details>`／`<summary>` 實作，
    **未新增任何 Theme JavaScript**，亦未自行維護 `aria-expanded`。
  * 搜尋沿用 WordPress 原生 GET 搜尋（`action` 為 `home_url( '/' )`、參數 `s`），
    未使用 Ajax、REST API 或任何外部搜尋服務；亦未新增外掛依賴。
  * 頁首搜尋表單使用獨立的 HTML `id`（`lumen-header-search-input`），
    與搜尋結果頁面原有的 `lumen-search` 並存時**不產生重複 id**；
    `lumen_search_form()` 無參數呼叫的既有行為完全不變。
  * Header／Footer 閱讀字體統一：網站標題、頁首導覽，以及頁尾導覽、版權宣告、
    RSS 連結皆改用既有變數 `--lumen-font-reading`，與正文形成一致的閱讀字型系統。
  * 網站標題字重自 700 調整為 400，避免明體類中文字型被瀏覽器套用合成的粗體
    （synthetic bold）而使筆畫模糊；字級與版面結構均未變更。
  * 未新增字型檔案或 CDN，維持本主題不捆綁字型的政策；正文、文章標題、
    摘要、留言區、Gutenberg 內容、搜尋頁與程式碼區塊的字體均未受影響。
  * 完善公開倉庫文件：README 補充 `main` 開發內容與最新正式 Release 的區別說明，
    並修正已過時的發布政策敘述。
  * 本版本未變更任何歸檔／搜尋的 PHP 查詢行為，亦未變更 `theme.json`。
* 1.1.0 (Stable release)
  * 版本識別自 1.1.0-beta.1 調整為正式穩定版 1.1.0（`style.css` 標頭、`LUMEN_VERSION` 常數、本文件一致）。
  * 保留既有功能：歸檔／分類／標籤／搜尋核心正確性、單篇文章與頁面的文字優先閱讀排版，
    以及零 Theme JavaScript 的極簡設計。
  * GPL 授權全文已隨佈景主題提供（`lumen/LICENSE`）。
  * 本版本未新增功能、未變更任何 PHP 行為、未變更 CSS 樣式規則與佈景主題資產。
* 1.1.0-beta.1 (Archive/Search Core correctness + consolidation)
  * 發布策略調整：Commit ≠ Release。`main` 上可有多個一般提交，不再逐次產生 tag／ZIP／Release。
    歷史 `v1.1.0-dev.1`…`dev.11` 的 tag／ZIP 保持不可變更。
    路線：1.1.0-dev.11 → 1.1.0-beta.1 →（如需）beta.2 → rc.1 → 1.1.0 → 1.1.1+ 修補版本。
  * 修正 Core 缺陷：歸檔 H1 標題改由 `get_queried_object()` 衍生（WP_Term→name、WP_User→display_name、
    WP_Post_Type→label、日期歸檔經 is_date() ＋ year/monthnum/day 查詢變數 ＋ wp_date()），
    取代預設 display=true 且會直接回顯的 `single_term_title()`（標題雙重顯示缺陷）。
  * 移除虛構的 WP API：`lumen_archive_term_description()` 改讀取
    `get_queried_object()->description`（標準 Core API），並經 `wp_kses_post()` 輸出；
    取代原本非 Core 的虛構 term API 呼叫。
  * 重寫歸檔上下文：`lumen_archive_context_label( $count )` → "Category · N posts" / "Tag · N posts"
    （單數經 `get_taxonomy()->labels->singular_name`）、"Author · N posts"、日期／文章類型歸檔為 "N posts"；
    即使 0 筆也顯示；經 `_n()` ＋ `number_format_i18n()` 本地化。
  * 重寫搜尋結果計數：`lumen_search_results_label( $count, $query )` → "N result(s) for 'query'"
    （本地化、查詢字串精確轉義一次），即使 0 筆命中仍顯示；取代原本以 >0 為條件、
    硬編碼複數 "results" 的作法，並加入 "for 'query'" 引用。
  * 重寫清單中繼資料：新增 `lumen_list_meta()`（日期 ＋ 分類，不含作者；CSS `::before` 的 "·" 分隔線
    僅在分類輸出時渲染），取代歸檔／搜尋清單項目中的 `lumen_post_meta()`（作者 ＋ 日期）；
    與凍結的首頁中繼資料樣式共用。
  * 清單順序：歸檔為 中繼資料→標題→摘要；搜尋為 標題→中繼資料→摘要
    （透過 `get_template_part()` 第三個 `$args` 陣列顯式傳遞上下文，以 `$args['context']` 讀取）。
  * 空狀態：歸檔顯示 "No posts found."；搜尋顯示 "No results for 'query'"。
  * CSS：歸檔 H1 reading/400/lh1.5/normal（clamp 1.75–2.5rem）、搜尋 H1 sans/400/lh1.4（1.75–2rem）；
    清單標題 reading/400/lh1.5（歸檔較大、搜尋較小 1.125–1.375rem）；
    中繼資料 reading 0.85rem 400 lh1.6 並帶 "·" 分隔；摘要 reading 1rem 400 lh1.75；
    清單節奏 1.75rem、細微分隔線，末項無分隔線。
  * i18n：重新產生 `languages/lumen.pot`；以 `msgfmt --check` 驗證通過（exit 0）。
  * 無新功能；零佈景主題 JS；首頁／單篇文章／頁面／留言／頁首／頁尾維持凍結未動。
* 1.1.0-dev.11 (Archive / category / tag / search — browsing + retrieval experience)
  * 歸檔與搜尋頁取得獨立、文字優先的瀏覽體驗：歸檔頁（分類、標籤、作者、年、月、日）
    經重寫的 `index.php` 渲染；搜尋則擁有專屬的 `search.php`。每頁顯示由 `lumen_archive_title()`
    產生的 H1（single_term_title ／ 作者 display_name ／ `wp_date()` 日期）、上下文標籤
    （例如 "Category · 14 posts"），以及選用的分類／作者描述（有守衛，僅非空時顯示）。
  * `template-parts/post-list-item.php` 由歸檔與搜尋共用；順序具上下文感知
    （歸檔：中繼資料 → 標題 → 摘要；搜尋：標題 → 中繼資料 → 摘要），不含縮圖，
    並共用摘要輔助函式 `lumen_list_excerpt($context)`
    （歸檔 CJK68／Latin22；搜尋 CJK92／Latin28；首頁凍結 CJK80／Latin24）。
  * `get_the_posts_pagination()` 現於 `<ul class="lumen-post-list">` 之外渲染，
    透過 `'class' => 'lumen-pagination'` 參數與 `lumen-pagination` 包裹層；空狀態顯示 "No posts found."。
  * `lumen_search_form()` 的 action 由 `/?s=` 改為 `home_url('/')`。
  * 新增 `lumen_archive_term_description()`（有守衛；僅分類／標籤，經 Core `get_queried_object()`）。
    日期歸檔以 `year`／`monthnum`／`day` 查詢變數的 `> 0` 測試偵測，而非 `is_*_archive()` 函式
    （非標準 WP 安裝缺少這些函式）。
  * i18n：新增字串（Category、Tag、Author、Year、Month、Day、posts、results、Search、No posts found）；
    重新產生 `languages/lumen.pot`（37 個 msgid），並以 `msgfmt --check` 驗證。
  * CSS：移除失效的 `.lumen-post-thumb` 規則；新增 `.lumen-archive-context`（無襯線、弱化色）、
    `.lumen-archive-description`（仿宋、fg-soft）、`.lumen-search-page`、
    `.lumen-post-excerpt`（仿宋、fg-soft）。
  * 零佈景主題 JS；文字優先，無卡片／陰影／英雄區；行動優先；720px 內容欄。
  * QA：15 個執行階段頁面（歸檔 分類／標籤／作者／年／月／日／空、搜尋／搜尋空、首頁、單篇）
    在 1440／768／390／320 通過 —— 無溢出、0 主控台錯誤、0 失敗網路請求；
    已保存 14 張截圖 ＋ computed JSON。管理列 QA（以臨時管理員登入）：5 個頁面
    （1440 下的 home、category、search；390／320 下的 category）通過 —— 管理列可見、無溢出、0 主控台錯誤。
  * 凍結／未改動：home.php、home-post-item.php、single.php、page.php、comments.php、header.php、footer.php；
    穩定版 v1.0.0（`b36d4dce`）與 dev.10／標籤 `v1.1.0-dev.10` 未動。
* 1.1.0-dev.10 (Page reading typography unification)
  * 單篇文章的長文閱讀系統（H2–H6 字級階梯、段落／清單／引文間距、行內連結／粗體／斜體／程式碼、
    pre/code 內部捲動、緊湊表格、圖片與圖說、分隔線、Gutenberg 區塊）現同時套用於一般頁面
    （`.lumen-page-body`），採分組選擇器 `.lumen-post-body, .lumen-page-body`；
    `.lumen-page-title` 與單篇文章標題字級一致。單篇文章輸出在桌面／平板／行動裝置維持逐位元組相同。
  * 頁面結構維持比文章單純：不輸出日期／分類／作者／精選圖片／上下一篇／留言。
    介面元素（按鈕、`.wp-block-button__link`、表單控制項）維持無襯線；任何視窗尺寸皆無水平溢出。
  * i18n：重新產生 languages/lumen.pot（修正過時的 "No comments yet." 字串）；以 msgfmt 驗證。
* 1.1.0-dev.9 (Comments — reading + interaction refinement)
  * 留言區現包裹於語意化的 `<section id="comments" class="lumen-comments">`（單一地標）。
    頂層留言包裹於 `<ol class="lumen-comment-list">`，使文件結構有效，
    而巢狀的 `<ul class="children">` 仍為有效的 Core 子清單。
  * 修正 Core 參數：`wp_list_comments()` 現僅傳遞有效參數（avatar_size）；
    原有的 `'class'`／`'time_on'` 參數為無作用的 no-op，已移除。
    `comment_form()` 維持未動（未新增 class／form 參數）。
  * CSS 現針對真實的 Core DOM（xhtml 格式）：留言正文 —— 唯一的閱讀內容 —— 使用仿宋閱讀字體；
    作者名稱、日期、回覆連結、計數標題與表單使用無襯線介面層。
    無卡片、無陰影 —— 以單一頂部邊框與寬裕間距，將該區與上／下一篇導覽區隔。
  * 巢狀回覆以左側引導線（1px 邊框）搭配每層適度縮排呈現，
    使 3–4 層深的回覆仍可閱讀，而不會無限縮排。
  * 以 URL 為基礎的討論串（`#respond`、`?replytocom=ID`）無需 JavaScript 即可運作；
    分頁、無障礙、翻譯、審核提示與編輯連結均精確保留。
  * 首頁、歸檔、搜尋、頁面、頁首、頁尾、Gutenberg 與穩定版 v1.0.0 的版面配置皆未變更。
* 1.1.0-dev.8 (Single post content typography, phase 2)
  * 單篇文章正文內容（`.lumen-post-body`）精進長文排版：H2–H6 閱讀襯線字級階梯、清單間距、
    極簡左側引導線引文、細緻且持續的連結下底線、真正不換行的程式碼區塊
    （水平捲動僅限於該區塊內）、緊湊表格、安靜的圖說，以及寬裕的分隔線。
    全域排版與 720px 內容欄維持不變。
  * 零 JS：未新增指令碼；程式碼區塊捲動僅以 CSS overflow 實現。
  * 首頁、歸檔、搜尋、頁面、頁首、頁尾、留言，以及 dev.7 的單篇頁首／上下一篇導覽皆未變更；
    穩定版 v1.0.0 未動。
* 1.1.0-dev.7 (Single post reading layout)
  * 單篇文章標題現位於精選圖片上方，並依閱讀比例調整（clamp 1.75–2.5rem、仿宋、行高 1.5）；
    預設單篇中繼資料僅顯示「日期 · 分類」（不顯示作者），採仿宋閱讀字體、
    居中點分隔線與 tabular-nums 日期。
  * 上／下一篇導覽重構為兩層式連結（小號無襯線「← Previous」／「Next →」標籤 ＋ 仿宋標題），
    具頂部邊框、寬裕間距，行動裝置採全寬堆疊版面。
  * 首頁、歸檔、搜尋、頁面、頁首、頁尾、留言結構與 Gutenberg 的版面配置皆無變更；
    穩定版 v1.0.0 未動。
* 1.1.0-dev.6 (Header/footer interactions + homepage metadata typography)
  * 首頁日期／分類中繼資料排版改用仿宋閱讀字體（font-family: --lumen-font-reading，字重 400）；
    尺寸、柔和色調、行高、tabular-nums 日期與懸停對比度維持不變。
  * 頁首導覽連結取得柔和懸停背景（--lumen-bg-soft）＋ 常駐的目前頁面／分類作用中狀態
    （current-menu-item／-parent／-ancestor）；網站標題加入細緻的懸停色彩變化。
  * 頁尾 RSS feed 與頁尾選單連結取得柔和懸停背景；版權列維持靜態。
  * 互動效果僅重用既有變數；保留 :focus-visible 與無底線政策；
    並於儲存庫根目錄新增雙語 README.md。
* 1.1.0-dev.5 (Typography — FangSong reading font)
  * 以仿宋風格的中文襯線字體堆疊（變數 --lumen-font-reading）統一閱讀排版。
  * 首頁文章標題與摘要現使用仿宋閱讀字體堆疊（字重 500；摘要行高 1.85）。
  * 單篇文章標題與文章內容使用相同閱讀字體（正文行高 1.9）。
  * 頁面標題與頁面內容使用相同閱讀字體。
  * 導覽、中繼資料、分頁與頁尾維持無襯線；歸檔卡片標題不變。
  * code / pre / kbd / samp 維持等寬字體（不受仿宋影響）。
  * 保留所有 dev.4 的 UX 修正（懸停、focus-visible、黏性頁首、上／下一篇分頁）。
* 1.1.0-dev.4 (UX & bug-fix revision)
  * 修正已登入狀態下行動裝置黏性頁首與管理列的間隙：三段式中斷點頁首位移
    （46px 管理列 → 平板 top:46px、行動裝置 top:0；32px 管理列 → 桌面 top:32px），
    確保頁首永不重疊管理列或留下間隙。
  * 平衡首頁文章分隔線的垂直節奏：線條上下留白相等
    （桌面約 32px／32px，行動裝置 28px／28px）。
  * 首頁分頁更名為「Previous」／「Next」（上一頁在左、下一頁在右；
    第 1 頁僅顯示 Next，最後一頁僅顯示 Previous）；箭頭在 CSS 中維持裝飾性。
  * 移除 Lumen 前端全站的連結懸停底線（僅變色；保留 :focus-visible 外框；
    WP 管理列核心 CSS 未動）。
  * 強化分類懸停對比度（柔和色 → 文字色，約 160ms 轉場；無底線／膠囊／粗體）。
  * 將頁首導覽懸停改為色彩轉場（無底線、無字重變化、無背景膠囊）。
* 1.1.0-dev.3 (Development preview — version alignment)
  * 佈景主題開發版本現與預發布建置一致。
  * WordPress 管理介面顯示 1.1.0-dev.3；資源快取版本跟隨 LUMEN_VERSION。
  * 包含 1.1.0-dev.2 的首頁閱讀改善。
* 1.0.0 (Initial stable release)
  * 發布凍結：所有 Phase 1.2／1.3 瀏覽器驗證通過；無新功能、無重新設計。
* 0.2.0 (Phase 2 — visual polish; release candidate)
  * 將首頁／歸檔內容欄限制於約 68ch 並置中（扁平編輯式文章清單；非全寬）。
  * 修正文章卡片標題為 1.5rem（原為 48px，與單篇文章標題同尺寸）。
  * 降低歸檔標題以符合標題層級（原為 52px，大於單篇標題）。
  * 移除黏性頁首的玻璃擬態效果（實色背景、無模糊）。
  * 將引文邊框（基礎 ＋ 區塊編輯器）對齊為一致的柔和色調。
  * 將 404 的「返回首頁」連結樣式化為安靜的外框按鈕。
  * 增加首頁留白，使節奏更沉穩。
  * 修正 theme.json 的「Muted」調色盤值，使其與 --lumen-muted（#6e6e6e）一致。
  * 由真實的 1200x900 首頁渲染重新產生 screenshot.png。
  * 無新增 JavaScript、無新增字型、無樣板重構。
* 0.1.0 (Phase 1 — development)
  * 初始極簡佈景主題骨架（無 JS 且永遠可用的導覽、跳轉連結、語意化 HTML、theme.json）。
  * 從佈景主題移除 schema.org 微資料（交由 SEO 外掛處理）。
  * 移除 JS 覆蓋式導覽、閱讀時間預估、未使用的側邊欄，以及區塊支援輔助程式（YAGNI）。
  * 配套外掛縮減為薄殼啟動（移除 REST 端點、contract 類別與未使用的函式）。

== Support & Contributing ==
* 請回報 Lumen 專案的相關問題。
* 遵循 WordPress Coding Standards 與 WP 佈景主題標準。
* 維持佈景主題／外掛分離：佈景主題 ＝ 呈現；外掛 ＝ 商業邏輯。
* 不要「為了日後」而預先加入程式碼；僅在具體功能有需求時才加入。

== License ==
GPL v2 或更新版本。

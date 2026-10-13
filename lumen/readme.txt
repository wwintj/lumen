=== Lumen ===
Contributor Name: Lumen Team
Contributor URI: https://github.com/wwintj
Author: Lumen Team
Author URI: https://github.com/wwintj
Homepage URL: https://github.com/wwintj/lumen
Version: 1.1.0
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 8.2
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: lumen
Domain Path: /
Tags: blog, content, minimalist, responsive-layout, custom-menu, translation-ready, rss-icons

極簡、對 SEO 友善的內容部落格佈景主題，專為中英雙語網站設計。1.1.0 為 Lumen 的正式穩定版本，提供歸檔與搜尋核心正確性、文字優先的閱讀排版，以及零 Theme JavaScript 的設計。

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

# Lumen 專案授權聲明（NOTICE）

本文件說明 Lumen 專案的授權範圍。**本文件為專案聲明，並非法律意見。**

---

## 1. 專案授權

Lumen 專案中由權利人持有、並依專案授權宣告提供之原創程式碼與文件，採用：

**GPL-2.0-or-later**（GNU General Public License 第 2 版，或任何後續版本）

既有授權宣告維持不變：

- **Lumen Theme**：GPL v2 or later（見 `lumen/readme.txt` 的 `License` 與 `License URI` 欄位）
- **Lumen Blog 配套外掛**：GPL v2 or later（見 `lumen-blog/lumen-blog.php` 與 `lumen-blog/readme.txt`）

完整授權條款全文見本專案根目錄的 `LICENSE`（標準 GNU GPL v2 正式文本）。

> 本聲明不主張任何**未知來源**的第三方內容均已取得重新授權之權利。
> 亦未虛構任何其他著作權人已提供之授權。

---

## 2. 原創圖片授權

以下三張圖片由專案權利人聲明為自行製作，並同意以 **GPL-2.0-or-later** 授權公開使用、修改與再散布：

| 圖片路徑 | 說明 |
|---|---|
| `lumen/screenshot.png` | Lumen Theme 佈景主題截圖（1200x900） |
| `.lumen-qa/assets/logo.png` | QA 測試用標誌素材（128x32） |
| `.lumen-qa/fixtures/img.png` | QA 測試用圖片 Fixture（900x540） |

權利人聲明內容：

1. 三張圖片均由權利人自行製作。
2. 未包含未經授權的第三方素材。
3. 同意以 GPL v2 or later 授權公開、修改與再散布。

**請注意區分：**

- **權利人聲明**：由專案權利人於 2026-10-14 提出，本文件如實記錄。
- **第三方獨立權利驗證**：**未執行**（`INDEPENDENT_RIGHTS_VERIFICATION: NOT PERFORMED`）。

本文件僅記錄權利人聲明，**不構成**第三方鑑定、權利調查報告或法律文件。

---

## 3. 第三方依賴

- 第三方程式庫與資源，**維持其各自原有授權**。
- 本專案**不擅自重新授權**任何第三方作品。
- **Playwright** 為 QA 測試用的**開發依賴**（Apache-2.0 授權），僅見於 `.lumen-qa/package.json`。
- Playwright **不包含**於 Lumen Theme 散布 ZIP 之中，亦未隨本專案一併散布。
- Playwright 的 Apache-2.0 授權**不因**本 NOTICE 而改變。

> 本聲明不宣稱所有**未來**新增的依賴皆已完成授權審核。
> 新增依賴時，應另行確認其授權條款。

---

## 4. 授權文件位置

| 文件 | 適用散布情境 |
|---|---|
| `LICENSE` | 整個 Repository（原始碼、文件與專案層級散布） |
| `lumen/LICENSE` | Lumen Theme 單獨散布時（例如僅下載 Theme ZIP 的使用者） |
| `lumen-blog/LICENSE` | Lumen Blog 外掛單獨散布時 |

三份 `LICENSE` 內容**完全相同**，皆為標準 GNU GPL v2 正式全文。

將 `lumen/LICENSE` 納入 Theme 套件，是為了確保**單獨下載 Theme ZIP 的使用者**也能在套件內取得完整授權條款。

---

## 5. 發布說明

- **Git Commit 不等於 GitHub Release。** 原始碼提交至 `main` 分支，不代表已正式發布。
- 正式發布的版本、版本說明與下載檔案，一律以 **GitHub Releases** 頁面為準：
  <https://github.com/wwintj/lumen/releases>
- **Lumen Theme 1.1.0-beta.1 為預發布（pre-release）版本**，不建議用於正式營運環境。

---

## 6. 免責

GPL 係授權條款，**不保證**程式碼之安全性、正確性或特定功能之適用性。相關保證與責任限制，悉依 GPL v2 條款（特別是第 11、12 條）之規定。

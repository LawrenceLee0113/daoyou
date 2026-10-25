# Figma 設計稿版本紀錄

設計師會把定稿複製成新檔案，所以每一版的連結都不一樣。流程見 `/figma-page` skill。

- `snapshots/`：每個 frame 一份最新快照（`node figma/snapshot.mjs <channel ID>` 產生），舊版本在 git 歷史裡。
- 每個 frame 有 `<名稱>.json`（結構）跟 `<名稱>.png`（截圖）。
- 比對：`node figma/snapshot.mjs --report` 跟上一次 commit 比，分成視覺變更／非視覺變更／新增／刪除。

## Frame → 頁面對照

| Frame 名稱 | 頁面檔案 | 備註 |
|---|---|---|
| 封面 | `src/pages/index.astro` | 5 張活動照片匯不出來，先放空白框 |
| 登入 | `src/pages/login.astro` | 第三方登入、註冊沒有功能 |
| 特色郵筒 | `src/pages/map/index.astro` | 含併入的「島郵探索面板」；地圖改用開放資料 SVG（`src/components/TaiwanMap.astro`） |
| 台北、台北 #2 | `src/pages/map/[county]/index.astro` | 「台北 #2」是點進縣市時、卡片出現前的過場狀態（做成淡出＋卡片滑入動畫） |
| 新北…臺東（16 個縣市） | `src/pages/map/[county]/index.astro` | 沒有郵筒資料，顯示「即將開放」 |
| 台北-歪腰郵筒、台北-歪腰郵筒（已上傳） | `src/pages/map/[county]/[mailbox].astro` | 同一頁的「上傳前／上傳後」狀態 |
| 歪腰郵筒-預覽 | `src/pages/map/[county]/[mailbox].astro` | 郵筒頁裡的全螢幕 `<dialog>` |
| 歪腰郵筒-相機 | （不做） | 改叫出手機內建相機 |
| 個人檔案-相簿 | `src/pages/profile/index.astro` | |
| 目錄封面 | `src/components/SiteHeader.astro` | 三槓打開的選單（popover） |
| 跑嗎燈燈 | `src/components/SiteHeader.astro` | 跑馬燈，10 句每 5 秒輪播 |

## 版本紀錄（新的寫在最上面）

### v3（同一份）— 2026-10-25 第一批頁面
- 連結：未提供。重新擷取快照，跟 v3 基準比對沒有任何變更
- 實作主線流程：封面、登入、特色郵筒、台北（含其他縣市的「即將開放」版型）、台北-歪腰郵筒（上傳前／後）、預覽、個人檔案-相簿、選單、跑馬燈

### v3 — 2026-10-25（流程測試：第二份，討論後的新版）
- 連結：未提供
- 共 39 個 frame（另有 22 個散落素材）
- 視覺變更：
  - 特色郵筒：原本獨立的「島郵探索面板」併入畫面底部；移除約 200 個小方塊拼成的「縣市點擊區」熱區
  - 台北-歪腰郵筒（已上傳）：照片改成「剛拍的照片」＋原照片的組合，移除照片出處文字
  - 個人檔案-相簿、歪腰郵筒-相機、歪腰郵筒-預覽：換了照片
- 非視覺變更：9 個 frame 的「跑嗎燈燈」選單原型互動（轉場、overlay 位置）調整
- 新增：台北 #2（只有地圖、沒有郵筒卡片的台北，推測是點選郵筒前的狀態）
- 刪除：島郵探索面板（已併入特色郵筒）、我的郵票冊
  - 註：這兩筆刪除因操作失誤提前在 commit 9803ad9 進了基準，所以 `--report` 沒列出

### v2 — 2026-10-25（流程測試：第一份）
- 連結：未提供
- 狀態：第一次擷取快照，作為比對基準。page「Page 1」共 40 個 frame（另有 21 個散落素材不拍快照）

### v1 — 2026-10-25
- 連結：https://www.figma.com/design/25olxEkC2qMiP1xUuxeAH7/Untitled--claude%E7%94%A8-
- 狀態：初始連結，設計還在進行中，尚未擷取快照

# daoyou

依照 Figma 設計稿製作的靜態網站，部署在 GitHub Pages。

@AGENTS.md

## 溝通

- 一律使用繁體中文回覆；程式碼識別字、技術名詞保持原文。

## 技術棧

- Astro 7（純靜態輸出）+ Tailwind CSS 4（`@tailwindcss/vite`）
- Node 24（見 `.nvmrc`；Astro 需要 >= 22.23.4，執行前先 `nvm use`）
- 部署：push 到 `main` → `.github/workflows/deploy.yml` → https://lawrencelee0113.github.io/daoyou/

## 指令

- `npm run dev` / `astro dev --background`：開發伺服器
- `npm run build`：建置到 `dist/`。宣稱完成前一定要跑過且通過
- `npm run preview`：預覽建置結果

## GitHub Pages 注意事項

- 網站掛在子路徑 `/daoyou`。站內連結與 `public/` 的資源**不可寫死 `/` 開頭**，要接上 base：
  `const base = import.meta.env.BASE_URL.replace(/\/$/, '');` → `href={`${base}/about/`}`
- `src/` 裡用 `import` 引入的圖片、CSS 會自動處理 base，不需要手動加。
- 只能輸出靜態檔：不要用 SSR、API routes、server actions。

## 專案結構

- `src/pages/`：一個檔案一個頁面（檔名即路由）
- `src/layouts/Layout.astro`：共用 `<head>`、載入 `global.css`
- `src/components/`：可重用元件，對應 Figma 的 component
- `src/styles/global.css`：Figma design tokens 統一寫在 `@theme`
- `src/assets/`：從 Figma 匯出、需要最佳化的圖片；`public/`：原樣輸出的檔案（favicon 等）

## Figma 設計稿

- 設計師每一版都會複製成新檔案，**連結會一直換**。所有連結、每一版的變更、frame 對應的頁面都記在 `figma/versions.md`。
- 使用者給新連結或說設計更新了 → 一律照 `/figma-page` skill：記錄連結 → 擷取快照 → 比對出變更 → 確認後只更新有變的頁面。
- 透過 **Talk to Figma MCP**（`mcp__talk-to-figma__*`）讀取。
- **設計稿是唯讀的**：這是設計師的工作檔案，所有會修改 Figma 的工具都已在 `.claude/settings.json` 禁用，不要試圖繞過。
- Figma 畫的是**手機版**。

### 切版規則

- 顏色、字體、字級、圓角、陰影先寫成 `@theme` token，再用 Tailwind class 引用；不要在 class 裡寫 `bg-[#xxxxxx]` 這類一次性的值。設計稿裡出現新的值時，先問是不是漏了 token。
- Figma 的 Auto Layout 對應 flex/grid：`layoutMode` → `flex-row`/`flex-col`、`itemSpacing` → `gap-*`、`padding*` → `p-*`。
- 同一個 Figma component 只做成一個 Astro 元件，用 props 處理變體。
- 文字內容以 `scan_text_nodes` 取得的原文為準，不要自己改寫文案。
- 圖示、插圖用 `export_node_as_image` 匯出到 `src/assets/`；能用 SVG 的就用 SVG。
- **手機優先**：照設計稿寬度（393px）做，Tailwind 不加前綴的 class 就是手機版。
- **RWD**：手機寬度不同時，比不上設計稿的地方自己判斷，原則是內容置中（例如照設計稿座標排的地圖整塊置中、窄螢幕等比縮小）。
- **電腦版每頁都要做**（使用者 2026-11-02 要求，依專業判斷即可）：正常寬螢幕要好用。內容最寬 `max-w-6xl` 置中；頁首在 `lg:` 攤開選單；能並排的用雙欄（封面：主視覺＋最新消息；郵筒頁：照片＋介紹）；照片輪播在平板以上改成格狀。用 `md:`（≥768）／`lg:`（≥1024）調整，不要動到手機版。
- **互動要照 Figma 原型**：不只做畫面。用 `node figma/export.mjs <channel> --reactions <frame id>` 看點擊目標、轉場（例如 DISSOLVE 0.25s）、可捲動區域，網頁要做出一樣的行為。
- 基本 a11y：圖片要有 `alt`、語意化標籤（`header`/`nav`/`main`/`footer`）、可點擊的元素用 `a` 或 `button`。

## 純前端資料規則

Figma 裡的登入、上傳照片等流程**只做前端**，不串接任何後端或第三方 API。所有狀態存在使用者這支手機的瀏覽器裡，換手機、換瀏覽器、清除網站資料後就從頭開始，這是預期中的行為。

- 所有讀寫都集中在 `src/lib/store.ts`，頁面和元件不要直接碰 `localStorage` 或 IndexedDB。之後要接真的後端時只需要改這個檔案。
- 登入：只有一組預設帳號，寫成 `store.ts` 裡的常數（帳號 `repost116.grad@gmail.com`、密碼 `re123456`，使用者已確認可以公開）。登入狀態存在 `localStorage`。需要登入的頁面用前端 JS 檢查，沒登入就導回登入頁。這不是安全機制，不要存任何真實的密碼或個資。
- 照片：**每個郵筒最多 3 張**（郵筒數量不限）。用 `<input type="file" accept="image/*" capture="environment">` 叫出手機內建相機（也可從相簿選），不在網頁裡做即時取景。存在 IndexedDB（以 Blob 形式），**不能用 localStorage**（上限只有約 5MB）。存之前先用 canvas 把最長邊縮到 1600px、轉成 JPEG（品質 0.8）。
- 命名：`localStorage` 的 key 和 IndexedDB 的資料庫名稱都要加上 `daoyou` 前綴，因為 `lawrencelee0113.github.io` 底下的其他專案共用同一塊儲存空間。
- 首次寫入時呼叫 `navigator.storage.persist()`，降低 iOS Safari 清除資料的機率。不做 PWA／加入主畫面：使用者已接受 iOS Safari 在 7 天沒使用後可能清掉資料。
- 所有讀取都要能處理「資料不存在」（無痕模式、被清除）的情況，畫面退回初始狀態，不可以壞掉。

## 遊戲規則

所有數字集中寫在 `src/lib/rules.ts`，頁面不要寫死。

- 上傳照片：某個郵筒**第一次**上傳 → 得到該郵筒的郵票（收進郵票冊）＋ 10 幣；同一郵筒第 2、3 張各 + 5 幣。
- 寄明信片：每張 + 10 幣，不限次數。純前端不會真的寄出，只記在「我的信件」、狀態一直是「寄送中」。
- 郵票冊以縣市為單位：該縣市任一郵筒打卡過就點亮。
- 等級依郵票數：Lv.1 見習郵差（0）→ Lv.2 正式郵差（3）→ Lv.3 資深郵差（8）→ Lv.4 郵務達人（15）→ Lv.5 島郵大使（22）。只有 Lv.1 名稱來自設計稿，其他是暫定。
- 幣的用途：「島郵周邊」商品折抵，1 幣 = NT$1，最多折售價 20%（暫定）。純前端不能真的結帳，只顯示折抵後價格、扣幣。

## 內容與素材

- 字型：中文內文用系統字型（`-apple-system, "PingFang TC", "Noto Sans TC", sans-serif`），跟設計師在 Mac 上看到的一致，不下載中文字型。Chiron GoRound TC、Chiron Hei HK、Chiron Sung HK 用 Google Fonts。設計稿標 Inter／Jura／Noto Sans 的中文其實都是系統字型在顯示。大標題、logo、「NEWS最新消息」（AsobiMemogaki）從 Figma 匯出成圖片。
- 照片：不用 Wikimedia 等第三方照片，一律用使用者自己拍的；還沒提供前用設計稿匯出的圖暫代，並在回報中列出缺哪些照片。
- 台灣地圖：用政府開放資料的縣市界線做成 SVG，每個縣市可點擊，樣式（綠框、點點底紋）照設計稿；在程式碼註明資料來源與授權。
- 郵筒資料集中在 `src/data/mailboxes.ts`。目前只有台北（歪腰郵筒），其他縣市頁做好版型、顯示「即將開放」，有資料時填進去就會出現。

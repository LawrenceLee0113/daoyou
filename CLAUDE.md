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
- **手機優先**：照設計稿寬度做，Tailwind 不加前綴的 class 就是手機版。電腦版只做簡單 RWD：內容置中、限制最大寬度（例如 `max-w-md mx-auto`），版面能自然變寬的地方才用 `md:` 調整。不要另外發明桌機版設計。
- 基本 a11y：圖片要有 `alt`、語意化標籤（`header`/`nav`/`main`/`footer`）、可點擊的元素用 `a` 或 `button`。

## 純前端資料規則

Figma 裡的登入、上傳照片等流程**只做前端**，不串接任何後端或第三方 API。所有狀態存在使用者這支手機的瀏覽器裡，換手機、換瀏覽器、清除網站資料後就從頭開始，這是預期中的行為。

- 所有讀寫都集中在 `src/lib/store.ts`，頁面和元件不要直接碰 `localStorage` 或 IndexedDB。之後要接真的後端時只需要改這個檔案。
- 登入：只有一組預設帳號，寫成 `store.ts` 裡的常數（帳密使用者已提供，存在 Claude 記憶 `demo-account`；repo 和網站都是公開的，寫進程式前要先跟使用者確認可以公開）。登入狀態存在 `localStorage`。需要登入的頁面用前端 JS 檢查，沒登入就導回登入頁。這不是安全機制，不要存任何真實的密碼或個資。
- 照片：每位使用者**最多 3 張**。存在 IndexedDB（以 Blob 形式），**不能用 localStorage**（上限只有約 5MB）。存之前先用 canvas 把最長邊縮到 1600px、轉成 JPEG（品質 0.8）。
- 命名：`localStorage` 的 key 和 IndexedDB 的資料庫名稱都要加上 `daoyou` 前綴，因為 `lawrencelee0113.github.io` 底下的其他專案共用同一塊儲存空間。
- 首次寫入時呼叫 `navigator.storage.persist()`，降低 iOS Safari 清除資料的機率。不做 PWA／加入主畫面：使用者已接受 iOS Safari 在 7 天沒使用後可能清掉資料。
- 所有讀取都要能處理「資料不存在」（無痕模式、被清除）的情況，畫面退回初始狀態，不可以壞掉。

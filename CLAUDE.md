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

- 檔案：https://www.figma.com/design/25olxEkC2qMiP1xUuxeAH7/Untitled--claude%E7%94%A8-
- 透過 **Talk to Figma MCP**（`mcp__talk-to-figma__*`）讀取。實作頁面時照 `/figma-page` skill 的流程走。
- **設計稿是唯讀的**：這是設計師的工作檔案，所有會修改 Figma 的工具都已在 `.claude/settings.json` 禁用，不要試圖繞過。

### 切版規則

- 顏色、字體、字級、圓角、陰影先寫成 `@theme` token，再用 Tailwind class 引用；不要在 class 裡寫 `bg-[#xxxxxx]` 這類一次性的值。設計稿裡出現新的值時，先問是不是漏了 token。
- Figma 的 Auto Layout 對應 flex/grid：`layoutMode` → `flex-row`/`flex-col`、`itemSpacing` → `gap-*`、`padding*` → `p-*`。
- 同一個 Figma component 只做成一個 Astro 元件，用 props 處理變體。
- 文字內容以 `scan_text_nodes` 取得的原文為準，不要自己改寫文案。
- 圖示、插圖用 `export_node_as_image` 匯出到 `src/assets/`；能用 SVG 的就用 SVG。
- 預設做 RWD：設計稿只有桌機版時，手機版自行合理推斷，並在回報中註明是推斷的。
- 基本 a11y：圖片要有 `alt`、語意化標籤（`header`/`nav`/`main`/`footer`）、可點擊的元素用 `a` 或 `button`。

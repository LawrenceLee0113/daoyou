---
name: figma-page
description: 用 Talk to Figma MCP 讀取 Figma 設計稿的頁面（frame），並在本專案做成 Astro 頁面。使用者說「做這一頁」「照 Figma 切版」「實作某個 frame」或輸入 /figma-page 時使用。
argument-hint: "[frame 名稱或 node id，留空則使用 Figma 當前選取]"
---

# Figma 頁面 → Astro 頁面

目標：$ARGUMENTS（留空就用設計師在 Figma 目前選取的 frame）

## 1. 連線

1. 確認 WebSocket relay 正在跑：`lsof -iTCP:3055 -sTCP:LISTEN`。沒有的話，請使用者在另一個終端機執行
   `cd ~/workspace/talk-to-figma-mcp && bun socket`（這是長時間執行的程序，不要自己在前景跑）。
2. 請使用者在 Figma 桌面版打開設計稿，執行 **Cursor Talk to Figma MCP Plugin**，把外掛顯示的 channel ID 給你。
3. `join_channel` 加入該 channel，再用 `get_document_info` 確認連到的是正確的檔案。

## 2. 讀取設計

- 找目標 frame：用 `get_document_info` 或 `get_selection` 取得 node id。
- `get_node_info`：結構、Auto Layout、尺寸、顏色；巢狀太深時改用 `get_nodes_info` 分批讀。
- `get_styles`：顏色／文字樣式，對照 `src/styles/global.css` 的 `@theme`，缺的 token 先補上。
- `get_local_components`：找出可重用元件，對照 `src/components/` 有沒有已經做過的。
- `scan_text_nodes`：取得所有文案原文。
- `get_annotations`：設計師的標註（互動、狀態、備註），一定要看。
- `export_node_as_image`：匯出整個 frame 的截圖當作比對基準；圖示／插圖匯出到 `src/assets/`。

## 3. 實作

依照 `CLAUDE.md` 的「切版規則」：先 token → 再元件 → 最後組成 `src/pages/<路由>.astro`。

## 4. 驗證

1. `npm run build` 必須通過。
2. 起 dev server，用瀏覽器截圖跟第 2 步匯出的 frame 截圖並排比對：間距、字級、顏色、對齊。
   至少檢查桌機（設計稿寬度）跟手機（375px）兩種寬度。
3. 回報時列出：做了哪些檔案、新增了哪些 token、哪些地方跟設計稿不一致或是自行推斷的。

---
name: figma-page
description: 用 Talk to Figma MCP 讀取 Figma 設計稿，偵測與上一版的差異，並在本專案建立或更新對應的 Astro 頁面。使用者給新的 Figma 連結、說「設計稿更新了」「做這一頁」「照 Figma 切版」或輸入 /figma-page 時使用。
argument-hint: "[Figma 連結，或 frame 名稱]"
---

# Figma 設計稿 → Astro 頁面

輸入：$ARGUMENTS

## 1. 連線

1. 確認 WebSocket relay 正在跑：`lsof -iTCP:3055 -sTCP:LISTEN`。沒有的話，請使用者在另一個終端機執行
   `cd ~/workspace/talk-to-figma-mcp && bun socket`（這是長時間執行的程序，不要自己在前景跑）。
2. Talk to Figma **不會用連結讀檔案**，只會讀 Figma 桌面版目前打開的檔案。請使用者在 Figma 打開**這次給的連結**，執行 **Cursor Talk to Figma MCP Plugin**，再把 channel ID 給你。
3. `join_channel` 加入後，用 `get_document_info` 確認頁面跟 frame 名稱看起來是對的檔案（外掛只讀得到**目前所在的 page**，有多個 page 時要請使用者切換）。

## 2. 記錄版本（給了新連結時）

在 `figma/versions.md` 的「版本紀錄」最上面新增一版：版本號、日期、連結。比對結果在第 3 步之後補上。

## 3. 擷取快照、找出變更

1. `get_document_info` 取得所有頂層 frame。同一個 page 有重複的 frame 名稱時，先請使用者確認，因為快照是用名稱對應的。
2. 對每個 frame 呼叫 `get_node_info`，把回傳的 JSON 原樣寫到 scratchpad，再執行
   `node figma/snapshot.mjs <檔案>...`，覆寫 `figma/snapshots/`。
3. `git status --porcelain figma/snapshots/`：
   - `M` 修改 → 用 `git diff figma/snapshots/<檔案>` 看改了什麼
   - `??` 新增 → 新頁面，或是被改名的 frame
   - `D` 刪除 → 頁面被移除，或是被改名的 frame
   - 同一次同時有新增跟刪除，很可能是改名：**不要假設改名前後內容一樣**，要整個 frame 重新看一次，並更新「Frame → 頁面對照」。
4. 把變更清單整理給使用者，**確認後**才開始改程式碼。沒有任何變更就回報後結束。
5. 快照只抓得到結構、顏色、文字、尺寸，抓不到 Auto Layout 跟圖片內容。所以有變更的 frame 都要用 `export_node_as_image` 看一次截圖。

## 4. 讀取細節（只針對有變更的 frame）

- `get_node_info` / `get_nodes_info`：結構、尺寸、顏色
- `get_styles`：顏色、文字樣式，對照 `src/styles/global.css` 的 `@theme`，缺的 token 先補上
- `get_local_components`：對照 `src/components/`，看有沒有已經做過的元件
- `scan_text_nodes`：文案原文
- `get_annotations`：設計師的標註（互動、狀態、備註），一定要看
- `export_node_as_image`：frame 截圖當作比對基準；圖示、插圖匯出到 `src/assets/`

## 5. 實作

依照 `CLAUDE.md` 的「切版規則」跟「純前端資料規則」：先 token → 再元件 → 最後新增或更新 `src/pages/`。
只改這次有變更的部分，不要順手改沒動到的頁面。

## 6. 驗證與收尾

1. `node --test figma/snapshot.test.mjs` 跟 `npm run build` 都要通過。
2. 起 dev server，用瀏覽器截圖跟 frame 截圖並排比對：手機（設計稿寬度）跟桌機（1280px）兩種寬度。
3. 更新 `figma/versions.md`：這一版的變更清單、改了哪些頁面，以及「Frame → 頁面對照」表。
4. Commit `figma/`（快照 + versions.md）。**這一步不能省**：下一版是跟最後一次 commit 的快照比對，沒有 commit 的話，下一版的差異會算錯。
5. 回報：改了哪些檔案、新增了哪些 token、哪些地方跟設計稿不一致或是自行推斷的。

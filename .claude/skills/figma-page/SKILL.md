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
2. Talk to Figma **不會用連結讀檔案**，只會讀 Figma 桌面版目前打開的檔案。請使用者在 Figma 打開這一版的檔案，執行 **Cursor Talk to Figma MCP Plugin**，再把 channel ID 給你。
   **channel ID 必填；連結選填**，只用來記錄，腳本跟比對都不需要（外掛也不回傳檔案 ID，無法用連結核對打開的檔案）。
3. `join_channel` 加入（後面讀細節要用）。外掛只讀得到**目前所在的 page**，有多個 page 時要請使用者切換。

## 2. 記錄版本

在 `figma/versions.md` 的「版本紀錄」最上面新增一版：版本號、日期、連結（沒給就寫「未提供」）。比對結果在第 3 步之後補上。

## 3. 擷取快照、找出變更

1. 確認工作區乾淨：`git status --porcelain figma/` 應該是空的（上一版有 commit 才能當比對基準）。
2. `node figma/snapshot.mjs <channel ID>`：腳本直接連 WebSocket 抓所有頂層 frame，**不要**自己用 MCP 一個個 `get_node_info` 再寫檔（幾 MB 的 JSON 經過對話既浪費又容易抄錯）。
   - 輸出每個 frame 的 node id（每份檔案都不一樣），後續讀細節時直接用。
   - 每個 frame 存 `<名稱>.json`（結構）跟 `<名稱>.png`（截圖），都進 git。
   - **同名 frame 是常態**（設計師不保證會改名）。腳本會拿每個同名 frame 跟上一版的「名稱」「名稱 #2」…比內容，最像的沿用舊名，剩下的編新號，並印出 `node id→名稱（相似度）`。
     - 相似度 1.00 = 截圖完全一樣；低於 0.3 不配對，視為新的。
     - 相似度偏低（< 0.6）或配對看起來不對 → 用 Read 看兩邊截圖自己判斷，必要時手動對調檔名再 `--report`。
     - 同名 frame 通常是同一頁的不同狀態（例如帶卡片的「台北」跟只有地圖的「台北 #2」）。從截圖和標註判斷關係，在「Frame → 頁面對照」寫清楚是哪一頁的哪個狀態。
3. `node figma/snapshot.mjs --report`：跟上一次 commit 比，分成四類，**先看這份摘要，不要直接讀幾千行的 git diff**：
   - **視覺變更**（截圖變了）→ 要改網頁。用 Read 並排看新截圖 `figma/snapshots/<名稱>.png` 跟舊截圖（`git show HEAD:figma/snapshots/<名稱>.png > <scratchpad>/舊.png`）
   - **非視覺變更**（截圖沒變）→ 通常是原型互動、轉場設定，必要時才看 `git diff`，優先度低
   - **新增** → 新頁面，或是被改名的 frame
   - **刪除** → 頁面被移除，或是被改名的 frame
   - 同一次同時有新增跟刪除，很可能是改名：**不要假設改名前後內容一樣**，要整個 frame 重新看一次，並更新「Frame → 頁面對照」。
   - **刪除是正常的**：定稿前會經過討論，把不重要的 frame 和元素刪掉。列在報告裡請使用者確認即可，不是異常。對應的網頁也要一起移除。
   - 只有「大半 frame 都不見」或「整份跟上一版完全不像」時，才懷疑打開了錯的檔案，先停下來問使用者。
4. 快照刻意不比對的東西：node ID 與所有 ID 參照（複製檔案後全會變）、畫布座標、浮點誤差。所以**原型連結改指到哪一頁**比不出來，實作時用 `get_reactions` 確認。
5. 把變更清單整理給使用者，**確認後**才開始改程式碼。沒有任何變更就回報後結束。
6. 調整了 `normalize` 規則後，先 `node figma/snapshot.mjs --renormalize` 重整已 commit 的基準並 commit，否則會出現大量假差異。
7. 比對進行中（`figma/snapshots/` 有未 commit 的變更）要 commit 其他檔案時，用 `git commit -- <路徑>` 只 commit 指定檔案，不要 `git add` 後整批 commit，否則快照會被提前 commit 進基準，報告就漏掉變更。

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
4. Commit `figma/`（快照、截圖、versions.md）。**這一步不能省**：下一版是跟最後一次 commit 的快照比對，沒有 commit 的話，下一版的差異會算錯。
5. 回報：改了哪些檔案、新增了哪些 token、哪些地方跟設計稿不一致或是自行推斷的。

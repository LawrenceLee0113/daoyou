# Figma 設計稿版本紀錄

設計師會把定稿複製成新檔案，所以每一版的連結都不一樣。流程見 `/figma-page` skill。

- `snapshots/`：每個 frame 一份最新快照（`node figma/snapshot.mjs <channel ID>` 產生），舊版本在 git 歷史裡。
- 比對：執行 `git status --porcelain figma/snapshots/`，`M` 是修改，`??` 是新增，`D` 是刪除。
- `.cache/`：frame 截圖，只存在本機、不進 git。

## Frame → 頁面對照

| Frame 名稱 | 頁面檔案 | 備註 |
|---|---|---|

## 版本紀錄（新的寫在最上面）

### v2 — 2026-10-25（流程測試：第一份）
- 連結：未提供
- 狀態：第一次擷取快照，作為比對基準。page「Page 1」共 40 個 frame（另有 21 個散落素材不拍快照）

### v1 — 2026-10-25
- 連結：https://www.figma.com/design/25olxEkC2qMiP1xUuxeAH7/Untitled--claude%E7%94%A8-
- 狀態：初始連結，設計還在進行中，尚未擷取快照

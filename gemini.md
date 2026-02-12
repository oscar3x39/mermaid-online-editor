# Mermaid Online Editor 開發鐵則

為了保持專案的高品質與一致性，請遵循以下鐵則：

## 1. UI 與 組件規範
- **GitHub 按鈕**：使用自訂的 `GitHubStarButton.vue` 組件，**不依賴** `buttons.github.io` 外部腳本。
- **意見回饋**：AppBar/Toolbar 必須包含顯眼的「意見回饋 (Feedback)」入口，並導向 GitHub Issues。
- **圖標庫**：統一使用 `lucide-vue-next`，保持線條俐落與風格統一。
- **多語系支持**：所有新增的 UI 字串必須同步更新至 `src/constants/translations.js`，確保 `zh` 與 `en` 均有正確對應。
- **代碼編輯器**：必須使用 **CodeMirror 6**，提供語法高亮、行號、自動完成、括號匹配等現代編輯器功能。禁止回退到 `<textarea>`。
- **零外部依賴**：禁止使用 Google Fonts、CDN 字體或任何外部腳本。所有資源必須自託管或使用系統字體。

## 2. 開發流程
- **環境更新**：若原始碼變動未在瀏覽器生效，請務必執行：
  ```bash
  docker-compose up -d --build
  ```
- **SPA 優化**：對於像 GitHub Button 這種依賴外部 JS 的非 Vue 組件，在組件 `onMounted` 時需檢查並觸發重繪（例如 `window.GitHubButtons.render()`）。
- **CodeMirror 主題**：編輯器主題需與全局 CSS 變數保持一致（`var(--primary)`, `var(--bg-secondary)` 等）。

## 3. 設計美學
- **Premium 質感**：保持深色系 (Dark Mode) 為主的設計。
- **響應式排版**：確保工具列在手機板 (max-width: 768px) 會自動縮減不必要的文字，僅保留關鍵圖標。
- **代碼高亮**：使用 Dracula 風格的語法著色（關鍵字：粉紅、字串：黃色、註釋：灰紫）。

---
*最後更新日期：2026-02-13*

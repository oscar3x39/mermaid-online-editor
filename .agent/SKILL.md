---
name: Mermaid Live Editor Standards
description: 確保 Mermaid Editor 專案開發符合 UI 規範與多語系標準。
---

# Mermaid Live Editor 開發指南

## 核心準則
1. **GitHub Star 按鈕**：
   - 務必使用官方 SDK。
   - `onMounted` 必須調用 `window.GitHubButtons.render()` 以支援 SPA 跳轉後的顯示。

2. **意見回饋 (Feedback)**：
   - 入口必須位於 Toolbar。
   - 連結至 `https://github.com/oscar3x39/mermaid-online-editor/issues`。

3. **多語系 (I18n)**：
   - 修改 `src/constants/translations.js` 檔案。
   - 確保 `zh` 和 `en` 鍵值對齊。

4. **代碼編輯器 (CodeMirror 6)**：
   - 組件位於 `src/components/CodeEditor.vue`。
   - 提供語法高亮、行號、自動完成、括號匹配。
   - Mermaid 關鍵字自動完成已內建。
   - 主題配色遵循 Dracula 風格。

5. **環境構建**：
   - 優先使用 `docker-compose up -d --build` 解決快取問題。

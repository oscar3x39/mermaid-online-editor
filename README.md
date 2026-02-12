# 🧜‍♂️ Mermaid Online Editor

[![Vue](https://img.shields.io/badge/Vue.js-3.4-4fc08d?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Mermaid](https://img.shields.io/badge/Mermaid.js-10.9-ff69b4?style=for-the-badge)](https://mermaid.js.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

## 🌐 Live Demo

🚀 **Experience it live:** [https://mermaid-online-editor-oscar339.vercel.app/](https://mermaid-online-editor-oscar339.vercel.app/)

> **A professional, high-performance Mermaid.js live editor with a premium UI, ultra-lightweight state sharing, and local persistence.**

---

<p align="center">
  <a href="#english"><b>English Edition</b></a> | 
  <a href="#繁體中文"><b>繁體中文版本</b></a>
</p>

---

<a name="english"></a>
## ✨ Features (English)

- **🎨 Premium UI/UX**: Inspired by the official Mermaid.live editor. Features a sleek dark mode, refined typography (Inter & JetBrains Mono), and a responsive split-pane layout.
- **🔗 Zero-Server Sharing**: Share your diagrams via URLs. Uses **Deflate (zlib) compression** to generate short, shareable links without storing any data on a server.
- **⏳ Smart History & Persistence**: Your work is instantly saved to `LocalStorage`. Includes a dedicated history panel to manage your past versions.
- **⌨️ Pro Editing Experience**: Full **Undo/Redo (`Ctrl+Z` / `Ctrl+Y`)** support with debounced state grouping.
- **🌐 Multi-language Support**: Seamless toggle between **English** and **Chinese (繁體中文)**.
- **🖼️ High-Quality Export**: Export your diagrams as high-resolution (2x scale) PNGs with theme-aware backgrounds and automatic padding.
- **🔍 Pan & Zoom Preview**: Interactive preview area with mouse wheel scaling and click-and-drag panning.
- **🍪 GDPR Compliant**: Includes a sleek cookie consent banner for privacy law compliance.
- **🐳 Docker Ready**: Optimized multi-stage Docker builds for rapid deployment.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
docker-compose up --build -d
```
Available at `http://localhost:8080`.

### Local Development

1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

<p align="right">
  <a href="#繁體中文"><b>切換至中文版本 ➔</b></a>
</p>

---

<a name="繁體中文"></a>
## ✨ 功能特色 (正體中文)

- **🎨 頂級 UI/UX 設計**: 靈感來自官方 Mermaid.live，具備深色模式、精緻字形（Inter & JetBrains Mono）以及響應式的雙面板佈局。
- **🔗 零伺服器分享**: 透過網址直接分享圖表。使用 **Deflate (zlib) 壓縮技術** 生成精簡的分享連結，完全不經由伺服器存儲數據。
- **⏳ 智慧歷史與持久化**: 您的代碼會即時保存於瀏覽器的 `LocalStorage`。內置專屬歷史面板，輕鬆管理與回溯過往版本。
- **⌨️ 專業編輯體驗**: 完整支援 **復原/重做 (`Ctrl+Z` / `Ctrl+Y`)**，並具備智慧輸入分組功能，避免頻繁撤銷。
- **🌐 多國語言支援**: 支援 **繁體中文** 與 **英文** 介面的一鍵切換。
- **🖼️ 高品質圖片導出**: 支援導出 2 倍解析度的高清 PNG，具備主題感應背景與自動留白。
- **🔍 畫布平移與縮放**: 互動式預覽區，支援滑鼠滾輪縮放與點擊拖拽平移。
- **🍪 符合隱私規範**: 內置磨砂玻璃質感的 Cookie 同意聲明，符合隱私權法律標準。
- **🐳 Docker 支援**: 優化後的多階段 Docker 構建腳本，支援快速部署。

## 🚀 快速啟動

### 使用 Docker (建議)

```bash
docker-compose up --build -d
```
啟動後請訪問 `http://localhost:8080`。

### 本地開發

1. 進入目錄：`cd frontend`
2. 安裝依賴：`npm install`
3. 啟動開發伺服器：`npm run dev`

---

## 🛠 Project Structure / 專案結構

```text
frontend/
├── src/
│   ├── assets/       # 樣式與靜態資源
│   ├── components/   # 模組化組件 (Toolbar, ShareModal, Toast 等)
│   ├── composables/  # 邏輯抽離 (歷史、撤銷、網址同步、Mermaid 渲染)
│   ├── constants/    # 常量配置 (語言翻譯、範例代碼)
│   ├── App.vue       # 應用程式入口
│   └── main.js       # 初始化
├── Dockerfile        # 優化構建腳本
└── .dockerignore     # 構建過濾配置
```

## 🔐 Privacy & Sharing / 隱私與分享

**我們極度重視您的隱私。本應用在後端是「無狀態」的：**
- 所有圖表數據均存儲在 **您瀏覽器的本地存儲 (LocalStorage)** 中。
- 分享連結是將您的代碼壓縮後直接放入網址 Hash 內生成。
- **任何圖表數據都不會被傳送到我們的伺服器，我們也不會存儲任何您的代碼。**

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Created with ❤️ for the Mermaid community.

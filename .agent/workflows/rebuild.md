---
description: 重新構建並重啟開發環境 (Docker)
---

如果發現程式碼修改後沒有在瀏覽器中生效，請執行此 Workflow：

// turbo
1. 執行 Docker 重構命令：
   ```powershell
   docker-compose up -d --build
   ```

2. 確認容器狀態：
   ```powershell
   docker-compose ps
   ```

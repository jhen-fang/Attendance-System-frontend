# Firebase 部署指南

本文檔說明如何將 Attendance System Frontend 專案部署到 Firebase。

## 專案配置

### Firebase 專案資訊
- 專案 ID: `tsmc-attendance-system-458811`
- 部署環境: Firebase Hosting（全球 CDN，自動佈建）
- 後端 Functions 部署區域: `asia-east1`

### 主要配置文件
1. `firebase.json` - Firebase 部署配置
2. `.firebaserc` - Firebase 專案關聯配置
3. `firebase.yaml` - Cloud Build 部署配置

## 部署架構

### Hosting 配置
- 靜態文件目錄: `dist`
- 路由重寫規則:
  - `/api/**` 請求轉發到 Cloud Functions 服務
  - 其他請求重定向到 `index.html`（支持 SPA 路由）
- 快取控制: 禁用快取以確保內容即時更新

### Cloud Functions
- 運行環境: Node.js 22
- 主要功能:
  - `ntpcHolidays`: 代理新北市假日 API 請求
- 部署前自動執行:
  - 代碼檢查 (lint)
  - TypeScript 編譯

## 部署流程

### 本地部署
1. 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

2. 登入 Firebase
```bash
firebase login
```

3. 構建專案
```bash
npm run build
```

4. 部署到 Firebase
```bash
firebase deploy
```

### 自動化部署 (Cloud Build)
專案使用 Google Cloud Build 進行自動化部署，配置在 `firebase.yaml` 中：

1. 構建步驟:
   - 安裝依賴
   - 使用環境變數 `VITE_API_BASE_URL` 構建專案
   - 部署到 Firebase Hosting

2. 環境變數:
   - `VITE_API_BASE_URL`: API 基礎 URL
   - `FIREBASE_TOKEN`: Firebase 部署令牌

## 環境變數配置

部署時需要設置以下環境變數：
- `VITE_API_BASE_URL`: 後端 API 的基礎 URL
- `FIREBASE_TOKEN`: Firebase 部署令牌

這些變數存儲在 Google Cloud Secret Manager 中：
- `projects/tsmc-attendance-system-458811/secrets/API_URL`
- `projects/tsmc-attendance-system-458811/secrets/FIREBASE_TOKEN`

## 自有網域綁定到 Firebase Hosting 
1. 在 Firebase Console 新增自訂網域
+ 「連結自訂網域」（Add custom domain）
+ 輸入你要綁定的網域（例如 tsmc-attendance-system.junting.info)
+ 「重新導向至現有的網站」不須勾選

2. 在 Firebase Console 取得 CNAME 資訊
+ Proxy status：務必選「DNS only」（灰色雲朵），才能讓 Firebase 正確驗證
3. 在 Cloudflare 新增這個 CNAME

## 注意事項

1. 部署前確保：
   - 所有代碼已提交到版本控制
   - 環境變數已正確配置
   - 本地測試通過

2. 部署後檢查：
   - 網站是否正常訪問
   - API 請求是否正常轉發
   - Cloud Functions 是否正常運行

3. 故障排除：
   - 檢查 Firebase Console 的部署日誌
   - 確認環境變數是否正確設置
   - 驗證 API 端點是否可訪問

## 相關命令

```bash
# 部署所有服務
firebase deploy

# 僅部署 Hosting
firebase deploy --only hosting

# 僅部署 Functions
firebase deploy --only functions

# 查看部署日誌
firebase functions:log
```

## 參考資源

- [Firebase Hosting 文檔](https://firebase.google.com/docs/hosting)
- [Cloud Functions 文檔](https://firebase.google.com/docs/functions)
- [Cloud Build 文檔](https://cloud.google.com/build/docs)
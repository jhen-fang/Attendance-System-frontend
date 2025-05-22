# Attendance System Frontend

這是一個使用 React + TypeScript + Vite 開發的考勤系統前端專案。

## Tech Stack

- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- React Router DOM
- Axios
- Day.js
- ESLint + Prettier

## 專案結構

```
attendance-system-frontend/
├── src/                    # 源代碼目錄
│   ├── api/               # API 相關配置和請求
│   ├── assets/            # 靜態資源文件
│   ├── components/        # 可重用的 React 組件
│   ├── hooks/             # 自定義 React Hooks
│   ├── pages/             # 頁面組件
│   ├── types/             # TypeScript 類型定義
│   └── utils/             # 工具函數
├── public/                # 靜態公共資源目錄
├── node_modules/          # 依賴包目錄
├── .vscode/              # VSCode 配置目錄
├── package.json          # 專案配置和依賴管理
├── package-lock.json     # 依賴版本鎖定文件
├── tsconfig.json         # TypeScript 配置
├── tsconfig.app.json     # 應用程式 TypeScript 配置
├── tsconfig.node.json    # Node.js TypeScript 配置
├── vite.config.ts        # Vite 構建工具配置
├── eslint.config.js      # ESLint 代碼檢查配置
├── prettier.config.cjs   # Prettier 代碼格式化配置
└── index.html            # 應用程式入口 HTML 文件
```

## 本地開發環境設置

### 前置需求

- Node.js (建議使用 v18 或更高版本)
- npm 或 yarn

### 安裝步驟

1. Clone專案
```bash
git clone [https://github.com/zzronggg/Attendance-System-frontend.git]
cd attendance-system-frontend
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 啟動開發服務器
```bash
npm run dev
# 或
yarn dev
```

開發服務器將在 http://localhost:5173 啟動。

### 其他可用的腳本

- `npm run build` - 構建生產環境版本
- `npm run preview` - 預覽生產環境構建
- `npm run lint` - 運行 ESLint 檢查
- `npm run format` - 使用 Prettier 格式化代碼

## 開發指南

- 使用 TypeScript 進行開發，確保類型安全
- 遵循 ESLint 和 Prettier 的程式碼風格規範
- 組件開發遵循 React 最佳實踐
- 使用 Material-UI 組件庫保持 UI 一致性

## 注意事項

- 確保後端 API 服務器正在運行
- 開發時請注意跨域問題的處理
- 遵循專案的 Git 提交規範

## 環境變數配置

在專案根目錄創建 `.env` 文件，並設置以下環境變數：

```bash
VITE_API_URL=http://localhost:8080
```

這個環境變數用於配置後端 API 的基礎 URL。在開發環境中，請確保這個 URL 指向正確的後端服務地址。


## 自有網域綁定到 Firebase Hosting 
1. 在 Firebase Console 新增自訂網域
+ 「連結自訂網域」（Add custom domain）
+ 輸入你要綁定的網域（例如 tsmc-attendance-system.junting.info)
+ 「重新導向至現有的網站」不須勾選

2. 在 Firebase Console 取得 CNAME 資訊
+ Proxy status：務必選「DNS only」（灰色雲朵），才能讓 Firebase 正確驗證
3. 在 Cloudflare 新增這個 CNAME


# Attendance-System Frontend

這是一個使用 Vite + React 製作的前端專案，負責串接考勤管理系統的後端 API。

> 後端專案與資料庫 docker-compose 參見

> [Attendance-System-API](https://github.com/JunTingLin/Attendance-System-API)

> [Attendance-System-db](https://github.com/JunTingLin/Attendance-System-db)

---

## 專案結構說明

```
Attendance-System_frontend/
├── public/                 
├── src/
│   ├── api/                 # API 呼叫函式
│   ├── components/          # 公用元件 (ex: Layout側邊欄)
│   ├── pages/               # 各個頁面
│   ├── types/               # 類別定義 (ex: EmployeeDTO)
│   ├── App.tsx              # 頁面路徑總入口
│   └── main.tsx             # React 入口
├── .env                     # 環境變數設定（開發完成才加入此檔案）
├── package.json             # 專案設定與依賴
├── tsconfig.json            # TypeScript 設定
└── vite.config.ts           # Vite 設定
```

---

## 基本啟動指令

1. 安裝套件
   ```bash
   npm install
   ```

2. 啟動開發伺服器
   
   ```bash
   npm run dev
   ```
3. (可選) 打包專案
   
   ```bash
   npm run build
   ```

---

## 頁面路徑設計

| Path             | 對應頁面         | 是否需要登入 |
| ---------------- | ---------------- | ------------ |
| `/login`         | 登入頁面          | 否           |
| `/employee`      | 員工資料頁        | 是           |
| `/leave`         | 請假申請表        | 是           |
| `/leave-manage`  | 假單管理          | 是           |

- 如果尚未登入，訪問需要登入的頁面會自動跳轉到 `/login`。
- 成功登入後會被導向 `/employee`。

---

## 注意事項

- API 伺服器網址應該設定在 `.env` 裡（目前暫未使用此方式設置），例如：
  ```bash
  VITE_API_URL=http://localhost:8080
  ```
- 前端透過 `Authorization: Bearer {token}` 把登入後的 JWT token 加到每個 API 請求裡。
- 頁面切換使用 `react-router-dom v6`，統一用 `<Routes>` 與 `<Route>` 配置。

```

```

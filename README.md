# tibame-lesson2 — 車輛管理系統（VMS）

這是一個 AI 課程範例專案，包含一套完整的車輛管理系統，以及供學員練習 AI 協作開發的 **Agent Skills**。

---

## 目錄結構

```
tibame-lesson2/
├── apps/
│   ├── backend/              # Express 5 + pg (raw SQL)，CommonJS，port 3001
│   └── frontend/             # React 18 + Vite + shadcn/ui + Magic UI，port 5173
├── infra/
│   └── pgadmin/
│       ├── servers.json      # pgAdmin 自動佈建連線設定
│       └── pgpass            # pgAdmin 自動填入密碼
├── src/skills/               # Agent Skill 範例（ESM，Jest 測試）
├── openspec/                 # 變更提案、設計規格、任務清單
└── docker-compose.yml        # PostgreSQL 16（port 5433）+ pgAdmin 4（port 5050）
```

---

## 快速開始

### 前置需求

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（Running 狀態）
- Node.js >= 20

### 一次性安裝

```bash
# 1. 啟動資料庫（自動執行 schema.sql + seed.sql）
docker compose up -d

# 2. 安裝後端依賴並設定環境變數
cd apps/backend
cp .env.example .env      # 已預設正確設定，通常不需修改
npm install

# 3. 安裝前端依賴
cd ../frontend
npm install

# 4. 安裝根目錄依賴（Agent Skills 測試用）
cd ../..
npm install
```

---

## 每日開發

每次開發需開啟三個終端機：

```bash
# 終端 1：資料庫（已在背景執行則略過）
docker compose up -d

# 終端 2：後端
cd apps/backend && npm run dev

# 終端 3：前端
cd apps/frontend && npm run dev
```

---

## 服務網址

| 服務 | 網址 | 說明 |
|------|------|------|
| 前端應用 | http://localhost:5173 | React + Vite |
| 後端 API | http://localhost:3001 | Express REST API |
| pgAdmin  | http://localhost:5050 | PostgreSQL 管理介面 |

---

## 預設帳號

### 應用程式登入（http://localhost:5173）

密碼均為 `Admin1234!`

| 帳號 | 角色 | 說明 |
|------|------|------|
| `admin` | 管理者 | 可存取所有功能（含員工管理、刪除車輛） |
| `alice` | 一般使用者 | 僅可檢視 / 新增 / 編輯車輛 |
| `bob`   | 一般使用者 | 僅可檢視 / 新增 / 編輯車輛 |

### pgAdmin（http://localhost:5050）

| 欄位 | 值 |
|------|----|
| Email | `admin@example.com` |
| Password | `admin` |

登入後左側 **Servers** 會自動出現 **VMS Postgres (tibame-lesson2)** 連線，無需手動設定。

---

## 資料庫管理

| 指令 | 說明 |
|------|------|
| `docker compose up -d` | 啟動 PostgreSQL + pgAdmin |
| `docker compose down` | 停止容器（保留資料） |
| `docker compose down -v` | 停止並**清除所有資料**（重置為初始狀態） |
| `docker compose ps` | 查看容器狀態 |

> PostgreSQL 對外 port 為 **5433**（避免與其他 Postgres 衝突）。  
> pgAdmin 連線使用 Docker 內部 hostname `postgres`，port `5432`。

---

## 功能說明

### 前端技術棧

- React 18 + Vite 5 + React Router 6
- shadcn/ui（Button、Card、Dialog、Table、Select、Badge、Alert、AlertDialog）
- Magic UI NumberTicker（儀表板 KPI 動畫數字）
- recharts（圓餅圖 + 長條圖）
- Axios（`withCredentials: true`，proxy `/api` → port 3001）

### 頁面功能

| 頁面 | 路由 | 權限 | 說明 |
|------|------|------|------|
| 登入 | `/login` | 所有人 | 帳號密碼驗證，JWT httpOnly cookie |
| 儀表板 | `/dashboard` | 已登入 | KPI 卡片 + 車輛狀態圓餅圖 + 每月新增長條圖 |
| 車輛管理 | `/vehicles` | 已登入 | 查看 / 新增 / 編輯；刪除僅限管理者 |
| 員工管理 | `/employees` | 管理者 | 完整 CRUD，新增同步建立登入帳號 |

### 後端 API

| 路由群組 | 說明 |
|----------|------|
| `POST /api/auth/login` | 登入，回傳 JWT cookie |
| `POST /api/auth/logout` | 登出，清除 cookie |
| `GET /api/auth/me` | 取得目前登入使用者 |
| `GET/POST/PUT/DELETE /api/vehicles` | 車輛 CRUD |
| `GET/POST/PUT/DELETE /api/employees` | 員工 CRUD（admin only） |
| `GET /api/dashboard/stats` | 儀表板統計數據 |

---

## Agent Skills

內建 Skills 放在 `.agents/skills/`，透過 Claude Code 的 `/` 指令呼叫：

| Skill | 說明 |
|-------|------|
| `git-smart-commit` | 將變更自動拆分成多個語意清晰的 conventional commit |
| `git-pr-description` | 自動產生 Pull Request 標題與描述 |
| `gen-test-cases` | 根據程式碼產生測試案例與測試程式 |
| `git-branch-name` | 根據變更內容設計 kebab-case branch 名稱 |
| `openspec-*` | OpenSpec 工作流程（提案 → 設計 → 實作 → 歸檔） |

---

## 常見問題

**Q：啟動時 port 5433 衝突？**  
A：執行 `docker compose down` 後重試，或檢查是否有其他服務佔用 5433。

**Q：登入密碼錯誤？**  
A：若資料庫 volume 是舊版本保留的，執行 `docker compose down -v && docker compose up -d` 重置即可。

**Q：pgAdmin 看不到 VMS 伺服器？**  
A：執行 `docker compose down && docker compose up -d` 重啟容器，`servers.json` 只在初次啟動時載入。

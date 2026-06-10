# tibame-lesson2

這是一個 AI 課程的範例專案，提供預設的 **Agent Skills** 供學員練習如何與 AI 協作開發。

## 關於 Agent Skills

專案內建的 Skills 放置於 `.agents/skills/` 目錄下。

每個 Skill 都是一份提示詞腳本，用來擴充 AI Agent 的特定能力。如果你使用其他 AI Agent（如 GitHub Copilot、Cursor、Gemini 等），可以參考這些 Skills 的結構與邏輯，改寫成符合你的工具的格式。

## 內建 Skills

| Skill | 說明 |
|-------|------|
| `git-smart-commit` | 將雜亂的 git 變更依功能邏輯自動拆分成多個有意義的 conventional commit |
| `git-pr-description` | 根據 branch 差異自動產生 Pull Request 的 Title 與 Description |
| `gen-test-cases` | 根據選取的程式碼或功能範圍，自動產生測試案例與對應測試程式 |
| `git-branch-name` | 根據變更內容，設計符合 kebab-case 命名規則的名稱 |

## 快速開始

1. 安裝 [Claude Code](https://claude.ai/code)
2. 在專案目錄下啟動 Claude Code
3. 輸入 `/` 即可看到可用的 Skills 清單

---

## 車輛管理系統（VMS）操作指南

### 前置需求

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（已啟動並處於 Running 狀態）
- Node.js >= 20

### 目錄結構

```
tibame-lesson2/
├── docker-compose.yml        # Postgres + pgAdmin
├── apps/
│   ├── backend/              # Express.js API (port 3001)
│   └── frontend/             # React + Vite (port 5173)
```

---

### 步驟一：啟動資料庫（Docker）

確認 Docker Desktop 已在系統列顯示 **Running**，再執行：

```bash
# 在專案根目錄（tibame-lesson2/）執行
docker compose up -d
```

確認容器狀態：

```bash
docker compose ps
```

兩個 container 都應顯示 `healthy` 或 `running`：
- `vms_postgres` — PostgreSQL 16（port 5432）
- `vms_pgadmin` — pgAdmin 4（port 5050）

停止容器：

```bash
docker compose down
```

---

### 步驟二：啟動後端

```bash
cd apps/backend
npm run dev
```

後端預設跑在 `http://localhost:3001`。

> 若 `.env` 不存在，請先執行：`cp .env.example .env`

---

### 步驟三：啟動前端

開啟另一個終端機：

```bash
cd apps/frontend
npm run dev
```

前端預設跑在 `http://localhost:5173`。

> 若 `.env` 不存在，請先執行：`cp .env.example .env`

---

### 服務網址一覽

| 服務 | 網址 |
|------|------|
| 前端應用 | http://localhost:5173 |
| 後端 API | http://localhost:3001 |
| pgAdmin | http://localhost:5050 |

---

### 應用程式登入帳號

所有預設帳號的密碼均為 **`Admin1234!`**

| 帳號 | 角色 | 說明 |
|------|------|------|
| `admin` | 管理者 | 可存取所有功能 |
| `alice` | 一般使用者 | 業務部員工 |
| `bob`   | 一般使用者 | 工程部員工 |

---

### pgAdmin 登入與設定 Server

#### 1. 登入 pgAdmin

開啟 http://localhost:5050，使用以下帳密登入：

| 欄位 | 值 |
|------|----|
| Email | `admin@example.com` |
| Password | `admin` |

#### 2. 新增 Server 連線

登入後，點選左側 **Servers** → 右鍵 **Register → Server...**，依以下設定填寫：

**General 頁籤**

| 欄位 | 值 |
|------|----|
| Name | `VMS Local`（任意名稱） |

**Connection 頁籤**

| 欄位 | 值 |
|------|----|
| Host name/address | `postgres`（Docker 內部 hostname） |
| Port | `5432` |
| Maintenance database | `vms_db` |
| Username | `vms_user` |
| Password | `vms_password` |

> 注意：Host 請填 `postgres`（container name），不是 `localhost`。

點選 **Save** 即可連線，展開後可看到 `vms_db` 資料庫。

## 自訂 Skills

每個 Skill 的核心是 `SKILL.md`，描述該 Skill 的運作流程與規則。你可以：

- 直接修改現有 Skill 的行為
- 新增自己的 Skill 目錄與 `SKILL.md`
- 將 Skill 邏輯移植到其他 AI Agent 平台

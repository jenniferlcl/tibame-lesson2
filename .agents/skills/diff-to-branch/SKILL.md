---
name: diff-to-branch
description: 依據當前 git diff 分析程式碼變更意圖，自動產出 `<type>/<kebab-case>` 格式的分支名稱並建立。預設 type 為 feature；只有使用者明確說「修 bug」「bugfix」才用 bugfix。使用時機：使用者說「生成 branch」「diff to branch」「依變更開分支」「從 diff 建分支」「分析變更產生分支」時觸發。
---

# diff-to-branch — 從 git diff 產出分支名稱並建立

分析 staged + unstaged + untracked 的變更內容，推斷功能意圖，產出 `<type>/<kebab-case-description>` 格式的 branch 名稱，經使用者確認後執行 `git checkout -b`。

---

## 流程

### 1. 檢查前置狀態

```bash
git branch --show-current
git status --short
```

- **當前已在 feature branch**（非 `main` / `master` / `develop`）：提示「目前已在 `<branch>`，是否仍要從此處開新分支？」並等待確認。
- **無任何變更**：告知使用者「沒有變更可供推測名稱，請描述分支目的」並等待輸入。
- **存在衝突 / merge 狀態**：請使用者先處理，不繼續後續流程。

---

### 2. 蒐集 diff 資訊

```bash
git status --short
git diff
git diff --cached
git ls-files --others --exclude-standard
```

---

### 3. 分析意圖

從 diff 中歸納**最核心的一個**變更目的：

- 識別主要模組、元件、功能名稱
- 若變更橫跨多個功能，挑**改動量最大**的那項作為主題，並於確認階段提示使用者考慮拆分

---

### 4. 產生分支名稱

#### 格式

```
<type>/<kebab-case-description>
```

#### type 規則

| type | 使用時機 |
|------|---------|
| `feature` | **預設**，所有情況 |
| `bugfix` | 使用者明確說「修 bug」「bugfix」「修復」時 |

不從 diff 內容自行判斷是否為 bugfix；即使看起來像修正，仍預設 `feature`。

#### description 規則（kebab-case）

- 全小寫英文，`-` 分隔
- 3 ~ 6 個單字，整體 ≤ 50 字元
- 動詞開頭：`add-`、`update-`、`remove-`、`refactor-`、`extract-` 等
- 聚焦「做什麼」，不是「改哪個檔案」

#### 範例

| 變更內容 | type | 結果 |
|---------|------|------|
| 新增 audit log 路由與前端頁面 | feature | `feature/add-audit-log` |
| 重構 API 請求邏輯 | feature | `feature/extract-api-client` |
| 修復 Navbar 手機版溢出（使用者指定 bugfix） | bugfix | `bugfix/navbar-mobile-overflow` |

---

### 5. 確認與衝突檢查

列出提案等待確認：

```
🌿 Branch 命名提案

  建議名稱：feature/add-audit-log
  類型：feature（預設）
  依據：apps/backend/src/routes/audit.js、apps/frontend/src/pages/AuditLogPage.jsx 等新增檔案

確認建立並 checkout？(Y/n) 或輸入替代名稱
```

確認前先檢查名稱衝突：

```bash
git rev-parse --verify <proposed-branch> 2>/dev/null
```

若已存在，詢問改名或直接 checkout 既有 branch。

---

### 6. 建立並切換

使用者確認後：

```bash
git checkout -b <branch-name>
git branch --show-current
```

回報已切換至新 branch。

---

## 邊界情況

- **無變更**：請使用者口頭描述目的，依描述產生名稱
- **變更跨多功能**：提示主題可能過廣，建議先用 `git-smart-commit` 拆分
- **使用者直接提供名稱**：只做 kebab-case 與合法字元校驗，不覆寫語意
- **工作區有未提交變更切換 branch**：`git checkout -b` 會帶著變更一起切，先告知使用者

## Requirements

### Requirement: 色彩 token 系統
系統 SHALL 在 `tailwind.config.js` 定義語意化色彩 token，供所有頁面元件統一引用，不得在元件內硬編碼原始色碼。

#### Scenario: 語意色 token 存在
- **WHEN** 開發者在元件中使用 `bg-brand-primary`、`bg-surface`、`text-muted` 等 token
- **THEN** Tailwind JIT 正確解析並套用對應色彩，無 CSS 警告

### Requirement: 車輛狀態語意 badge
系統 SHALL 依車輛狀態顯示對應語意色 badge：可用＝綠色、使用中＝藍色、維修中＝橘色、報廢＝灰色。

#### Scenario: 可用狀態 badge
- **WHEN** 車輛狀態為 `available`
- **THEN** 顯示綠色 badge，文字為「可用」

#### Scenario: 使用中狀態 badge
- **WHEN** 車輛狀態為 `in_use`
- **THEN** 顯示藍色 badge，文字為「使用中」

#### Scenario: 維修中狀態 badge
- **WHEN** 車輛狀態為 `maintenance`
- **THEN** 顯示橘色 badge，文字為「維修中」

#### Scenario: 報廢狀態 badge
- **WHEN** 車輛狀態為 `retired`
- **THEN** 顯示灰色 badge，文字為「報廢」

### Requirement: 儀表板 Bento Grid 排版
儀表板 SHALL 以 CSS Grid Bento 排版呈現 KPI 卡片與圖表，不同卡片佔用不同格數以建立視覺重量差異。

#### Scenario: 儀表板載入
- **WHEN** 使用者進入儀表板頁面
- **THEN** 頁面以 Bento Grid 排版顯示 KPI 卡片（至少 4 張）與圖表區域

### Requirement: KPI 數字動畫
KPI 卡片上的數字 SHALL 在頁面首次載入時以滾動動畫從 0 計數至最終值（NumberTicker）。

#### Scenario: 數字動畫觸發
- **WHEN** 儀表板頁面載入完成且 API 資料回傳
- **THEN** KPI 數字以平滑動效從 0 滾動至實際數值，動畫持續約 1 秒

#### Scenario: 減少動效偏好設定
- **WHEN** 使用者作業系統設定「減少動態效果」（prefers-reduced-motion）
- **THEN** 數字直接顯示最終值，不播放動畫

### Requirement: 側邊欄品牌識別與動效
側邊欄 SHALL 包含品牌識別區域（Logo + 系統名稱），且選取中的導航項目 SHALL 顯示 highlight 背景，滑鼠 hover 時 SHALL 有平滑過渡效果。

#### Scenario: 選取中項目 highlight
- **WHEN** 使用者所在頁面對應某導航項目
- **THEN** 該項目顯示 highlight 背景色，其他項目不顯示

### Requirement: 登入頁視覺層次
登入頁 SHALL 呈現漸層背景與帶陰影的登入卡片，與後台頁面的視覺語言一致。

#### Scenario: 登入頁樣式
- **WHEN** 使用者進入 `/login` 頁面
- **THEN** 頁面顯示漸層背景，登入表單置中於帶陰影的卡片內

### Requirement: 頁面標題漸層文字
系統 SHALL 對儀表板、車輛管理、員工管理三個頁面的主標題套用漸層文字效果，使用品牌主色（Indigo #4f46e5）向右漸變至 Indigo 400。

#### Scenario: 儀表板標題
- **WHEN** 使用者進入儀表板頁面
- **THEN** 頁面標題「儀表板」顯示為左至右漸層文字，顏色由品牌主色漸變

#### Scenario: 車輛管理標題
- **WHEN** 使用者進入車輛管理頁面
- **THEN** 頁面標題「車輛管理」顯示為漸層文字

#### Scenario: 員工管理標題
- **WHEN** 使用者進入員工管理頁面
- **THEN** 頁面標題「員工管理」顯示為漸層文字

### Requirement: KPI 圖示光暈效果
系統 SHALL 在儀表板 KPI 卡片的圖示區域顯示對應顏色的光暈陰影（glow shadow），並在圖示區疊加水平掃過的 shimmer 動畫。

#### Scenario: KPI 圖示光暈
- **WHEN** 使用者進入儀表板且資料載入完成
- **THEN** 每張 KPI 卡片的圖示區（車輛總數＝藍色、可用車輛＝綠色、維修中＝橘色、員工人數＝紫色）顯示對應顏色的外發光陰影

#### Scenario: KPI shimmer 動畫
- **WHEN** 使用者進入儀表板
- **THEN** 每張 KPI 卡片的圖示區持續播放水平光暈掃過動畫，週期約 2.5 秒

### Requirement: 主內容區背景漸層
系統 SHALL 在應用程式主內容區頂部呈現極淡的 Indigo 放射狀漸層背景，與白色頁面底色形成視覺層次。

#### Scenario: 主內容背景
- **WHEN** 使用者登入後瀏覽任一頁面
- **THEN** 主內容區頂部可見極淡的 radial gradient 背景，不影響內容可讀性

### Requirement: 表格列 hover 左側色條
系統 SHALL 在車輛管理與員工管理的表格列滑鼠懸停時，顯示左側品牌主色色條，並以平滑過渡呈現。

#### Scenario: 車輛列表 hover 色條
- **WHEN** 使用者的滑鼠懸停於車輛列表的某一列
- **THEN** 該列左側顯示半透明品牌色縱向色條，過渡動畫平滑

#### Scenario: 員工列表 hover 色條
- **WHEN** 使用者的滑鼠懸停於員工列表的某一列
- **THEN** 該列左側顯示半透明品牌色縱向色條，過渡動畫平滑

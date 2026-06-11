## ADDED Requirements

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

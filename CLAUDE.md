# 隨便吃！App - 專案說明文件

## 專案概述
「隨便吃！」是一款解決用餐選擇困難的 React Native App，提供餐廳隨機推薦、探索、地圖顯示和個人收藏功能。

## 重要提醒事項
- **語言要求**：所有回覆必須使用繁體中文
- **專案架構**：基於 Expo SDK 53 + React Native + TypeScript
- **圖標方案**：使用 Emoji 替代 vector-icons（避免安裝問題）
- **狀態管理**：使用 Redux Toolkit

## 技術堆疊
- React Native 0.79.5
- Expo ~53.0.20
- TypeScript 5.1.3
- Redux Toolkit 1.9.7
- React Navigation 6.x
- React Native Maps 1.20.1

## 專案結構
```
whateverEats/
├── App.tsx                    # 主程式入口
├── src/
│   ├── screens/              # 四個主要頁面
│   ├── components/           # 共用元件
│   ├── store/               # Redux 狀態管理
│   ├── types/               # TypeScript 型別定義
│   └── constants/           # 常數與模擬資料
```

## 主題色彩
- 主色調：活力橘色 `#FF6F3C`
- 背景色：`#FAFAFA`
- 表面色：`#FFFFFF`

## 開發注意事項

### 1. 圖標使用
由於 react-native-vector-icons 在 Windows 環境可能有安裝問題，目前使用 Emoji 作為圖標：
- 轉盤：🎰
- 探索：🔍
- 地圖：📍
- 我的：👤

### 2. Mock 資料
專案包含 5 筆模擬餐廳資料，位於 `src/constants/mockData.ts`

### 3. Redux Store
已設定兩個主要 slice：
- `restaurantSlice`：管理餐廳、收藏、黑名單
- `userSlice`：管理使用者資訊、好友推薦

### 4. 待實作功能
- 登入/註冊流程
- 轉盤動畫效果
- 地圖實際整合
- API 串接
- 深層連結分享功能

## Coding Style 規範

### 1. 避免重複程式碼 (DRY 極致執行)

```
發現重複 → 立即重構
寫新功能 → 先檢查現有程式碼
三次法則 → 出現三次必須抽取
```

**執行策略**：

- **立即重構**：發現任何重複程式碼立即抽取
- **預防性檢查**：新功能開發前先搜尋現有實現
- **三次法則**：同樣邏輯出現三次必須抽取為共用函數/元件
- **工具化**：重複的樣式、配置、API 呼叫邏輯集中管理
- **元件化**：若能共用的元件則要抽出來，分功能放置

### 2. 元件設計原則
- **單一職責**：每個元件只負責一件事
- **可重用性**：優先設計通用元件
- **組合優於繼承**：使用 composition 而非 inheritance
- **Props 明確定義**：使用 TypeScript interface 定義所有 props

### 3. 程式碼組織
- **模組化**：相關功能放在同一資料夾
- **共用邏輯抽取**：hooks、utils、services 分層管理
- **樣式管理**：共用樣式抽取至 constants 或 theme
- **類型定義**：所有型別集中於 types 資料夾

### 4. 命名規範
- **元件**：PascalCase (如 `RestaurantCard`)
- **函數/變數**：camelCase (如 `getRestaurantList`)
- **常數**：UPPER_SNAKE_CASE (如 `MAX_RETRY_COUNT`)
- **檔案名稱**：元件用 PascalCase，其他用 camelCase

### 5. 效能優化
- **避免不必要的重新渲染**：使用 React.memo、useMemo、useCallback
- **列表優化**：使用 FlatList 的優化屬性
- **圖片優化**：使用適當尺寸、快取策略
- **非同步處理**：適當使用 loading、error states

## 常用指令
```bash
# 啟動專案
npm start

# 清除快取啟動
npx expo start --clear

# 指定 port
npx expo start --port 8082
```

## 擴充建議
1. 安裝 react-native-reanimated 實作轉盤動畫
2. 整合真實 API 替換 mock data
3. 加入 AsyncStorage 儲存使用者偏好
4. 實作推播通知功能

## 問題排除
- Port 8081 被佔用：使用 `--port 8082` 參數
- 圖標顯示問題：確認使用 Emoji 而非 vector-icons
- TypeScript 錯誤：檢查 tsconfig.json 設定
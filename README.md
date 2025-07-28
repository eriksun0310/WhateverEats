
claude --dangerously-skip-permissions
# 隨便吃！WhateverEats

一款解決用餐選擇困難的 React Native App，提供餐廳隨機推薦、探索、地圖顯示和個人收藏功能。

## 📱 專案文件

- [MVP 規格書](./MVP_SPEC.md) - 產品功能規格與需求定義
- [專案說明文件](./CLAUDE.md) - 技術架構與開發規範
## 📁 專案架構

```
whateverEats/
├── App.tsx                     # 主程式入口，包含 Bottom Tab 導覽
├── src/
│   ├── screens/               # 畫面元件
│   │   ├── SpinScreen.tsx     # 轉盤推薦頁
│   │   ├── ExploreScreen.tsx  # 探索餐廳頁
│   │   ├── MapScreen.tsx      # 地圖頁
│   │   └── MyScreen.tsx       # 個人頁面
│   ├── components/            # 共用元件
│   │   └── RestaurantCard.tsx # 餐廳卡片元件
│   ├── navigation/            # 導覽相關
│   │   └── types.ts          # 導覽型別定義
│   ├── store/                 # Redux 狀態管理
│   │   ├── index.ts          # Store 設定
│   │   └── slices/           # Redux slices
│   │       ├── restaurantSlice.ts  # 餐廳相關狀態
│   │       └── userSlice.ts        # 使用者相關狀態
│   ├── types/                 # TypeScript 型別定義
│   │   ├── restaurant.ts     # 餐廳資料型別
│   │   └── user.ts          # 使用者資料型別
│   ├── constants/            # 常數定義
│   │   ├── theme.ts         # 主題色彩與樣式
│   │   └── mockData.ts      # 模擬資料
│   ├── utils/               # 工具函式
│   └── assets/              # 圖片等資源
```

## 🎨 主題色彩配置

- **主色調**：活力橘色 `#FF6F3C`
- **背景色**：淺灰色 `#FAFAFA`
- **表面色**：白色 `#FFFFFF`
- **文字色階**：
  - Primary: `#212121`
  - Secondary: `#757575`
  - Light: `#BDBDBD`

## 📱 功能實作狀態

### ✅ 已完成
1. Bottom Tab 導覽架構
2. 四個主要頁面骨架
3. Redux Store 基礎設定
4. 餐廳資料結構定義
5. 餐廳卡片元件
6. Mock 資料準備

### 🔧 待實作功能

#### Explore 頁面擴充建議：
- 搜尋欄位綁定 Redux filter
- 篩選條件 UI（料理類型、距離、價位）
- 餐廳列表整合 RestaurantCard 元件
- 下拉重新整理功能

#### Map 頁面整合建議：
```javascript
// 安裝 react-native-maps 後
import MapView, { Marker } from 'react-native-maps';

// 在地圖上顯示餐廳標記
restaurants.map(restaurant => (
  <Marker
    key={restaurant.id}
    coordinate={{
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    }}
    title={restaurant.name}
  />
))
```

#### Spin 頁面動畫建議：
- 使用 Animated API 或 react-native-reanimated
- 轉盤可用 SVG 或圖片疊加旋轉動畫
- 結果展示使用 Modal 或導航至詳細頁

## 🚀 下一步開發建議

1. **使用者認證流程**
   - 建立 Login/Register 畫面
   - 整合 AsyncStorage 儲存登入狀態

2. **餐廳詳細頁面**
   - 從卡片點擊導航至詳細資訊
   - 顯示完整資訊、圖片輪播、評論等

3. **實際 API 整合**
   - 替換 mock data 為真實 API
   - 處理載入狀態與錯誤處理

4. **地理位置功能**
   - 整合 react-native-geolocation
   - 計算與餐廳的實際距離

5. **分享功能**
   - 使用 react-native-share
   - 產生深層連結 (Deep Link)

## 📦 建議安裝套件

```bash
# 必要套件
npm install @reduxjs/toolkit react-redux
npm install react-native-vector-icons
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-safe-area-context react-native-screens

# 地圖功能
npm install react-native-maps

# 位置服務
npm install @react-native-community/geolocation

# 動畫
npm install react-native-reanimated

# 分享功能
npm install react-native-share
```

## 🔍 使用方式

1. 在 App.tsx 整合 Redux Provider
2. 各頁面透過 useSelector 取得狀態
3. 使用 useDispatch 觸發狀態更新
4. RestaurantCard 元件可重複使用於多個頁面

這個架構提供了良好的擴充性，可以輕鬆加入新功能或修改現有功能。


- 電子郵件: test@example.com
- 密碼: password
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleFavorite, addToBlacklist, toggleWheelList } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import SpinWheel from '../components/SpinWheel';
import RestaurantResultModal from '../components/RestaurantResultModal';
import { RestaurantConfirmModal } from '../components/RestaurantConfirmModal';
import { Restaurant } from '../types/restaurant';
import ToggleButtonGroup from '../components/ToggleButtonGroup';

export default function SpinScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, blacklist, favorites, wheelList } = useSelector(
    (state: RootState) => state.restaurant
  );
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [spinMode, setSpinMode] = useState<'wheelList' | 'favorites'>('wheelList');

  // 根據模式取得可用餐廳
  const getAvailableRestaurants = () => {
    let pool = restaurants;
    
    // 根據模式篩選
    if (spinMode === 'wheelList') {
      pool = restaurants.filter(r => wheelList.includes(r.id));
    } else if (spinMode === 'favorites') {
      pool = restaurants.filter(r => favorites.includes(r.id));
    }
    
    // 排除黑名單
    return pool.filter(r => !blacklist.includes(r.id));
  };
  
  const availableRestaurants = getAvailableRestaurants();

  const handleStartSpin = () => {
    setIsSpinning(true);
    setShowResult(false);
  };

  const handleSpinComplete = () => {
    // 隨機選擇一家餐廳
    if (availableRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRestaurants.length);
      const selected = availableRestaurants[randomIndex];
      
      // 更新選中的餐廳資料（包含 isFavorite 狀態）
      const restaurantWithFavorite = {
        ...selected,
        isFavorite: favorites.includes(selected.id),
      };
      
      setSelectedRestaurant(restaurantWithFavorite);
      setShowResult(true);
    }
    setIsSpinning(false);
  };

  const handleToggleFavorite = () => {
    if (selectedRestaurant) {
      dispatch(toggleFavorite(selectedRestaurant.id));
      // 更新本地狀態
      setSelectedRestaurant({
        ...selectedRestaurant,
        isFavorite: !selectedRestaurant.isFavorite,
      });
    }
  };

  const handleRespin = () => {
    setShowResult(false);
    setSelectedRestaurant(null);
    // 稍後重新開始，讓使用者可以看到轉盤重置
    setTimeout(() => {
      // 轉盤會自動開始新的轉動
    }, 300);
  };

  const handleConfirmRestaurant = () => {
    setShowResult(false);
    setShowConfirm(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>今天吃什麼？</Text>
        <Text style={styles.subtitle}>讓轉盤幫你決定！</Text>
      </View>

      {/* 模式切換器 */}
      <ToggleButtonGroup
        options={[
          { value: 'wheelList', label: '轉盤名單' },
          { value: 'favorites', label: '口袋名單' },
        ]}
        value={spinMode}
        onChange={setSpinMode}
        containerStyle={styles.modeSelector}
      />

      {/* 檢查模式是否有餐廳 */}
      {((spinMode === 'wheelList' && wheelList.length === 0) || 
        (spinMode === 'favorites' && favorites.length === 0)) ? (
        <View style={styles.emptyFavorites}>
          <Text style={styles.emptyTitle}>
            {spinMode === 'wheelList' ? '轉盤名單是空的' : '口袋名單是空的'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {spinMode === 'wheelList' 
              ? '先去探索或地圖頁面加入一些餐廳到轉盤吧！' 
              : '先去探索頁面收藏一些喜歡的餐廳吧！'}
          </Text>
        </View>
      ) : (
        <SpinWheel
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          onStartSpin={handleStartSpin}
        />
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {spinMode === 'wheelList' ? '轉盤名單' : '口袋名單'}：{availableRestaurants.length} 家
        </Text>
        {spinMode === 'wheelList' && wheelList.length > 0 && (
          <Text style={styles.wheelListText}>
            總轉盤數：{wheelList.length} 家
          </Text>
        )}
        {spinMode === 'favorites' && favorites.length > 0 && (
          <Text style={styles.favoriteText}>
            總收藏數：{favorites.length} 家
          </Text>
        )}
        {blacklist.length > 0 && (
          <Text style={styles.blacklistText}>
            黑名單中排除：{blacklist.filter(id => 
              spinMode === 'wheelList' ? wheelList.includes(id) : favorites.includes(id)
            ).length} 家
          </Text>
        )}
      </View>

      <RestaurantResultModal
        visible={showResult}
        restaurant={selectedRestaurant}
        onClose={handleConfirmRestaurant}
        onRespin={handleRespin}
        onToggleFavorite={handleToggleFavorite}
      />

      <RestaurantConfirmModal
        visible={showConfirm}
        restaurant={selectedRestaurant}
        onClose={() => setShowConfirm(false)}
        onToggleFavorite={() => selectedRestaurant && dispatch(toggleFavorite(selectedRestaurant.id))}
        onToggleWheelList={() => selectedRestaurant && dispatch(toggleWheelList(selectedRestaurant.id))}
        onToggleBlacklist={() => selectedRestaurant && dispatch(addToBlacklist(selectedRestaurant.id))}
        isFavorite={selectedRestaurant ? favorites.includes(selectedRestaurant.id) : false}
        isInWheelList={selectedRestaurant ? wheelList.includes(selectedRestaurant.id) : false}
        isBlacklisted={selectedRestaurant ? blacklist.includes(selectedRestaurant.id) : false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    // marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  statsText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  blacklistText: {
    fontSize: 14,
    color: theme.colors.text.light,
  },
  favoriteText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  wheelListText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  modeSelector: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  emptyFavorites: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
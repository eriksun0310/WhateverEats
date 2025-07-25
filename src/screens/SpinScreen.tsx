import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleFavorite } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import SpinWheel from '../components/SpinWheel';
import RestaurantResultModal from '../components/RestaurantResultModal';
import { Restaurant } from '../types/restaurant';

export default function SpinScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, blacklist, favorites, filters } = useSelector(
    (state: RootState) => state.restaurant
  );
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinMode, setSpinMode] = useState<'all' | 'favorites'>('all');

  // 根據模式取得可用餐廳
  const getAvailableRestaurants = () => {
    let pool = restaurants;
    
    // 根據模式篩選
    if (spinMode === 'favorites') {
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>今天吃什麼？</Text>
        <Text style={styles.subtitle}>讓轉盤幫你決定！</Text>
      </View>

      {/* 模式切換器 */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            spinMode === 'all' && styles.modeButtonActive
          ]}
          onPress={() => setSpinMode('all')}
        >
          <Text style={[
            styles.modeButtonText,
            spinMode === 'all' && styles.modeButtonTextActive
          ]}>全部餐廳</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            spinMode === 'favorites' && styles.modeButtonActive
          ]}
          onPress={() => setSpinMode('favorites')}
        >
          <Text style={[
            styles.modeButtonText,
            spinMode === 'favorites' && styles.modeButtonTextActive
          ]}>口袋名單</Text>
        </TouchableOpacity>
      </View>

      {/* 檢查收藏模式是否有餐廳 */}
      {spinMode === 'favorites' && favorites.length === 0 ? (
        <View style={styles.emptyFavorites}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>口袋名單是空的</Text>
          <Text style={styles.emptySubtitle}>先去探索頁面收藏一些喜歡的餐廳吧！</Text>
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
          {spinMode === 'favorites' ? '口袋名單' : '可選餐廳'}：{availableRestaurants.length} 家
        </Text>
        {spinMode === 'all' && blacklist.length > 0 && (
          <Text style={styles.blacklistText}>
            已排除黑名單：{blacklist.length} 家
          </Text>
        )}
        {spinMode === 'favorites' && favorites.length > 0 && (
          <Text style={styles.favoriteText}>
            總收藏數：{favorites.length} 家
          </Text>
        )}
      </View>

      <RestaurantResultModal
        visible={showResult}
        restaurant={selectedRestaurant}
        onClose={() => setShowResult(false)}
        onRespin={handleRespin}
        onToggleFavorite={handleToggleFavorite}
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
    marginBottom: theme.spacing.xl,
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
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  modeButtonTextActive: {
    color: theme.colors.surface,
  },
  emptyFavorites: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    marginVertical: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
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
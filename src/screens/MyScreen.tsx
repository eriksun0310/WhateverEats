import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { removeFromFavorites, removeFromBlacklist } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import { Share2 } from 'lucide-react-native';

export default function MyScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { restaurants, favorites, blacklist } = useSelector(
    (state: RootState) => state.restaurant
  );

  const [activeTab, setActiveTab] = useState<'favorites' | 'blacklist' | 'recommendations'>('favorites');

  // 取得收藏的餐廳
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
  
  // 取得黑名單餐廳
  const blacklistRestaurants = restaurants.filter(r => blacklist.includes(r.id));
  
  // 取得朋友推薦（暫時顯示 mock 資料）
  const recommendedRestaurants = user.friendRecommendations
    .map(rec => restaurants.find(r => r.id === rec.restaurantId))
    .filter(Boolean);

  const handleRemoveFromFavorites = (restaurantId: string) => {
    Alert.alert(
      '移除收藏',
      '確定要從口袋名單移除這家餐廳嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: () => dispatch(removeFromFavorites(restaurantId)),
        },
      ]
    );
  };

  const handleRemoveFromBlacklist = (restaurantId: string) => {
    Alert.alert(
      '移除黑名單',
      '確定要從黑名單移除這家餐廳嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: () => dispatch(removeFromBlacklist(restaurantId)),
        },
      ]
    );
  };

  const handleShare = () => {
    const shareMessage = `我正在使用「隨便吃！」App 探索美食！

這個 App 能幫助解決選擇困難，隨機推薦餐廳，還能收藏喜歡的店家。

快來一起探索美食吧！🍽️`;
    
    Alert.alert(
      '分享 App',
      shareMessage,
      [
        { text: '關閉', style: 'cancel' },
        { text: '複製文字', onPress: () => {
          Alert.alert('提示', '請手動複製上方文字分享給朋友');
        }},
      ]
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'favorites':
        return (
          <FlatList
            data={favoriteRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <RestaurantCard restaurant={item} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromFavorites(item.id)}
                >
                  <Text style={styles.removeButtonText}>移除收藏</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>還沒有收藏的餐廳</Text>
                <Text style={styles.emptySubtext}>在轉盤或探索頁面收藏喜歡的餐廳吧！</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        );
        
      case 'blacklist':
        return (
          <FlatList
            data={blacklistRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <RestaurantCard restaurant={item} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromBlacklist(item.id)}
                >
                  <Text style={styles.removeButtonText}>移除黑名單</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>黑名單是空的</Text>
                <Text style={styles.emptySubtext}>不喜歡的餐廳可以加入黑名單</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        );
        
      case 'recommendations':
        return (
          <FlatList
            data={recommendedRestaurants}
            keyExtractor={(item) => item!.id}
            renderItem={({ item }) => {
              const recommendation = user.friendRecommendations.find(
                r => r.restaurantId === item!.id
              );
              return (
                <View style={styles.cardWrapper}>
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationFrom}>
                      來自 {recommendation?.fromUser} 的推薦
                    </Text>
                    <Text style={styles.recommendationDate}>
                      {new Date(recommendation?.date || '').toLocaleDateString()}
                    </Text>
                  </View>
                  <RestaurantCard restaurant={item!} />
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>還沒有朋友推薦</Text>
                <Text style={styles.emptySubtext}>分享餐廳給朋友，也會收到朋友的推薦！</Text>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <Share2 size={20} color={theme.colors.surface} />
                  <Text style={styles.shareButtonText}>分享 App</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* 個人資訊區 */}
      <View style={styles.profileSection}>
        <View style={styles.profileContent}>
          <Image 
            source={user.avatar === 'women' ? require('../../assets/image/cat.png') : require('../../assets/image/dog.png')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Tab 切換區 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            口袋名單 ({favoriteRestaurants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'blacklist' && styles.activeTab]}
          onPress={() => setActiveTab('blacklist')}
        >
          <Text style={[styles.tabText, activeTab === 'blacklist' && styles.activeTabText]}>
            黑名單 ({blacklistRestaurants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            朋友推薦 ({recommendedRestaurants.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 內容區 */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
  },
  profileContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.surface,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  cardWrapper: {
    marginBottom: theme.spacing.md,
  },
  removeButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    marginTop: -theme.borderRadius.lg,
  },
  removeButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  recommendationFrom: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  recommendationDate: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  shareButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
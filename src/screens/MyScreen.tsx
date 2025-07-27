import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { removeFromFavorites, removeFromBlacklist, removeFromWheelList } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import RemovableList from '../shared/ui/RemovableList';
import { Share2 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface TabConfig {
  key: 'wheelList' | 'favorites' | 'blacklist' | 'recommendations';
  title: string;
  count: number;
  data: any[];
  onRemove?: (id: string) => void;
  removeButtonText?: string;
  emptyState: {
    title: string;
    subtitle?: string;
    action?: {
      label: string;
      onPress: () => void;
      icon?: React.ReactNode;
    };
  };
  renderHeader?: (item: any) => React.ReactNode;
}

export default function MyScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { restaurants, favorites, blacklist, wheelList } = useSelector(
    (state: RootState) => state.restaurant
  );
  const isGuest = user.email === 'test@example.com';

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const contentFlatListRef = useRef<FlatList>(null);

  // 取得各類餐廳列表
  const wheelListRestaurants = restaurants.filter(r => wheelList.includes(r.id));
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
  const blacklistRestaurants = restaurants.filter(r => blacklist.includes(r.id));
  const recommendedRestaurants = user.friendRecommendations
    .map(rec => restaurants.find(r => r.id === rec.restaurantId))
    .filter(Boolean);

  // 統一處理移除確認
  const handleRemoveConfirm = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    Alert.alert(title, message, [
      { text: '取消', style: 'cancel' },
      { text: '移除', style: 'destructive', onPress: onConfirm },
    ]);
  };

  const handleShare = () => {
    const shareMessage = `我正在使用「隨便吃！」App 探索美食！

這個 App 能幫助解決選擇困難，隨機推薦餐廳，還能收藏喜歡的店家。

快來一起探索美食吧！`;
    
    Alert.alert('分享 App', shareMessage, [
      { text: '關閉', style: 'cancel' },
      { text: '複製文字', onPress: () => Alert.alert('提示', '請手動複製上方文字分享給朋友') },
    ]);
  };

  // Tab 配置資料
  const tabData: TabConfig[] = [
    {
      key: 'wheelList',
      title: '轉盤名單',
      count: wheelListRestaurants.length,
      data: wheelListRestaurants,
      onRemove: (id) => handleRemoveConfirm(
        '移除轉盤名單',
        '確定要從轉盤名單移除這家餐廳嗎？',
        () => dispatch(removeFromWheelList(id))
      ),
      removeButtonText: '移除轉盤',
      emptyState: {
        title: '還沒有加入轉盤的餐廳',
        subtitle: '在探索或地圖頁面加入想要抽選的餐廳吧！',
      },
    },
    {
      key: 'favorites',
      title: '口袋名單',
      count: favoriteRestaurants.length,
      data: favoriteRestaurants,
      onRemove: (id) => handleRemoveConfirm(
        '移除收藏',
        '確定要從口袋名單移除這家餐廳嗎？',
        () => dispatch(removeFromFavorites(id))
      ),
      removeButtonText: '移除收藏',
      emptyState: {
        title: '還沒有收藏的餐廳',
        subtitle: '在轉盤或探索頁面收藏喜歡的餐廳吧！',
      },
    },
    {
      key: 'blacklist',
      title: '黑名單',
      count: blacklistRestaurants.length,
      data: blacklistRestaurants,
      onRemove: (id) => handleRemoveConfirm(
        '移除黑名單',
        '確定要從黑名單移除這家餐廳嗎？',
        () => dispatch(removeFromBlacklist(id))
      ),
      removeButtonText: '移除黑名單',
      emptyState: {
        title: '黑名單是空的',
        subtitle: '不喜歡的餐廳可以加入黑名單',
      },
    },
    {
      key: 'recommendations',
      title: '朋友推薦',
      count: recommendedRestaurants.length,
      data: recommendedRestaurants,
      emptyState: {
        title: '還沒有朋友推薦',
        subtitle: '分享餐廳給朋友，也會收到朋友的推薦！',
        action: {
          label: '分享 App',
          onPress: handleShare,
          icon: <Share2 size={20} color={theme.colors.surface} />,
        },
      },
      renderHeader: (item) => {
        const recommendation = user.friendRecommendations.find(
          r => r.restaurantId === item.id
        );
        return (
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationFrom}>
              來自 {recommendation?.fromUser} 的推薦
            </Text>
            <Text style={styles.recommendationDate}>
              {new Date(recommendation?.date || '').toLocaleDateString()}
            </Text>
          </View>
        );
      },
    },
  ];

  // 處理 Tab 點擊
  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    contentFlatListRef.current?.scrollToIndex({ index, animated: true });
  };
  
  // 處理內容滑動
  const handleContentScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index !== activeTabIndex && index >= 0 && index < tabData.length) {
      setActiveTabIndex(index);
    }
  };

  // 渲染內容項目
  const renderContentItem = ({ item }: { item: TabConfig }) => (
    <View style={{ width: screenWidth }}>
      <RemovableList
        data={item.data}
        onRemove={item.onRemove || (() => {})}
        removeButtonText={item.removeButtonText || ''}
        emptyStateProps={item.emptyState}
        renderHeader={item.renderHeader}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 個人資訊區 */}
      <View style={styles.profileSection}>
        <View style={styles.profileContent}>
          <Image 
            source={user.avatar === 'cat' ? require('../../assets/image/cat.png') : require('../../assets/image/dog.png')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {isGuest && (
            <View style={styles.guestTip}>
              <Text style={styles.guestTipText}>
                訪客模式中 - 點右上角註冊獲得完整功能
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tab 切換區 */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsWrapper}>
            {tabData.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTabIndex === index && styles.activeTab]}
                onPress={() => handleTabPress(index)}
              >
                <Text style={[styles.tabText, activeTabIndex === index && styles.activeTabText]}>
                  {tab.title} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 內容區 */}
      <View style={styles.contentContainer}>
        <FlatList
          ref={contentFlatListRef}
          data={tabData}
          renderItem={renderContentItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleContentScroll}
          keyExtractor={(item) => item.key}
          initialScrollIndex={0}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
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
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.sm,
  },
  tabsWrapper: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: theme.spacing.lg,
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
  guestTip: {
    marginTop: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  guestTipText: {
    fontSize: 12,
    color: theme.colors.surface,
    fontWeight: '500',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateUserProfile, logout } from '../store/slices/userSlice';
import { removeFromFavorites, removeFromBlacklist } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import { LogOut } from 'lucide-react-native';

const avatarOptions = [
  { id: 'man', image: require('../../assets/image/man.png'), label: '男士' },
  { id: 'women', image: require('../../assets/image/women.png'), label: '女士' },
];

export default function MyScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { restaurants, favorites, blacklist } = useSelector(
    (state: RootState) => state.restaurant
  );

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [activeTab, setActiveTab] = useState<'favorites' | 'blacklist' | 'recommendations'>('favorites');

  // 取得收藏的餐廳
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
  
  // 取得黑名單餐廳
  const blacklistRestaurants = restaurants.filter(r => blacklist.includes(r.id));
  
  // 取得朋友推薦（暫時顯示 mock 資料）
  const recommendedRestaurants = user.friendRecommendations
    .map(rec => restaurants.find(r => r.id === rec.restaurantId))
    .filter(Boolean);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('錯誤', '請輸入暱稱');
      return;
    }
    
    dispatch(updateUserProfile({
      name: editName.trim(),
      avatar: selectedAvatar,
    }));
    setShowEditProfile(false);
  };

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

  const handleLogout = () => {
    Alert.alert(
      '登出',
      '確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '登出',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
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
                  <Text style={styles.shareButtonText}>🔗 分享餐廳</Text>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 個人資訊區 */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Image 
                source={user.avatar === 'women' ? require('../../assets/image/women.png') : require('../../assets/image/man.png')}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditProfile(true)}
            >
              <Text style={styles.editButtonText}>編輯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 登出按鈕 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>

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
      </ScrollView>

      {/* 內容區 */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* 編輯個人資訊 Modal */}
      <Modal
        visible={showEditProfile}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>編輯個人資訊</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>暱稱</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="輸入暱稱"
              placeholderTextColor={theme.colors.text.light}
            />

            <Text style={styles.inputLabel}>選擇頭像</Text>
            <View style={styles.avatarOptions}>
              {avatarOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === option.id && styles.selectedAvatarOption,
                  ]}
                  onPress={() => setSelectedAvatar(option.id)}
                >
                  <Image 
                    source={option.image} 
                    style={[
                      styles.avatarImage,
                      selectedAvatar === option.id && styles.selectedAvatarImage
                    ]} 
                  />
                  <Text style={styles.avatarLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>儲存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  editButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
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
  },
  shareButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    padding: theme.spacing.xs,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  avatarOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  avatarOption: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  selectedAvatarOption: {
    // 選中的頭像選項容器樣式
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  selectedAvatarImage: {
    borderColor: theme.colors.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
    gap: theme.spacing.xs,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
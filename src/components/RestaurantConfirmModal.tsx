import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Restaurant } from '../types';
import { theme } from '../constants/theme';
import Button from './Button';
import { shadows } from '../constants/shadows';

interface RestaurantConfirmModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onAddToFavorites: (restaurant: Restaurant) => void;
  onAddToBlacklist: (restaurant: Restaurant) => void;
  isFavorite: boolean;
}

export const RestaurantConfirmModal: React.FC<RestaurantConfirmModalProps> = ({
  visible,
  restaurant,
  onClose,
  onAddToFavorites,
  onAddToBlacklist,
  isFavorite,
}) => {
  if (!restaurant) return null;

  const handleNavigation = () => {
    const { latitude, longitude } = restaurant;
    const label = encodeURIComponent(restaurant.name);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url).catch((err) => {
      Alert.alert('無法開啟地圖', '請確認是否安裝地圖應用程式');
    });
  };

  const handleCall = () => {
    // TODO: 需要在 Restaurant type 中加入 phone 欄位
    Alert.alert('撥打電話', '電話功能即將推出！');
  };

  const handleShare = () => {
    // TODO: 實作分享功能
    Alert.alert('分享功能', '即將推出！');
  };

  const handleAddToFavorites = () => {
    onAddToFavorites(restaurant);
    Alert.alert('成功', isFavorite ? '已從收藏中移除' : '已加入收藏');
  };

  const handleAddToBlacklist = () => {
    Alert.alert(
      '加入黑名單',
      '確定要將此餐廳加入黑名單嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確定',
          onPress: () => {
            onAddToBlacklist(restaurant);
            onClose();
          },
        },
      ]
    );
  };

  const handleSpinAgain = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 餐廳圖片 */}
            <Image source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/400x200' }} style={styles.restaurantImage} />
            
            {/* 餐廳資訊 */}
            <View style={styles.infoContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>⭐ {restaurant.rating}</Text>
                <Text style={styles.infoLabel}>{'💰'.repeat(restaurant.priceLevel)}</Text>
                {restaurant.distance && (
                  <Text style={styles.infoLabel}>
                    📍 {restaurant.distance < 1000 ? `${restaurant.distance}公尺` : `${(restaurant.distance / 1000).toFixed(1)}公里`}
                  </Text>
                )}
              </View>

              <Text style={styles.cuisineType}>{restaurant.cuisineType}</Text>
              <Text style={styles.address}>{restaurant.address}</Text>
              
              {/* 營業時間 */}
              <View style={styles.hoursContainer}>
                <Text style={styles.hoursLabel}>營業時間</Text>
                <Text style={styles.hoursText}>11:00 - 21:00</Text>
              </View>
            </View>

            {/* 主要行動按鈕 */}
            <View style={styles.actionButtons}>
              <Button
                title="🗺️ 導航前往"
                variant="primary"
                onPress={handleNavigation}
                containerStyle={styles.mainButton}
              />
              <Button
                title="📞 撥打電話"
                variant="primary"
                onPress={handleCall}
                containerStyle={styles.mainButton}
              />
            </View>

            {/* 次要行動按鈕 */}
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAddToFavorites}
              >
                <Text style={styles.secondaryButtonText}>
                  {isFavorite ? '❤️ 已收藏' : '🤍 加入收藏'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleShare}
              >
                <Text style={styles.secondaryButtonText}>📤 分享給朋友</Text>
              </TouchableOpacity>
            </View>

            {/* 底部按鈕 */}
            <View style={styles.bottomActions}>
              <Button
                title="不想吃這家"
                variant="outline"
                onPress={handleAddToBlacklist}
                containerStyle={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="再轉一次"
                variant="secondary"
                onPress={handleSpinAgain}
                containerStyle={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
    ...shadows.large,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  infoContainer: {
    padding: theme.spacing.lg,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  cuisineType: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  address: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  hoursContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  hoursLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  hoursText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  mainButton: {
    flex: 1,
  },
  secondaryActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
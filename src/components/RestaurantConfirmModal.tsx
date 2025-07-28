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
import { Heart, Dices, Ban, Share2, X } from 'lucide-react-native';
import { Restaurant } from '../types';
import { theme } from '../constants/theme';
import Button from './Button';
import { shadows } from '../constants/shadows';

interface RestaurantConfirmModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onToggleFavorite: () => void;
  onToggleWheelList: () => void;
  onToggleBlacklist: () => void;
  isFavorite: boolean;
  isInWheelList: boolean;
  isBlacklisted: boolean;
}

export const RestaurantConfirmModal: React.FC<RestaurantConfirmModalProps> = ({
  visible,
  restaurant,
  onClose,
  onToggleFavorite,
  onToggleWheelList,
  onToggleBlacklist,
  isFavorite,
  isInWheelList,
  isBlacklisted,
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

  const handleToggleBlacklist = () => {
    if (!isBlacklisted) {
      Alert.alert(
        '加入黑名單',
        '確定要將此餐廳加入黑名單嗎？\n黑名單中的餐廳不會出現在轉盤中。',
        [
          { text: '取消', style: 'cancel' },
          { text: '確定', onPress: onToggleBlacklist },
        ]
      );
    } else {
      onToggleBlacklist();
    }
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
          {/* 關閉按鈕 */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 餐廳圖片 */}
            <Image source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/400x200' }} style={styles.restaurantImage} />
            
            {/* 餐廳資訊 */}
            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                
                {/* 圖標按鈕組 */}
                <View style={styles.iconButtons}>
                  <TouchableOpacity onPress={onToggleFavorite} style={styles.iconButton}>
                    <Heart 
                      size={22} 
                      color={isFavorite ? theme.colors.error : theme.colors.text.light}
                      fill={isFavorite ? theme.colors.error : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onToggleWheelList} style={styles.iconButton}>
                    <Dices 
                      size={22} 
                      color={isInWheelList ? theme.colors.primary : theme.colors.text.light}
                      fill={isInWheelList ? theme.colors.primary : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleToggleBlacklist} style={styles.iconButton}>
                    <Ban 
                      size={22} 
                      color={isBlacklisted ? theme.colors.error : theme.colors.text.light}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                    <Share2 
                      size={22} 
                      color={theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
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
                size="large"
                onPress={handleNavigation}
                containerStyle={styles.mainButton}
              />
              <Button
                title="📞 撥打電話"
                variant="primary"
                size="large"
                onPress={handleCall}
                containerStyle={styles.mainButton}
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
    position: 'relative',
    ...shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    ...shadows.light,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  iconButton: {
    padding: theme.spacing.xs,
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
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  mainButton: {
    flex: 1,
  },
});
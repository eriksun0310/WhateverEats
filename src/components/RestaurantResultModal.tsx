import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';
import { PartyPopper, X, MapPin, Dices } from 'lucide-react-native';
import { DualButtonGroup } from './DualButtonGroup';
import { RestaurantInfo } from './RestaurantInfo';

interface RestaurantResultModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onRespin: () => void;
  onToggleFavorite?: () => void;
}

export default function RestaurantResultModal({
  visible,
  restaurant,
  onClose,
  onRespin,
  onToggleFavorite,
}: RestaurantResultModalProps) {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 標題區 */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <PartyPopper size={24} color={theme.colors.primary} />
                <Text style={styles.title}>為您推薦</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* 餐廳資訊 - 使用 RestaurantInfo 而非完整的 Card */}
            <View style={styles.restaurantInfoWrapper}>
              <RestaurantInfo
                restaurant={restaurant}
                showImage={true}
                showActions={true}
                isFavorite={restaurant.isFavorite}
                onToggleFavorite={onToggleFavorite}
                variant="modal"
                imageHeight={180}
              />
            </View>

           
    

            {/* 按鈕區 */}
            <View style={styles.buttonContainer}>
              <DualButtonGroup
                leftButton={{
                  title: '重新轉一次',
                  onPress: onRespin,
                  variant: 'outline',
                  icon: <Dices size={20} color={theme.colors.primary} />,
                }}
                rightButton={{
                  title: '就吃這家！',
                  onPress: onClose,
                  variant: 'primary',
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  restaurantInfoWrapper: {
    overflow: 'hidden',
  },
  buttonContainer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
  },
});
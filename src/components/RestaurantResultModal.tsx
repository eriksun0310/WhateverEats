import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';

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

  const renderPriceLevel = () => {
    return '$'.repeat(restaurant.priceLevel);
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
              <Text style={styles.title}>🎉 為您推薦</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 餐廳圖片 */}
            <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />

            {/* 餐廳資訊 */}
            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                {onToggleFavorite && (
                  <TouchableOpacity onPress={onToggleFavorite}>
                    <Text style={styles.favoriteIcon}>
                      {restaurant.isFavorite ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>類型</Text>
                  <Text style={styles.value}>{restaurant.cuisineType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>價位</Text>
                  <Text style={[styles.value, styles.price]}>
                    {renderPriceLevel()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>評分</Text>
                  <Text style={styles.value}>⭐ {restaurant.rating}</Text>
                </View>
                {restaurant.distance && (
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>距離</Text>
                    <Text style={styles.value}>
                      {restaurant.distance < 1000
                        ? `${restaurant.distance}m`
                        : `${(restaurant.distance / 1000).toFixed(1)}km`}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>📍 地址</Text>
                <Text style={styles.address}>{restaurant.address}</Text>
              </View>
            </View>

            {/* 按鈕區 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.respinButton} onPress={onRespin}>
                <Text style={styles.respinButtonText}>🎰 重新轉一次</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
                <Text style={styles.confirmButtonText}>就吃這家！</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeText: {
    fontSize: 24,
    color: theme.colors.text.secondary,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.border,
  },
  infoContainer: {
    padding: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 28,
    marginLeft: theme.spacing.sm,
  },
  detailsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  price: {
    color: theme.colors.primary,
  },
  addressContainer: {
    marginBottom: theme.spacing.md,
  },
  addressLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  address: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  respinButton: {
    flex: 1,
    backgroundColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  respinButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: theme.colors.surface,
    fontWeight: '600',
  },
});
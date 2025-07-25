import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleFavorite, toggleBlacklist } from '../store/slices/restaurantSlice';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';
import { Heart, Ban, Star, Share2 } from 'lucide-react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
  showActions?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, showActions = true }: RestaurantCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, blacklist } = useSelector((state: RootState) => state.restaurant);
  const user = useSelector((state: RootState) => state.user);
  
  const isFavorite = favorites.includes(restaurant.id);
  const isBlacklisted = blacklist.includes(restaurant.id);

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(restaurant.id));
  };

  const handleToggleBlacklist = (e: any) => {
    e.stopPropagation();
    dispatch(toggleBlacklist(restaurant.id));
  };

  const handleShare = (e: any) => {
    e.stopPropagation();
    
    const userName = user.name || '朋友';
    const shareText = `${userName} 推薦你這家餐廳！

🍽️ ${restaurant.name}
📍 ${restaurant.address}
⭐ 評分：${restaurant.rating}
💰 價位：${'$'.repeat(restaurant.priceLevel)}

來自「隨便吃！」App 的推薦`;

    Alert.alert(
      '分享餐廳',
      shareText,
      [
        { text: '關閉', style: 'cancel' },
        { text: '複製文字', onPress: () => {
          Alert.alert('提示', '請手動複製上方文字分享給朋友');
        }},
      ]
    );
  };

  const renderPriceLevel = () => {
    return '$'.repeat(restaurant.priceLevel);
  };

  const renderDistance = () => {
    if (!restaurant.distance) return null;
    if (restaurant.distance < 1000) {
      return `${restaurant.distance}m`;
    }
    return `${(restaurant.distance / 1000).toFixed(1)}km`;
  };

  const CardContent = (
    <>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          {showActions && (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
                <Heart 
                  size={24} 
                  color={isFavorite ? theme.colors.error : theme.colors.text.light}
                  fill={isFavorite ? theme.colors.error : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToggleBlacklist} style={styles.actionButton}>
                <Ban 
                  size={24} 
                  color={isBlacklisted ? theme.colors.error : theme.colors.text.light}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                <Share2 
                  size={24} 
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
          <Text style={styles.price}>{renderPriceLevel()}</Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.rating}>
            <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          {renderDistance() && (
            <Text style={styles.distance}>{renderDistance()}</Text>
          )}
        </View>
      </View>
      {isBlacklisted && (
        <View style={styles.blacklistOverlay}>
          <Ban size={32} color={theme.colors.surface} style={{ marginBottom: 8 }} />
          <Text style={styles.blacklistText}>已加入黑名單</Text>
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{CardContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.border,
  },
  infoContainer: {
    padding: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  blacklistOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'column',
  },
  blacklistText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  cuisine: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  price: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Dices, Ban, Share2, Star, MapPin, Clock } from 'lucide-react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';
import { shadows } from '../constants/shadows';

interface RestaurantDetailCardProps {
  restaurant: Restaurant;
  onToggleFavorite?: () => void;
  onToggleWheelList?: () => void;
  onToggleBlacklist?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
  isInWheelList?: boolean;
  isBlacklisted?: boolean;
}

export const RestaurantDetailCard: React.FC<RestaurantDetailCardProps> = ({
  restaurant,
  onToggleFavorite,
  onToggleWheelList,
  onToggleBlacklist,
  onShare,
  isFavorite = false,
  isInWheelList = false,
  isBlacklisted = false,
}) => {
  const renderPriceLevel = () => '$'.repeat(restaurant.priceLevel);
  
  const renderDistance = () => {
    if (!restaurant.distance) return null;
    return restaurant.distance < 1000 
      ? `${restaurant.distance}m` 
      : `${(restaurant.distance / 1000).toFixed(1)}km`;
  };

  return (
    <View style={styles.container}>
      {/* 餐廳圖片 */}
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      
      {/* 餐廳基本資訊 */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.actionButtons}>
            {onToggleFavorite && (
              <TouchableOpacity onPress={onToggleFavorite} style={styles.actionButton}>
                <Heart 
                  size={24} 
                  color={isFavorite ? theme.colors.error : theme.colors.text.light}
                  fill={isFavorite ? theme.colors.error : 'transparent'}
                />
              </TouchableOpacity>
            )}
            {onToggleWheelList && (
              <TouchableOpacity onPress={onToggleWheelList} style={styles.actionButton}>
                <Dices 
                  size={24} 
                  color={isInWheelList ? theme.colors.primary : theme.colors.text.light}
                  fill={isInWheelList ? theme.colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            )}
            {onToggleBlacklist && (
              <TouchableOpacity onPress={onToggleBlacklist} style={styles.actionButton}>
                <Ban 
                  size={24} 
                  color={isBlacklisted ? theme.colors.error : theme.colors.text.light}
                />
              </TouchableOpacity>
            )}
            {onShare && (
              <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                <Share2 
                  size={24} 
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
        
        {/* 評分、價位、距離 */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
            <Text style={styles.metricText}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.metricSeparator}>•</Text>
          <Text style={styles.metricText}>{renderPriceLevel()}</Text>
          {renderDistance() && (
            <>
              <Text style={styles.metricSeparator}>•</Text>
              <Text style={styles.metricText}>{renderDistance()}</Text>
            </>
          )}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.border,
  },
  infoSection: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  cuisine: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  metricSeparator: {
    fontSize: 14,
    color: theme.colors.text.light,
    marginHorizontal: theme.spacing.sm,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Linking, Alert } from 'react-native';
import { Heart, Dices, Ban, Share2, Star } from 'lucide-react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';
import { RestaurantModalInfo } from './RestaurantModalInfo';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  showImage?: boolean;
  showActions?: boolean;
  isFavorite?: boolean;
  isInWheelList?: boolean;
  isBlacklisted?: boolean;
  onToggleFavorite?: () => void;
  onToggleWheelList?: () => void;
  onToggleBlacklist?: () => void;
  onShare?: () => void;
  variant?: 'card' | 'modal';
  imageHeight?: number;
}

export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  showImage = true,
  showActions = true,
  isFavorite = false,
  isInWheelList = false,
  isBlacklisted = false,
  onToggleFavorite,
  onToggleWheelList,
  onToggleBlacklist,
  onShare,
  variant = 'card',
  imageHeight = 150,
}) => {
  const renderPriceLevel = () => '$'.repeat(restaurant.priceLevel);
  
  const renderDistance = () => {
    if (!restaurant.distance) return null;
    return restaurant.distance < 1000 
      ? `${restaurant.distance}m` 
      : `${(restaurant.distance / 1000).toFixed(1)}km`;
  };
  
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
    <>
      {showImage && (
        <Image source={{ uri: restaurant.imageUrl }} style={[styles.image, { height: imageHeight }]} />
      )}
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          {showActions && (
            <View style={styles.actionButtons}>
              {onToggleFavorite && (
                <TouchableOpacity onPress={onToggleFavorite} style={styles.actionButton}>
                  <Heart 
                    size={22} 
                    color={isFavorite ? theme.colors.error : theme.colors.text.light}
                    fill={isFavorite ? theme.colors.error : 'transparent'}
                  />
                </TouchableOpacity>
              )}
              {onToggleWheelList && (
                <TouchableOpacity onPress={onToggleWheelList} style={styles.actionButton}>
                  <Dices 
                    size={22} 
                    color={isInWheelList ? theme.colors.primary : theme.colors.text.light}
                    fill={isInWheelList ? theme.colors.primary : 'transparent'}
                  />
                </TouchableOpacity>
              )}
              {onToggleBlacklist && (
                <TouchableOpacity onPress={onToggleBlacklist} style={styles.actionButton}>
                  <Ban 
                    size={22} 
                    color={isBlacklisted ? theme.colors.error : theme.colors.text.light}
                  />
                </TouchableOpacity>
              )}
              {onShare && (
                <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                  <Share2 
                    size={22} 
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              )}
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
          <RestaurantModalInfo 
            restaurant={restaurant}
            onAddressPress={handleNavigation}
          />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.border,
  },
  infoContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
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
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export default function RestaurantCard({ restaurant, onPress, onToggleFavorite }: RestaurantCardProps) {
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          {onToggleFavorite && (
            <TouchableOpacity onPress={onToggleFavorite}>
              <Text style={{ fontSize: 24 }}>
                {restaurant.isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
          <Text style={styles.price}>{renderPriceLevel()}</Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.rating}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          {renderDistance() && (
            <Text style={styles.distance}>{renderDistance()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
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
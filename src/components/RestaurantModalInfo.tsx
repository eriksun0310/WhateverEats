import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { Restaurant } from '../types/restaurant';
import { theme } from '../constants/theme';

interface RestaurantModalInfoProps {
  restaurant: Restaurant;
  onAddressPress?: () => void;
}

export const RestaurantModalInfo: React.FC<RestaurantModalInfoProps> = ({
  restaurant,
  onAddressPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 地址資訊 */}
      <TouchableOpacity 
        style={[styles.infoRow, onAddressPress && styles.clickableRow]}
        onPress={onAddressPress}
        activeOpacity={onAddressPress ? 0.7 : 1}
        disabled={!onAddressPress}
      >
        <MapPin size={20} color={theme.colors.text.secondary} />
        <Text style={[styles.infoText, onAddressPress && styles.clickableText]}>
          {restaurant.address}
        </Text>
      </TouchableOpacity>

      {/* 營業時間 */}
      <View style={styles.infoRow}>
        <Clock size={20} color={theme.colors.text.secondary} />
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursLabel}>營業時間</Text>
          <Text style={styles.infoText}>11:00 - 21:00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  hoursContainer: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  clickableRow: {
    paddingVertical: 4,
    marginVertical: -4,
  },
  clickableText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
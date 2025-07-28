import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

interface ActiveFiltersProps {
  selectedDistance: number | null;
  selectedCuisineTypes: string[];
  activeFiltersCount?: number;
  onPress?: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedDistance,
  selectedCuisineTypes,
  activeFiltersCount,
  onPress
}) => {
  const showFilters = activeFiltersCount !== undefined 
    ? activeFiltersCount > 0 
    : (selectedCuisineTypes.length > 0 || selectedDistance !== null);

  if (!showFilters) return null;

  return (
    <View style={styles.activeFiltersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.activeFiltersWrapper}>
          {selectedDistance && (
            <TouchableOpacity onPress={onPress} style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                {selectedDistance < 1000 ? `${selectedDistance}公尺內` : `${selectedDistance / 1000}公里內`}
              </Text>
            </TouchableOpacity>
          )}
          {selectedCuisineTypes.map((cuisineType) => (
            <TouchableOpacity key={cuisineType} onPress={onPress} style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{cuisineType}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  activeFiltersContainer: {
    // backgroundColor: theme.colors.surface,
    paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.border,
  },
  activeFiltersWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeFilterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
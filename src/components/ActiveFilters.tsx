import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { FilterButton } from './FilterButton';

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.activeFiltersWrapper}>
          {selectedDistance && (
            <FilterButton
              label={selectedDistance < 1000 ? `${selectedDistance}公尺內` : `${selectedDistance / 1000}公里內`}
              isActive={true}
              onPress={onPress || (() => {})}
              style={styles.filterButtonStyle}
              textStyle={styles.filterTextStyle}
            />
          )}
          {selectedCuisineTypes.map((cuisineType) => (
            <FilterButton
              key={cuisineType}
              label={cuisineType}
              isActive={true}
              onPress={onPress || (() => {})}
              style={styles.filterButtonStyle}
              textStyle={styles.filterTextStyle}
            />
          ))}
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({

  activeFiltersWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  filterButtonStyle: {
    // 使用預設樣式
  },
  filterTextStyle: {
    // 使用預設樣式
  },
});
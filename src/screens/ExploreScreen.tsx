import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import FilterBottomSheet from '../shared/ui/FilterBottomSheet';
import { ActiveFilters } from '../components/ActiveFilters';
import { SearchBar } from '../components/SearchBar';

export default function ExploreScreen() {
  const { restaurants, blacklist } = useSelector(
    (state: RootState) => state.restaurant
  );

  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  
  // 取得所有料理類型 - 確保資料有效
  const allCuisineTypes = restaurants.length > 0 
    ? [...new Set(restaurants.map(r => r.cuisineType).filter(Boolean))]
    : ['台式料理', '日式料理', '小吃', '創意料理']; // 預設值

  // 篩選餐廳資料
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // 排除黑名單
      if (blacklist.includes(restaurant.id)) return false;

      // 搜尋篩選
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        if (
          !restaurant.name.toLowerCase().includes(searchLower) &&
          !restaurant.address.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // 料理類型篩選
      const matchesCuisine = selectedCuisineTypes.length === 0 || 
        selectedCuisineTypes.includes(restaurant.cuisineType);

      // 距離篩選
      const matchesDistance = selectedDistance === null || 
        (restaurant.distance && restaurant.distance <= selectedDistance);

      return matchesCuisine && matchesDistance;
    });
  }, [restaurants, blacklist, searchText, selectedCuisineTypes, selectedDistance]);

  // 切換料理類型篩選
  const toggleCuisineType = (cuisineType: string) => {
    setSelectedCuisineTypes(prev => {
      if (prev.includes(cuisineType)) {
        return prev.filter(type => type !== cuisineType);
      }
      return [...prev, cuisineType];
    });
  };

  const clearFilters = () => {
    setSelectedCuisineTypes([]);
    setSelectedDistance(null);
  };

  const activeFiltersCount = selectedCuisineTypes.length + (selectedDistance !== null ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="搜尋餐廳名稱"
          onFilterPress={() => setShowFilters(true)}
          filterCount={activeFiltersCount}
          containerStyle={styles.searchContainer}
        />
      </View>

      {/* 篩選條件顯示 */}
      <ActiveFilters
        selectedDistance={selectedDistance}
        selectedCuisineTypes={selectedCuisineTypes}
        activeFiltersCount={activeFiltersCount}
        onPress={() => setShowFilters(true)}
      />

      <FilterBottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        cuisineTypes={allCuisineTypes}
        selectedCuisineTypes={selectedCuisineTypes}
        selectedDistance={selectedDistance}
        onCuisineTypeToggle={toggleCuisineType}
        onDistanceSelect={setSelectedDistance}
        onClear={clearFilters}
        onApply={() => setShowFilters(false)}
      />

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>沒有找到符合條件的餐廳</Text>
            <Text style={styles.emptySubtext}>試試調整篩選條件吧！</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.sm,
    // backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    // padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.light,
  },
});
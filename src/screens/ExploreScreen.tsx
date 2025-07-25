import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setFilters } from '../store/slices/restaurantSlice';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant, CuisineType, PriceLevel } from '../types/restaurant';
import { Search, Filter } from 'lucide-react-native';

export default function ExploreScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants, filters, blacklist } = useSelector(
    (state: RootState) => state.restaurant
  );

  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisineType, setSelectedCuisineType] = useState<CuisineType | null>(null);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<PriceLevel | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

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
      if (selectedCuisineType && restaurant.cuisineType !== selectedCuisineType) {
        return false;
      }

      // 價位篩選
      if (selectedPriceLevel && restaurant.priceLevel !== selectedPriceLevel) {
        return false;
      }

      // 距離篩選
      if (selectedDistance && restaurant.distance && restaurant.distance > selectedDistance) {
        return false;
      }

      return true;
    });
  }, [restaurants, blacklist, searchText, selectedCuisineType, selectedPriceLevel, selectedDistance]);

  const cuisineTypes = [
    { value: null, label: '全部' },
    { value: '台式', label: '台式' },
    { value: '日式', label: '日式' },
    { value: '韓式', label: '韓式' },
    { value: '美式', label: '美式' },
    { value: '義式', label: '義式' },
    { value: '泰式', label: '泰式' },
    { value: '其他', label: '其他' },
  ];

  const priceLevels = [
    { value: null, label: '全部' },
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' },
  ];

  const distances = [
    { value: null, label: '全部' },
    { value: 500, label: '500m' },
    { value: 1000, label: '1km' },
    { value: 3000, label: '3km' },
    { value: 5000, label: '5km' },
  ];

  const clearFilters = () => {
    setSelectedCuisineType(null);
    setSelectedPriceLevel(null);
    setSelectedDistance(null);
    setSearchText('');
  };

  const activeFiltersCount = [
    selectedCuisineType,
    selectedPriceLevel,
    selectedDistance,
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>探索餐廳</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋區域或餐廳..."
            placeholderTextColor={theme.colors.text.light}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filterButtonContent}>
              <Filter size={20} color={theme.colors.text.primary} />
              <Text style={styles.filterButtonText}>
                篩選
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* 料理類型篩選 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>料理類型</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {cuisineTypes.map((type) => (
                  <TouchableOpacity
                    key={type.label}
                    style={[
                      styles.filterChip,
                      selectedCuisineType === type.value && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedCuisineType(type.value as CuisineType | null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCuisineType === type.value && styles.filterChipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 價位篩選 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>價位</Text>
            <View style={styles.filterOptions}>
              {priceLevels.map((level) => (
                <TouchableOpacity
                  key={level.label}
                  style={[
                    styles.filterChip,
                    selectedPriceLevel === level.value && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedPriceLevel(level.value as PriceLevel | null)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedPriceLevel === level.value && styles.filterChipTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 距離篩選 */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>距離</Text>
            <View style={styles.filterOptions}>
              {distances.map((dist) => (
                <TouchableOpacity
                  key={dist.label}
                  style={[
                    styles.filterChip,
                    selectedDistance === dist.value && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedDistance(dist.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedDistance === dist.value && styles.filterChipTextActive,
                    ]}
                  >
                    {dist.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {activeFiltersCount > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>清除篩選</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😅 沒有找到符合條件的餐廳</Text>
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
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  filterButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  filterChipTextActive: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  clearButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
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
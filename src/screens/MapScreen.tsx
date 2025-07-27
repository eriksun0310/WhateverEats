import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import FilterBottomSheet from '../shared/ui/FilterBottomSheet';
import { Restaurant } from '../types/restaurant';
import { Utensils, Navigation, Search, Filter, X } from 'lucide-react-native';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// 預設位置（台北市）
const DEFAULT_REGION = {
  latitude: 25.033964,
  longitude: 121.564472,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const { restaurants, blacklist } = useSelector(
    (state: RootState) => state.restaurant
  );
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<MapView>(null);

  // 過濾掉黑名單的餐廳
  const availableRestaurants = restaurants.filter(
    restaurant => !blacklist.includes(restaurant.id)
  );

  // 取得所有料理類型 - 確保資料有效
  const allCuisineTypes = restaurants.length > 0 
    ? [...new Set(restaurants.map(r => r.cuisineType).filter(Boolean))]
    : ['台式料理', '日式料理', '小吃', '創意料理']; // 預設值

  // 篩選功能
  const filteredRestaurants = availableRestaurants.filter(restaurant => {
    // 搜尋篩選
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 料理類型篩選
    const matchesCuisine = selectedCuisineTypes.length === 0 || 
      selectedCuisineTypes.includes(restaurant.cuisineType);
    
    // 距離篩選
    const matchesDistance = selectedDistance === null || 
      (restaurant.distance && restaurant.distance <= selectedDistance);
    
    return matchesSearch && matchesCuisine && matchesDistance;
  });

  const selectedRestaurantData = availableRestaurants.find(
    r => r.id === selectedRestaurant
  );

  // 處理標記點擊
  const handleMarkerPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant.id);
    
    // 將地圖移動到選中的餐廳
    if (mapRef.current && restaurant.latitude && restaurant.longitude) {
      mapRef.current.animateToRegion({
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // 取得目前位置（需要位置權限）
  const getCurrentLocation = async () => {
    try {
      // 請求位置權限
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '位置權限',
          '需要位置權限才能使用定位功能',
          [{ text: '了解' }]
        );
        return;
      }

      // 取得當前位置
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 移動地圖到當前位置
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      Alert.alert('錯誤', '無法取得當前位置');
    }
  };

  // 搜尋餐廳並跳轉
  const handleSearchResultPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant.id);
    setShowSearchResults(false);
    setSearchQuery('');
    
    // 將地圖移動到選中的餐廳
    if (mapRef.current && restaurant.latitude && restaurant.longitude) {
      mapRef.current.animateToRegion({
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // 切換料理類型篩選
  const toggleCuisineType = (cuisineType: string) => {
    setSelectedCuisineTypes(prev => {
      if (prev.includes(cuisineType)) {
        return prev.filter(type => type !== cuisineType);
      }
      return [...prev, cuisineType];
    });
  };

  return (
    <View style={styles.container}>
      {/* 地圖 */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredRestaurants.map((restaurant) => {
          // 確保餐廳有座標
          if (!restaurant.latitude || !restaurant.longitude) return null;
          
          return (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`${restaurant.cuisineType} · ${restaurant.rating}`}
              onPress={() => handleMarkerPress(restaurant)}
            >
              <View style={styles.markerContainer}>
                <Utensils size={20} color={theme.colors.surface} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* 地圖控制按鈕 */}
      <View style={[styles.mapControls, { bottom: selectedRestaurantData ? 320 : 100 }]}>
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Navigation size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* 搜尋和篩選欄 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋餐廳名稱"
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSearchResults(text.length > 0);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearchResults(false);
            }}>
              <X size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={theme.colors.surface} />
          {(selectedCuisineTypes.length > 0 || selectedDistance !== null) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {selectedCuisineTypes.length + (selectedDistance !== null ? 1 : 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 搜尋結果列表 */}
      {showSearchResults && searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => handleSearchResultPress(item)}
              >
                <Text style={styles.searchResultName}>{item.name}</Text>
                <Text style={styles.searchResultInfo}>
                  {item.cuisineType} · {item.rating} 分
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>沒有找到相關餐廳</Text>
            }
          />
        </View>
      )}

      {/* 篩選條件顯示 */}
      {(selectedCuisineTypes.length > 0 || selectedDistance !== null) && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFiltersWrapper}>
              {selectedDistance && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>
                    {selectedDistance < 1000 ? `${selectedDistance}公尺內` : `${selectedDistance / 1000}公里內`}
                  </Text>
                </View>
              )}
              {selectedCuisineTypes.map((cuisineType) => (
                <View key={cuisineType} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>{cuisineType}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* 頂部資訊欄 */}
      <View style={[styles.topInfo, { top: (selectedCuisineTypes.length > 0 || selectedDistance !== null) ? 170 : 120 }]}>
        <Text style={styles.infoText}>
          顯示 {filteredRestaurants.length} 家餐廳
        </Text>
      </View>

      {/* 選中的餐廳資訊 */}
      {selectedRestaurantData && (
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>餐廳詳情</Text>
            <TouchableOpacity onPress={() => setSelectedRestaurant(null)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <RestaurantCard restaurant={selectedRestaurantData} />
          </ScrollView>
        </View>
      )}

      {/* 篩選 Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        cuisineTypes={allCuisineTypes}
        selectedCuisineTypes={selectedCuisineTypes}
        selectedDistance={selectedDistance}
        onCuisineTypeToggle={toggleCuisineType}
        onDistanceSelect={setSelectedDistance}
        onClear={() => {
          setSelectedCuisineTypes([]);
          setSelectedDistance(null);
        }}
        onApply={() => setShowFilterModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 20,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
  },
  locationButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 24,
  },
  topInfo: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  infoText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  detailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    maxHeight: height * 0.4,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    padding: theme.spacing.xs,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    width: 45,
    height: 45,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 115,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  searchResultItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  searchResultInfo: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  noResultsText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  activeFiltersContainer: {
    position: 'absolute',
    top: 115,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    zIndex: 10,
  },
  activeFiltersWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  activeFilterText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
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
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import FilterBottomSheet from '../shared/ui/FilterBottomSheet';
import { Restaurant } from '../types/restaurant';
import { Utensils, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { ActiveFilters } from '../components/ActiveFilters';
import { SearchBar } from '../components/SearchBar';
import { shadows } from '../constants/shadows';

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 地圖 */}
        <MapView
          ref={mapRef}
          style={styles.map}
          onPress={() => {
            Keyboard.dismiss();
            setShowSearchResults(false);
          }}
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
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Navigation size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* 搜尋和篩選欄 */}
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowSearchResults(text.length > 0);
        }}
        placeholder="搜尋餐廳名稱"
        onFilterPress={() => setShowFilterModal(true)}
        filterCount={selectedCuisineTypes.length + (selectedDistance !== null ? 1 : 0)}
        onClear={() => setShowSearchResults(false)}
        containerStyle={styles.searchContainer}
      />

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
      <View style={styles.activeFiltersPositioner}>
        <ActiveFilters
          selectedDistance={selectedDistance}
          selectedCuisineTypes={selectedCuisineTypes}
          onPress={() => setShowFilterModal(true)}
        />
      </View>

      {/* 頂部資訊欄 */}
      <View style={[styles.topInfo, { top: (selectedCuisineTypes.length > 0 || selectedDistance !== null) ? 120 : 70 }]}>
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
    </TouchableWithoutFeedback>
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
    ...shadows.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 20,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  locationButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  locationButtonText: {
    fontSize: 24,
  },
  topInfo: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...shadows.light,
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
    ...shadows.top,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.border,
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
    top: 10,
    left: 20,
    right: 20,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 65,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxHeight: 200,
    ...shadows.light,
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
  activeFiltersPositioner: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
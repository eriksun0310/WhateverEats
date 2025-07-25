import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant } from '../types/restaurant';
import { Utensils, Navigation, Star, Search, Filter, X } from 'lucide-react-native';
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<MapView>(null);

  // 過濾掉黑名單的餐廳
  const availableRestaurants = restaurants.filter(
    restaurant => !blacklist.includes(restaurant.id)
  );

  // 取得所有料理類型
  const allCuisineTypes = [...new Set(restaurants.map(r => r.cuisineType))];

  // 篩選功能
  const filteredRestaurants = availableRestaurants.filter(restaurant => {
    // 搜尋篩選
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 料理類型篩選
    const matchesCuisine = selectedCuisineTypes.length === 0 || 
      selectedCuisineTypes.includes(restaurant.cuisineType);
    
    return matchesSearch && matchesCuisine;
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
          {selectedCuisineTypes.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedCuisineTypes.length}</Text>
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
                  {item.cuisineType} · ⭐ {item.rating}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>沒有找到相關餐廳</Text>
            }
          />
        </View>
      )}

      {/* 頂部資訊欄 */}
      <View style={[styles.topInfo, { top: 120 }]}>
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
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <RestaurantCard restaurant={selectedRestaurantData} />
          </ScrollView>
        </View>
      )}

      {/* 篩選 Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>篩選料理類型</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {allCuisineTypes.map((cuisineType) => (
                <TouchableOpacity
                  key={cuisineType}
                  style={styles.cuisineTypeItem}
                  onPress={() => toggleCuisineType(cuisineType)}
                >
                  <Text style={styles.cuisineTypeText}>{cuisineType}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedCuisineTypes.includes(cuisineType) && styles.checkboxSelected
                  ]}>
                    {selectedCuisineTypes.includes(cuisineType) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedCuisineTypes([])}
              >
                <Text style={styles.clearButtonText}>清除全部</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>套用</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  cuisineTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  cuisineTypeText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});
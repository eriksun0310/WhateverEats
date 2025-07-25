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
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../constants/theme';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant } from '../types/restaurant';
import { Utensils, Navigation, Star } from 'lucide-react-native';

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
  const mapRef = useRef<MapView>(null);

  // 過濾掉黑名單的餐廳
  const availableRestaurants = restaurants.filter(
    restaurant => !blacklist.includes(restaurant.id)
  );

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
  const getCurrentLocation = () => {
    Alert.alert(
      '定位功能',
      '定位功能需要位置權限，請在設定中開啟',
      [{ text: '了解' }]
    );
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
        {availableRestaurants.map((restaurant) => {
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

      {/* 頂部資訊欄 */}
      <View style={styles.topInfo}>
        <Text style={styles.infoText}>
          顯示 {availableRestaurants.length} 家餐廳
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
});
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant, FilterOptions } from '../../types/restaurant';
import { mockRestaurants } from '../../constants/mockData';

interface RestaurantState {
  restaurants: Restaurant[];
  favorites: string[];
  blacklist: string[];
  filters: FilterOptions;
  loading: boolean;
}

const initialState: RestaurantState = {
  restaurants: mockRestaurants,
  favorites: ['1', '4'], // Mock favorite IDs
  blacklist: [],
  filters: {
    cuisineTypes: [],
    maxDistance: 5000, // 5km
    priceRange: { min: 1, max: 4 },
    searchQuery: '',
  },
  loading: false,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const restaurantId = action.payload;
      if (state.favorites.includes(restaurantId)) {
        state.favorites = state.favorites.filter(id => id !== restaurantId);
      } else {
        state.favorites.push(restaurantId);
      }
    },
    toggleBlacklist: (state, action: PayloadAction<string>) => {
      const restaurantId = action.payload;
      if (state.blacklist.includes(restaurantId)) {
        state.blacklist = state.blacklist.filter(id => id !== restaurantId);
      } else {
        state.blacklist.push(restaurantId);
      }
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleFavorite, toggleBlacklist, updateFilters, setLoading } = restaurantSlice.actions;
export default restaurantSlice.reducer;
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4; // 1: $, 2: $$, 3: $$$, 4: $$$$
  cuisineType: string;
  distance?: number; // in meters
  imageUrl?: string;
  isBlacklisted: boolean;
  isFavorite: boolean;
}

export interface FilterOptions {
  cuisineTypes: string[];
  maxDistance: number; // in meters
  priceRange: {
    min: number;
    max: number;
  };
  searchQuery: string;
}
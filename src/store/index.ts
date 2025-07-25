import { configureStore } from '@reduxjs/toolkit';
import restaurantReducer from './slices/restaurantSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
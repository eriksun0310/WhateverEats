import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, FriendRecommendation } from '../../types/user';

interface UserState {
  currentUser: User | null;
  friendRecommendations: FriendRecommendation[];
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  friendRecommendations: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.friendRecommendations = [];
    },
    addFriendRecommendation: (state, action: PayloadAction<FriendRecommendation>) => {
      state.friendRecommendations.push(action.payload);
    },
  },
});

export const { setUser, updateProfile, logout, addFriendRecommendation } = userSlice.actions;
export default userSlice.reducer;
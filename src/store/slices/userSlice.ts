import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FriendRecommendation {
  restaurantId: string;
  fromUser: string;
  date: string;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  avatar: string;
  friendRecommendations: FriendRecommendation[];
}

// 模擬用戶資料
const initialState: UserState = {
  id: '1',
  name: '美食探險家',
  email: 'foodie@example.com',
  avatar: 'man',
  friendRecommendations: [
    {
      restaurantId: '2',
      fromUser: '小明',
      date: '2024-01-15',
    },
    {
      restaurantId: '5',
      fromUser: '小華',
      date: '2024-01-10',
    },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<{ name?: string; avatar?: string }>) => {
      if (action.payload.name) {
        state.name = action.payload.name;
      }
      if (action.payload.avatar) {
        state.avatar = action.payload.avatar;
      }
    },
    logout: (state) => {
      // 重置為初始狀態，但清空 id 表示未登入
      state.id = '';
      state.name = '';
      state.email = '';
      state.avatar = 'man';
      state.friendRecommendations = [];
    },
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    addFriendRecommendation: (state, action: PayloadAction<FriendRecommendation>) => {
      state.friendRecommendations.push(action.payload);
    },
  },
});

export const { updateUserProfile, logout, setUser, addFriendRecommendation } = userSlice.actions;
export default userSlice.reducer;
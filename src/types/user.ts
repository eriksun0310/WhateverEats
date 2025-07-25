export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarId: 'avatar1' | 'avatar2' | 'avatar3';
  createdAt: string;
}

export interface FriendRecommendation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  restaurantId: string;
  recommendedAt: string;
  message?: string;
}
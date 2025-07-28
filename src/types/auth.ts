export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  friendRecommendations: FriendRecommendation[];
}

export interface FriendRecommendation {
  restaurantId: string;
  fromUser: string;
  date: string;
}
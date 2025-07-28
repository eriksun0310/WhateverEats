import MockStorage from './mockStorage';
import { UserData } from '../types/auth';

const USERS_KEY = '@whateverEats:users';
const CURRENT_USER_KEY = '@whateverEats:currentUser';

interface StoredUser extends UserData {
  password: string;
}

export class AuthService {
  // 註冊新使用者
  static async register(userData: UserData & { password: string }): Promise<boolean> {
    try {
      // 獲取所有使用者
      const usersJson = await MockStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
      
      // 檢查是否已存在相同 email
      if (users.find(u => u.email === userData.email)) {
        throw new Error('此電子郵件已被註冊');
      }
      
      // 新增使用者
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        avatar: userData.avatar || 'dog',
        friendRecommendations: [],
      };
      
      users.push(newUser);
      await MockStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // 自動登入
      const { password, ...userWithoutPassword } = newUser;
      await MockStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('註冊失敗:', error);
      throw error;
    }
  }
  
  // 登入
  static async login(email: string, password: string): Promise<UserData | null> {
    try {
      // 獲取所有使用者
      const usersJson = await MockStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
      
      // 尋找符合的使用者
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return null;
      }
      
      // 儲存當前使用者（不含密碼）
      const { password: _, ...userWithoutPassword } = user;
      await MockStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      console.error('登入失敗:', error);
      return null;
    }
  }
  
  // 登出
  static async logout(): Promise<void> {
    try {
      await MockStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }
  
  // 獲取當前使用者
  static async getCurrentUser(): Promise<UserData | null> {
    try {
      const userJson = await MockStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('獲取使用者失敗:', error);
      return null;
    }
  }
  
  // 更新使用者資料
  static async updateUser(updates: Partial<UserData>): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return false;
      
      // 更新所有使用者列表中的資料
      const usersJson = await MockStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await MockStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // 更新當前使用者
      const updatedUser = { ...currentUser, ...updates };
      await MockStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('更新使用者失敗:', error);
      return false;
    }
  }
  
  // 檢查是否已登入
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}
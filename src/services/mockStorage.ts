// 模擬 AsyncStorage 的簡單實現
// 在真實環境中應該使用 @react-native-async-storage/async-storage

class MockStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  // 模擬持久化資料（開發用）
  private mockData = {
    '@whateverEats:users': JSON.stringify([
      {
        id: '1',
        name: '測試用戶',
        email: 'test@example.com',
        password: 'password123',
        avatar: 'dog',
        friendRecommendations: [],
      }
    ]),
  };

  constructor() {
    // 初始化一些測試資料
    Object.entries(this.mockData).forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }
}

export default new MockStorage();
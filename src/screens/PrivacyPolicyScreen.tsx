import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.lastUpdated}>最後更新日期：2025年7月</Text>
        </View>
        
        <View style={styles.contentSection}>
          <Text style={styles.intro}>
            我們重視您的隱私，並致力於保護您提供給我們的個人資料。以下是我們如何蒐集、使用、儲存與保護您的資訊：
          </Text>

          <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 資料蒐集</Text>
          <Text style={styles.paragraph}>
            我們可能會收集以下類型的資訊：
          </Text>
          <Text style={styles.bulletPoint}>• 您在註冊時提供的 Email、暱稱、頭像選擇等資訊</Text>
          <Text style={styles.bulletPoint}>• 您的使用偏好與收藏、黑名單、轉盤結果等操作記錄</Text>
          <Text style={styles.bulletPoint}>• 來自裝置的技術資訊（如定位資料，需使用者授權）</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 資料使用</Text>
          <Text style={styles.paragraph}>我們收集的資料僅用於以下目的：</Text>
          <Text style={styles.bulletPoint}>• 提供與改善 App 功能與使用體驗</Text>
          <Text style={styles.bulletPoint}>• 推薦您更符合偏好的餐廳</Text>
          <Text style={styles.bulletPoint}>• 儲存個人設定與清單資料</Text>
          <Text style={styles.bulletPoint}>• 分析使用情形以優化服務品質</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 資料分享</Text>
          <Text style={styles.paragraph}>
            我們不會出售或提供您的個人資料給第三方
          </Text>
          <Text style={styles.paragraph}>
            如您主動產生推薦連結與朋友分享，該連結中僅包含公開資訊（如店名）
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 資料儲存與安全</Text>
          <Text style={styles.bulletPoint}>• 資料將安全地儲存於伺服器上</Text>
          <Text style={styles.bulletPoint}>• 我們採取技術與管理措施以保障您的資料安全</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. 使用者權利</Text>
          <Text style={styles.paragraph}>您可隨時：</Text>
          <Text style={styles.bulletPoint}>• 編輯或刪除個人資訊</Text>
          <Text style={styles.bulletPoint}>• 移除收藏與黑名單項目</Text>
          <Text style={styles.bulletPoint}>• 停止使用本 App 並要求刪除帳戶資料（未來版本提供）</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            如對隱私政策有任何問題，歡迎聯絡我們：
          </Text>
          <Text style={styles.contactInfo}>support@suibianchi.app</Text>
        </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentSection: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#999',
    marginBottom: 0,
    textAlign: 'center',
  },
  intro: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 26,
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 26,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 26,
    marginLeft: 20,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 15,
    color: '#FF6F3C',
    lineHeight: 26,
    marginLeft: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 50,
  },
});
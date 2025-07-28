import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function TermsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.lastUpdated}>最後更新日期：2025年7月</Text>
          
          <Text style={styles.intro}>
            請於使用本 App（以下簡稱「服務」）前詳閱本條款。使用即表示您同意以下規定：
          </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 使用條件</Text>
          <Text style={styles.bulletPoint}>• 使用本服務需年滿 13 歲或獲得法定監護人同意</Text>
          <Text style={styles.bulletPoint}>• 用戶需提供真實的基本資料註冊帳戶</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 服務內容</Text>
          <Text style={styles.bulletPoint}>• 本服務提供餐廳探索、隨機推薦、清單管理與好友分享等功能</Text>
          <Text style={styles.bulletPoint}>• 我們保留隨時修改或終止功能的權利</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 用戶責任</Text>
          <Text style={styles.bulletPoint}>• 用戶不得以任何方式濫用本服務或進行非法活動</Text>
          <Text style={styles.bulletPoint}>• 不得利用分享功能進行廣告、詐騙或散播不實資訊</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 智慧財產權</Text>
          <Text style={styles.paragraph}>
            App 中所有內容與設計（含圖像、介面、資料結構等）均為我們所有，未經授權不得擅自使用
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. 責任限制</Text>
          <Text style={styles.bulletPoint}>• 我們不保證每次推薦的餐廳均符合用戶滿意度，請自行評估消費風險</Text>
          <Text style={styles.bulletPoint}>• 對於第三方餐廳所提供的內容、品質與行為，我們不負任何法律責任</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.warning}>
            如您不同意上述條款，請停止使用本 App。
          </Text>
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
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  intro: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 26,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
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
  warning: {
    fontSize: 16,
    color: '#FF6F3C',
    lineHeight: 26,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
  bottomSpace: {
    height: 50,
  },
});
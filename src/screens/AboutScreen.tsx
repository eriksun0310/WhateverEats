import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function AboutScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.appName}>隨便吃！</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.paragraph}>
            隨便吃！是一款為選擇困難的你設計的美食推薦 App！
          </Text>
          <Text style={styles.paragraph}>
            我們的理念是：「讓每一餐都簡單、有趣、值得期待。」
          </Text>
          
          <Text style={[styles.paragraph, {marginTop: 16}]}>
            透過結合轉盤推薦、地圖探索、好友分享與收藏功能，我們希望你能在繁忙的生活中，
            用更輕鬆、有趣的方式找到心儀的餐廳，不再為「今天吃什麼」煩惱！
          </Text>
          
          <View style={styles.featureSection}>
            <Text style={styles.sectionTitle}>特色功能包括：</Text>
            <Text style={styles.bulletPoint}>• 轉盤隨機推薦餐廳，增添用餐驚喜感</Text>
            <Text style={styles.bulletPoint}>• 依據地區與篩選條件探索新店家</Text>
            <Text style={styles.bulletPoint}>• 建立口袋名單與黑名單</Text>
            <Text style={styles.bulletPoint}>• 與好友分享、接收推薦餐廳</Text>
          </View>
          
          <Text style={[styles.paragraph, {marginTop: 16}]}>
            我們的目標是成為你口袋裡最懂你的美食助理。
          </Text>
          <Text style={styles.highlight}>
            隨便吃，不等於將就吃，一起享受更聰明的美食探索！
          </Text>
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
  introSection: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  contentSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  featureSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6F3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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
  highlight: {
    fontSize: 16,
    color: '#FF6F3C',
    lineHeight: 26,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSpace: {
    height: 50,
  },
});
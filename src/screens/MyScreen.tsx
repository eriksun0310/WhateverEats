import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../constants/theme';

export default function MyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>個人資訊</Text>
        <Text style={styles.sectionContent}>暱稱與頭像設定將顯示於此</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>口袋名單</Text>
        <Text style={styles.sectionContent}>收藏的餐廳將顯示於此</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>黑名單</Text>
        <Text style={styles.sectionContent}>不想再看到的餐廳將顯示於此</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>朋友推薦</Text>
        <Text style={styles.sectionContent}>朋友推薦的餐廳將顯示於此</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionContent: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
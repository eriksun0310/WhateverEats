import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>餐廳地圖</Text>
      <Text style={styles.subtitle}>地圖將顯示於此</Text>
      <Text style={styles.note}>需要整合 react-native-maps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  note: {
    fontSize: 14,
    color: theme.colors.text.light,
  },
});
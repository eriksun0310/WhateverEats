import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { theme } from '../constants/theme';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>探索餐廳</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋區域或餐廳..."
          placeholderTextColor={theme.colors.text.light}
        />
      </View>
      <View style={styles.filtersContainer}>
        <Text style={styles.filterText}>篩選條件將顯示於此</Text>
      </View>
      <View style={styles.restaurantList}>
        <Text style={styles.listText}>餐廳列表將顯示於此</Text>
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
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  filtersContainer: {
    padding: theme.spacing.md,
  },
  filterText: {
    color: theme.colors.text.secondary,
  },
  restaurantList: {
    padding: theme.spacing.md,
  },
  listText: {
    color: theme.colors.text.secondary,
  },
});
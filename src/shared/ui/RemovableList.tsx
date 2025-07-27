import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import RestaurantCard from '../../components/RestaurantCard';
import EmptyState from './EmptyState';
import { theme } from '../../constants/theme';
import { Restaurant } from '../../types/restaurant';

interface RemovableListProps {
  data: any[];
  onRemove?: (id: string) => void;
  removeButtonText?: string;
  emptyStateProps: {
    title: string;
    subtitle?: string;
    action?: {
      label: string;
      onPress: () => void;
      icon?: React.ReactNode;
    };
  };
  renderHeader?: (item: any) => React.ReactNode;
  keyExtractor?: (item: any) => string;
}

export default function RemovableList({
  data,
  emptyStateProps,
  renderHeader,
  keyExtractor = (item) => item.id,
}: RemovableListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          {renderHeader && renderHeader(item)}
          <RestaurantCard restaurant={item as Restaurant} />
        </View>
      )}
      ListEmptyComponent={<EmptyState {...emptyStateProps} />}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: theme.spacing.md,
  },
  cardWrapper: {
    marginBottom: theme.spacing.md,
  },
});
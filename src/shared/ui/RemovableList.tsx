import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import RestaurantCard from '../../components/RestaurantCard';
import EmptyState from './EmptyState';
import { theme } from '../../constants/theme';
import { Restaurant } from '../../types/restaurant';

interface RemovableListProps {
  data: any[];
  onRemove: (id: string) => void;
  removeButtonText: string;
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
  onRemove,
  removeButtonText,
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
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
          >
            <Text style={styles.removeButtonText}>{removeButtonText}</Text>
          </TouchableOpacity>
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
  removeButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    marginTop: -theme.borderRadius.lg,
  },
  removeButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
  };
}

export default function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <TouchableOpacity style={styles.actionButton} onPress={action.onPress}>
          {action.icon}
          <Text style={styles.actionButtonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  title: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface ButtonConfig {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

interface DualButtonGroupProps {
  leftButton: ButtonConfig;
  rightButton: ButtonConfig;
  containerStyle?: ViewStyle;
  gap?: number;
}

export const DualButtonGroup: React.FC<DualButtonGroupProps> = ({
  leftButton,
  rightButton,
  containerStyle,
  gap = theme.spacing.md,
}) => {
  const renderButton = (button: ButtonConfig, isLeft: boolean) => {
    const isDisabled = button.disabled || button.loading;
    const variant = button.variant || (isLeft ? 'outline' : 'primary');
    
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles[variant],
          isDisabled && styles.disabled,
          { flex: 1 },
        ]}
        onPress={button.onPress}
        disabled={isDisabled}
      >
        {button.icon && (
          <View style={styles.iconContainer}>
            {button.icon}
          </View>
        )}
        <Text style={[
          styles.buttonText,
          styles[`${variant}Text`],
          isDisabled && styles.disabledText,
        ]}>
          {button.loading ? '載入中...' : button.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderButton(leftButton, true)}
      <View style={{ width: gap }} />
      {renderButton(rightButton, false)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Button variants
  primary: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  // Text styles
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: theme.colors.surface,
  },
  secondaryText: {
    color: theme.colors.text.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: theme.spacing.xs,
  },
});
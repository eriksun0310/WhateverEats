import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme } from '../constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function FormInput({
  icon: Icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...textInputProps
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {Icon && (
        <Icon size={20} color={theme.colors.text.secondary} style={styles.leftIcon} />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.text.light}
        {...textInputProps}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  },
});
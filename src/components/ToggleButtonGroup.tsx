import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../constants/theme';

interface ToggleOption<T> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  activeButtonStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export default function ToggleButtonGroup<T>({
  options,
  value,
  onChange,
  containerStyle,
  buttonStyle,
  activeButtonStyle,
  textStyle,
  activeTextStyle,
}: ToggleButtonGroupProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[
              styles.button,
              buttonStyle,
              isActive && styles.buttonActive,
              isActive && activeButtonStyle,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.text,
                textStyle,
                isActive && styles.textActive,
                isActive && activeTextStyle,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    padding: 2,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    marginHorizontal: 2,
  },
  buttonActive: {
    backgroundColor: theme.colors.surface,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  textActive: {
    color: theme.colors.text.primary,
  },
});
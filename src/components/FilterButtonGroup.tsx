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

interface FilterOption {
  value: string | number;
  label: string;
}

interface FilterButtonGroupProps {
  options: FilterOption[] | string[];
  selectedValues: (string | number)[];
  onToggle: (value: string | number) => void;
  multiple?: boolean;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  activeButtonStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export default function FilterButtonGroup({
  options,
  selectedValues,
  onToggle,
  multiple = true,
  containerStyle,
  buttonStyle,
  activeButtonStyle,
  textStyle,
  activeTextStyle,
}: FilterButtonGroupProps) {
  const handlePress = (value: string | number) => {
    if (!multiple) {
      // 單選模式：如果已選中則取消，否則選中
      onToggle(selectedValues.includes(value) ? null : value);
    } else {
      // 多選模式
      onToggle(value);
    }
  };

  const normalizeOptions = (): FilterOption[] => {
    return options.map(opt => 
      typeof opt === 'string' || typeof opt === 'number' 
        ? { value: opt, label: String(opt) }
        : opt
    );
  };

  const normalizedOptions = normalizeOptions();

  return (
    <View style={[styles.container, containerStyle]}>
      {normalizedOptions.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[
              styles.button,
              buttonStyle,
              isSelected && styles.buttonActive,
              isSelected && activeButtonStyle,
            ]}
            onPress={() => handlePress(option.value)}
          >
            <Text
              style={[
                styles.text,
                textStyle,
                isSelected && styles.textActive,
                isSelected && activeTextStyle,
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
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  button: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  buttonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  textActive: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});
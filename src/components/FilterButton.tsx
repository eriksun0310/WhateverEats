import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeColor?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive,
  onPress,
  style,
  textStyle,
  activeColor = '#FF6F3C',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && { backgroundColor: activeColor },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          isActive && styles.activeText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
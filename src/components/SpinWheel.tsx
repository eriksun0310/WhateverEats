import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;

interface SpinWheelProps {
  onSpinComplete: () => void;
  isSpinning: boolean;
  onStartSpin: () => void;
}

export default function SpinWheel({ onSpinComplete, isSpinning, onStartSpin }: SpinWheelProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  
  const spin = () => {
    if (isSpinning) return;
    
    onStartSpin();
    
    // 重置動畫值
    spinValue.setValue(0);
    
    // 隨機旋轉圈數（3-5圈）+ 隨機角度
    const randomRotations = 3 + Math.random() * 2;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;
    
    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      onSpinComplete();
    });
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: spinInterpolate }],
  };

  // 分段顏色
  const segments = [
    { color: '#FF6F3C', emoji: '🍕' },
    { color: '#FFA726', emoji: '🍜' },
    { color: '#66BB6A', emoji: '🍱' },
    { color: '#42A5F5', emoji: '🍔' },
    { color: '#AB47BC', emoji: '🥘' },
    { color: '#EF5350', emoji: '🍖' },
    { color: '#29B6F6', emoji: '🥗' },
    { color: '#FFA726', emoji: '🍝' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View style={[styles.wheel, animatedStyle]}>
          {segments.map((segment, index) => {
            const angle = (360 / segments.length) * index;
            return (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: segment.color,
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateX: WHEEL_SIZE / 2 },
                    ],
                  },
                ]}
              >
                <Text style={styles.segmentEmoji}>{segment.emoji}</Text>
              </View>
            );
          })}
        </Animated.View>
        
        {/* 指針 */}
        <View style={styles.pointer}>
          <View style={styles.pointerTriangle} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? '轉動中...' : '開始轉盤'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    position: 'relative',
    marginBottom: theme.spacing.xl,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  segment: {
    position: 'absolute',
    width: WHEEL_SIZE / 2,
    height: WHEEL_SIZE / 2,
    left: 0,
    top: WHEEL_SIZE / 4,
    transformOrigin: 'right center',
  },
  segmentEmoji: {
    position: 'absolute',
    left: 20,
    top: '40%',
    fontSize: 24,
  },
  pointer: {
    position: 'absolute',
    top: -20,
    left: WHEEL_SIZE / 2 - 20,
    width: 40,
    height: 40,
    alignItems: 'center',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.error,
  },
  spinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  spinButtonDisabled: {
    backgroundColor: theme.colors.text.light,
  },
  spinButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
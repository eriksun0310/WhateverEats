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
const WHEEL_SIZE = width * 0.75;

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

  // 分段顏色 - 使用舒適且有層次的配色
  const segments = [
    { color: '#FF6F3C' }, // 主題橘
    { color: '#FFA74F' }, // 亮橘
    { color: '#FFD93D' }, // 金黃
    { color: '#6BCF7F' }, // 薄荷綠
    { color: '#4ECDC4' }, // 青綠
    { color: '#95E1D3' }, // 淺綠
    { color: '#FFB6B9' }, // 玫瑰粉
    { color: '#FEC8D8' }, // 淺粉
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
              />
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
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 8,
    borderColor: theme.colors.surface,
  },
  segment: {
    position: 'absolute',
    width: WHEEL_SIZE / 2,
    height: WHEEL_SIZE / 2,
    left: 0,
    top: WHEEL_SIZE / 4,
    transformOrigin: 'right center',
  },
  pointer: {
    position: 'absolute',
    bottom: -20,
    left: WHEEL_SIZE / 2 - 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    zIndex: 10,
    transform: [{ rotate: '180deg' }],
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl * 2,
    paddingVertical: theme.spacing.md + 4,
    borderRadius: theme.borderRadius.full,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonDisabled: {
    backgroundColor: theme.colors.border,
    shadowOpacity: 0.1,
  },
  spinButtonText: {
    color: theme.colors.surface,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
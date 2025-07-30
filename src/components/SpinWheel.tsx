import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { vibrationManager } from '../services/vibrationManager';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.75;

interface SpinWheelProps {
  onSpinComplete: () => void;
  isSpinning: boolean;
  onStartSpin: () => void;
}

export default function SpinWheel({ onSpinComplete, isSpinning, onStartSpin }: SpinWheelProps) {
  const rotation = useSharedValue(0);
  const pointerScale = useSharedValue(1);
  const wheelScale = useSharedValue(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // 初始化震動系統
  useEffect(() => {
    vibrationManager.initialize();
  }, []);
  
  // 不需要轉盤過程中的震動
  
  // 創建完成回調函數
  const handleSpinComplete = (selectedIndex: number) => {
    setSelectedIndex(selectedIndex);
    vibrationManager.playSpinResult();
    onSpinComplete();
  };

  const spin = () => {
    if (isSpinning) return;
    
    onStartSpin();
    
    // 播放開始震動
    vibrationManager.playSpinStart();
    
    // 重置動畫值
    rotation.value = 0;
    wheelScale.value = 1;
    setSelectedIndex(null);
    
    // 隨機旋轉圈數（4-6圈）+ 隨機角度
    const randomRotations = 4 + Math.random() * 2;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;
    
    // 計算最終停留的扇形索引
    const segments = 8;
    const segmentAngle = 360 / segments;
    const finalAngle = totalRotation % 360;
    const selectedSegmentIndex = Math.floor((360 - finalAngle) / segmentAngle) % segments;
    
    // 指針彈跳動畫
    pointerScale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    
    // 轉盤縮放動畫
    wheelScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    
    // 主旋轉動畫
    rotation.value = withTiming(totalRotation, {
      duration: 4000,
      easing: Easing.out(Easing.cubic),
    });
    
    // 使用 setTimeout 處理完成邏輯
    setTimeout(() => {
      // 指針最終彈跳
      pointerScale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withSpring(1, { damping: 6, stiffness: 300 })
      );
      
      // 執行完成回調
      handleSpinComplete(selectedSegmentIndex);
    }, 4100); // 略晚於動畫完成時間
  };

  const wheelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: wheelScale.value }
      ],
    };
  });
  
  const pointerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: '180deg' },
        { scale: pointerScale.value }
      ],
    };
  });

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
        <Animated.View style={[styles.wheel, wheelAnimatedStyle]}>
          {segments.map((segment, index) => {
            const angle = (360 / segments.length) * index;
            const isSelected = selectedIndex === index;
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: segment.color,
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateX: WHEEL_SIZE / 2 },
                    ],
                    opacity: isSelected ? 1 : (selectedIndex !== null ? 0.6 : 1),
                  },
                ]}
              >
                {isSelected && (
                  <View style={styles.selectedOverlay} />
                )}
              </Animated.View>
            );
          })}
        </Animated.View>
        
        {/* 指針 */}
        <Animated.View style={[styles.pointer, pointerAnimatedStyle]}>
          <View style={styles.pointerTriangle} />
        </Animated.View>
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
  selectedOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: WHEEL_SIZE / 4,
  },
});
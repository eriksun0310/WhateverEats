import { ViewStyle } from 'react-native';

export const shadows = {
  // 輕微陰影（用於卡片、按鈕）
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  } as ViewStyle,
  
  // 中等陰影（用於浮動元素）
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  
  // 較重陰影（用於模態框）
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  } as ViewStyle,
  
  // 向上的陰影（用於底部彈出）
  top: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  } as ViewStyle,
};
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { X, MapPin, Phone } from 'lucide-react-native';
import { Restaurant } from '../types';
import { theme } from '../constants/theme';
import { shadows } from '../constants/shadows';
import { DualButtonGroup } from './DualButtonGroup';
import { RestaurantInfo } from './RestaurantInfo';
import { RestaurantModalInfo } from './RestaurantModalInfo';

interface RestaurantConfirmModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

export const RestaurantConfirmModal: React.FC<RestaurantConfirmModalProps> = ({
  visible,
  restaurant,
  onClose,
}) => {
  if (!restaurant) return null;

  const handleNavigation = () => {
    const { latitude, longitude } = restaurant;
    const label = encodeURIComponent(restaurant.name);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url).catch((err) => {
      Alert.alert('無法開啟地圖', '請確認是否安裝地圖應用程式');
    });
  };

  const handleCall = () => {
    // TODO: 需要在 Restaurant type 中加入 phone 欄位
    Alert.alert('撥打電話', '電話功能即將推出！');
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* 關閉按鈕 */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 餐廳資訊 */}
            {/* <View > */}
              <RestaurantInfo
                restaurant={restaurant}
                showImage={true}
                showActions={true}
                isFavorite={false}
                isInWheelList={true}
                isBlacklisted={false}
                onToggleFavorite={() => {}}
                onToggleWheelList={() => {}}
                onToggleBlacklist={() => {}}
                onShare={() => {}}
                variant="modal"
                imageHeight={200}
              />
            {/* </View> */}
         

            {/* 主要行動按鈕 */}
            <View style={styles.actionButtons}>
              <DualButtonGroup
                leftButton={{
                  title: '導航前往',
                  onPress: handleNavigation,
                  variant: 'outline',
                  icon: <MapPin size={20} color={theme.colors.primary} />,
                }}
                rightButton={{
                  title: '撥打電話',
                  onPress: handleCall,
                  variant: 'primary',
                  icon: <Phone size={20} color={theme.colors.surface} />,
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
    position: 'relative',
    ...shadows.large,

  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    ...shadows.light,
  },

  
  actionButtons: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
  },
});
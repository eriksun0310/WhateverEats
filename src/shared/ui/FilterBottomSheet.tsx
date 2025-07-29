import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { FilterButton } from '../../components/FilterButton';
import { DualButtonGroup } from '../../components/DualButtonGroup';

const { height } = Dimensions.get('window');

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  cuisineTypes: string[];
  selectedCuisineTypes: string[];
  selectedDistance: number | null;
  onCuisineTypeToggle: (cuisineType: string) => void;
  onDistanceSelect: (distance: number | null) => void;
  onClear: () => void;
  onApply: () => void;
}

const DISTANCE_OPTIONS = [
  { value: 500, label: '500公尺內' },
  { value: 1000, label: '1公里內' },
  { value: 2000, label: '2公里內' },
  { value: 5000, label: '5公里內' },
];

export default function FilterBottomSheet({
  visible,
  onClose,
  cuisineTypes,
  selectedCuisineTypes,
  selectedDistance,
  onCuisineTypeToggle,
  onDistanceSelect,
  onClear,
  onApply,
}: FilterBottomSheetProps) {
  // 確保有料理類型可顯示
  const displayCuisineTypes = cuisineTypes.length > 0 
    ? cuisineTypes 
    : ['台式料理', '日式料理', '韓式料理', '義式料理', '美式料理', '小吃', '創意料理'];
  const handleApply = () => {
    onApply();
    onClose();
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>篩選條件</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalBody} 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* 距離範圍 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>距離範圍</Text>
              <View style={styles.buttonGroup}>
                {DISTANCE_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    label={option.label}
                    isActive={selectedDistance === option.value}
                    onPress={() => onDistanceSelect(selectedDistance === option.value ? null : option.value)}
                    // style={styles.filterButtonStyle}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.filterDivider} />
            
            {/* 料理類型 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>料理類型</Text>
              <View style={styles.buttonGroup}>
                {displayCuisineTypes.map((cuisineType) => (
                  <FilterButton
                    key={cuisineType}
                    label={cuisineType}
                    isActive={selectedCuisineTypes.includes(cuisineType)}
                    onPress={() => onCuisineTypeToggle(cuisineType)}
                    // style={styles.filterButtonStyle}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <DualButtonGroup
              leftButton={{
                title: '清除全部',
                onPress: onClear,
                variant: 'outline',
              }}
              rightButton={{
                title: '套用',
                onPress: handleApply,
                variant: 'primary',
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalBody: {
    flex: 1,
  },
  filterSection: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
  },
  filterButtonStyle: {
    // 使用預設樣式
  },
  filterDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  modalFooter: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
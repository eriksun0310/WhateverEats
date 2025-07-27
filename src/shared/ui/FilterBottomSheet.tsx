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
              <View style={styles.buttonContainer}>
                {DISTANCE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterButton,
                      selectedDistance === option.value && styles.filterButtonActive
                    ]}
                    onPress={() => onDistanceSelect(
                      selectedDistance === option.value ? null : option.value
                    )}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedDistance === option.value && styles.filterButtonTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterDivider} />
            
            {/* 料理類型 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>料理類型</Text>
              <View style={styles.buttonContainer}>
                {displayCuisineTypes.map((cuisineType) => (
                  <TouchableOpacity
                    key={cuisineType}
                    style={[
                      styles.filterButton,
                      selectedCuisineTypes.includes(cuisineType) && styles.filterButtonActive
                    ]}
                    onPress={() => onCuisineTypeToggle(cuisineType)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedCuisineTypes.includes(cuisineType) && styles.filterButtonTextActive
                    ]}>
                      {cuisineType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClear}
            >
              <Text style={styles.clearButtonText}>清除全部</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>套用</Text>
            </TouchableOpacity>
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
    height: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  clearButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  applyButtonText: {
    color: theme.colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateUserProfile } from '../store/slices/userSlice';
import { AuthService } from '../services/authService';
import { theme } from '../constants/theme';
import { User, Camera } from 'lucide-react-native';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const avatarOptions = [
  { id: 'dog', image: require('../../assets/image/dog.png'), label: '老實說狗狗' },
  { id: 'cat', image: require('../../assets/image/cat.png'), label: '老實說貓貓' },
];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  
  const [name, setName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('錯誤', '請輸入暱稱');
      return;
    }

    setLoading(true);
    
    try {
      // 更新本地狀態
      dispatch(updateUserProfile({ name, avatar: selectedAvatar }));
      
      // 更新儲存的使用者資料
      await AuthService.updateUser({ name, avatar: selectedAvatar });
      
      Alert.alert('成功', '個人資料已更新', [
        { text: '確定', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('錯誤', '更新失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 頭像選擇 */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>選擇頭像</Text>
          <View style={styles.avatarContainer}>
            {avatarOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar === option.id && styles.selectedAvatar,
                ]}
                onPress={() => setSelectedAvatar(option.id)}
              >
                <Image source={option.image} style={styles.avatarImage} />
                <Text style={[
                  styles.avatarLabel,
                  selectedAvatar === option.id && styles.selectedAvatarLabel
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 基本資料 */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>基本資料</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>暱稱</Text>
            <FormInput
              icon={User}
              value={name}
              onChangeText={setName}
              placeholder="請輸入暱稱"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>電子郵件</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{user.email}</Text>
              <Text style={styles.readOnlyHint}>無法修改</Text>
            </View>
          </View>
        </View>

        {/* 操作按鈕 */}
        <View style={styles.actions}>
          <Button
            title="儲存變更"
            onPress={handleSave}
            loading={loading}
          />
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  avatarOption: {
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  selectedAvatar: {
    backgroundColor: theme.colors.background,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.sm,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  selectedAvatarLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  readOnlyField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  readOnlyText: {
    fontSize: 16,
    color: theme.colors.text.light,
  },
  readOnlyHint: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  actions: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,

  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
});
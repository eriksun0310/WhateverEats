import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store';
import { updateUserProfile, logout } from '../store/slices/userSlice';
import { theme } from '../constants/theme';
import { ChevronRight, Edit3, LogOut, User as UserIcon, Info, Shield } from 'lucide-react-native';

const avatarOptions = [
  { id: 'dog', image: require('../../assets/image/dog.png'), label: '老實說狗狗' },
  { id: 'cat', image: require('../../assets/image/cat.png'), label: '老實說貓貓' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('錯誤', '請輸入暱稱');
      return;
    }
    
    dispatch(updateUserProfile({
      name: editName.trim(),
      avatar: selectedAvatar,
    }));
    setShowEditProfile(false);
    Alert.alert('成功', '個人資料已更新');
  };

  const handleLogout = () => {
    Alert.alert(
      '登出',
      '確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '登出',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: <Edit3 size={20} color={theme.colors.text.primary} />,
      title: '編輯個人資料',
      onPress: () => setShowEditProfile(true),
    },
    {
      icon: <Info size={20} color={theme.colors.text.primary} />,
      title: '關於',
      onPress: () => Alert.alert('關於', '隨便吃！ v1.0.0\n\n幫助你解決選擇困難的美食 App'),
    },
    {
      icon: <Shield size={20} color={theme.colors.text.primary} />,
      title: '隱私政策',
      onPress: () => Alert.alert('隱私政策', '我們重視您的隱私，不會分享您的個人資料給第三方。'),
    },
    {
      icon: <LogOut size={20} color={theme.colors.error} />,
      title: '登出',
      titleColor: theme.colors.error,
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用戶資訊區 */}
        <View style={styles.userSection}>
          <Image 
            source={user.avatar === 'cat' ? require('../../assets/image/cat.png') : require('../../assets/image/dog.png')}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* 選單區 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[
                  styles.menuItemTitle,
                  item.titleColor && { color: item.titleColor }
                ]}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 編輯個人資訊 Modal */}
      <Modal
        visible={showEditProfile}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>編輯個人資料</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>暱稱</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="輸入暱稱"
              placeholderTextColor={theme.colors.text.light}
            />

            <Text style={styles.inputLabel}>選擇頭像</Text>
            <View style={styles.avatarOptions}>
              {avatarOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === option.id && styles.selectedAvatarOption,
                  ]}
                  onPress={() => setSelectedAvatar(option.id)}
                >
                  <Image 
                    source={option.image} 
                    style={[
                      styles.avatarImage,
                      selectedAvatar === option.id && styles.selectedAvatarImage
                    ]} 
                  />
                  <Text style={styles.avatarLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>儲存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  userSection: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  menuSection: {
    backgroundColor: theme.colors.surface,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    padding: theme.spacing.xs,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarOption: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  selectedAvatarOption: {
    // 選中的頭像選項容器樣式
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  selectedAvatarImage: {
    borderColor: theme.colors.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
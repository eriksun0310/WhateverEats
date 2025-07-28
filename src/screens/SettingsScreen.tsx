import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/userSlice';
import { theme } from '../constants/theme';
import { ChevronRight, Edit3, LogOut, User as UserIcon, Info, Shield, FileText } from 'lucide-react-native';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

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
      onPress: () => navigation.navigate('EditProfile' as never),
    },
    {
      icon: <Info size={20} color={theme.colors.text.primary} />,
      title: '關於',
      onPress: () => navigation.navigate('About' as never),
    },
    {
      icon: <Shield size={20} color={theme.colors.text.primary} />,
      title: '隱私政策',
      onPress: () => navigation.navigate('PrivacyPolicy' as never),
    },
    {
      icon: <FileText size={20} color={theme.colors.text.primary} />,
      title: '服務條款',
      onPress: () => navigation.navigate('Terms' as never),
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
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';
import { theme } from '../constants/theme';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { Image } from 'react-native';

const avatarOptions = [
  { id: 'dog', image: require('../../assets/image/dog.png'), label: '老實說狗狗' },
  { id: 'cat', image: require('../../assets/image/cat.png'), label: '老實說貓貓' },
];

interface RegisterScreenProps {
  navigation: any;
}


export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return false;
    }

    if (!form.email.includes('@')) {
      Alert.alert('錯誤', '請輸入有效的電子郵件');
      return false;
    }

    if (form.password.length < 6) {
      Alert.alert('錯誤', '密碼至少需要 6 個字元');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('錯誤', '密碼不相符');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // 模擬註冊（實際應連接 API）
    setTimeout(() => {
      // 假設註冊成功
      dispatch(setUser({
        id: Date.now().toString(),
        email: form.email,
        name: form.name,
        avatar: selectedAvatar,
      }));
      
      Alert.alert('註冊成功', '歡迎加入隨便吃！', [
        { text: '開始使用', onPress: () => navigation.replace('MainTabs') }
      ]);
      
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>建立帳號</Text>
          <Text style={styles.subtitle}>加入隨便吃，探索更多美食！</Text>
        </View>

        <View style={styles.form}>
          {/* 選擇頭像 */}
          <View style={styles.avatarSection}>
            <Text style={styles.label}>選擇頭像</Text>
            <View style={styles.avatarOptions}>
              {avatarOptions.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.selectedAvatar,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                >
                  <Image source={avatar.image} style={styles.avatarImage} />
                  <Text style={styles.avatarLabel}>{avatar.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 暱稱 */}
          <View style={styles.inputContainer}>
            <User size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="暱稱"
              placeholderTextColor={theme.colors.text.light}
              value={form.name}
              onChangeText={(value) => updateForm('name', value)}
              autoCapitalize="words"
            />
          </View>

          {/* 電子郵件 */}
          <View style={styles.inputContainer}>
            <Mail size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="電子郵件"
              placeholderTextColor={theme.colors.text.light}
              value={form.email}
              onChangeText={(value) => updateForm('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 密碼 */}
          <View style={styles.inputContainer}>
            <Lock size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="密碼（至少 6 個字元）"
              placeholderTextColor={theme.colors.text.light}
              value={form.password}
              onChangeText={(value) => updateForm('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.colors.text.secondary} />
              ) : (
                <Eye size={20} color={theme.colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* 確認密碼 */}
          <View style={styles.inputContainer}>
            <Lock size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="確認密碼"
              placeholderTextColor={theme.colors.text.light}
              value={form.confirmPassword}
              onChangeText={(value) => updateForm('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={theme.colors.text.secondary} />
              ) : (
                <Eye size={20} color={theme.colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? '建立中...' : '建立帳號'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>已經有帳號了？</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>立即登入</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  avatarSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  avatarOption: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: theme.colors.surface,
  },
  selectedAvatar: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.sm,
  },
  avatarLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  eyeButton: {
    padding: theme.spacing.sm,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginPromptText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
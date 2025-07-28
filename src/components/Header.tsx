import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { shadows } from '../constants/shadows';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  variant?: 'primary' | 'surface';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBackPress,
  rightComponent,
  variant = 'primary',
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const isPrimary = variant === 'primary';
  const backgroundColor = isPrimary ? theme.colors.primary : theme.colors.surface;
  const textColor = isPrimary ? theme.colors.surface : theme.colors.text.primary;

  return (
    <>
      <StatusBar 
        barStyle={isPrimary ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.content}>
          {showBack ? (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={textColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
          
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          
          {rightComponent || <View style={styles.placeholder} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 30,
    ...shadows.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    height: 56,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './src/store';
import { Dices, Search, MapPin, User, Settings, UserPlus } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import SpinScreen from './src/screens/SpinScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import MapScreen from './src/screens/MapScreen';
import MyScreen from './src/screens/MyScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/components/SplashScreen';
import { theme } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.light,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Spin"
        component={SpinScreen}
        options={{
          title: '轉盤',
          tabBarIcon: ({ color, size }) => (
            <Dices size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: '探索',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: '地圖',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={({ navigation }) => {
          const user = useSelector((state: RootState) => state.user);
          const isGuest = user.email === 'test@example.com';
          
          return {
            title: '我的',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate(isGuest ? 'Register' : 'Settings' as never)}
                style={{ marginRight: theme.spacing.md }}
              >
                {isGuest ? (
                  <UserPlus size={24} color={theme.colors.surface} />
                ) : (
                  <Settings size={24} color={theme.colors.surface} />
                )}
              </TouchableOpacity>
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!user.id;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: '設定',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.surface,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: '設定',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.surface,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setIsShowSplash(false);
  };

  if (isShowSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <NavigationContainer fallback={null}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}
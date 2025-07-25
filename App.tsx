import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';

import SpinScreen from './src/screens/SpinScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import MapScreen from './src/screens/MapScreen';
import MyScreen from './src/screens/MyScreen';
import { theme } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.light,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
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
              <Text style={{ fontSize: size, color }}>🎰</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            title: '探索',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🔍</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: '地圖',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📍</Text>
            ),
          }}
        />
        <Tab.Screen
          name="My"
          component={MyScreen}
          options={{
            title: '我的',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
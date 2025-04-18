import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.LIGHT,
        },
        headerTitleStyle: {
          fontSize: 32,
          fontFamily: Fonts.Inter_600SemiBold,
          letterSpacing: -1, // looks way better
          color: colors.DARK,
        },
        tabBarInactiveTintColor: colors.GRAY,
        tabBarActiveTintColor: colors.ORANGE,
        tabBarStyle: {
          backgroundColor: colors.LIGHT,
          borderColor: colors.LIGHT,
        },
        tabBarButton: (props) => {
          return (
            <TouchableOpacity onPress={props.onPress} style={props.style}>
              {props.children}
            </TouchableOpacity>
          );
        },
      }}
    >
      <Tabs.Screen
        name="bookshelf"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="bookshelf"
                size={size}
                color={color}
              />
            );
          },
          tabBarLabel: 'Bookshelf',
        }}
      />
      <Tabs.Screen
        name="(ankicards)"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons name="brain" size={size} color={color} />
            );
          },
          tabBarLabel: 'Words',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name="settings-sharp" size={size} color={color} />;
          },
          tabBarLabel: 'Settings',
        }}
      />
      <Tabs.Screen
        name="bookreader"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

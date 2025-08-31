import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

const CustomTabBarButton = ({ children, onPress, isActive }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const opacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 78,
        paddingHorizontal: 20,
        position: 'relative',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 10,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(255, 246, 148, 1)',
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ zIndex: 1 }}>{children}</View>
    </TouchableOpacity>
  );
};


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#102920', // To avoid background blocks
            borderTopWidth: 0, // Remove default top border
          },
          default: {
            backgroundColor: '#102920', // Make the background transparent
            borderTopWidth: 0,
          },
        }),
      }}>
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} isActive={props.accessibilityState?.selected}>
              <IconSymbol size={40} name="party.popper.fill" color={props.accessibilityState?.selected ? '#06402B' : '#FFFBCE'} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} isActive={props.accessibilityState?.selected}>
              <IconSymbol size={40} name="camera.fill" color={props.accessibilityState?.selected ? '#06402B' : '#FFFBCE'} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} isActive={props.accessibilityState?.selected}>
              <IconSymbol size={40} name="house.fill" color={props.accessibilityState?.selected ? '#06402B' : '#FFFBCE'} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} isActive={props.accessibilityState?.selected}>
              <IconSymbol size={40} name="person.fill" color={props.accessibilityState?.selected ? '#06402B' : '#FFFBCE'} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} isActive={props.accessibilityState?.selected}>
              <IconSymbol size={40} name="gear" color={props.accessibilityState?.selected ? '#06402B' : '#FFFBCE'} />
            </CustomTabBarButton>
          ),
        }}
      />
    </Tabs>
  );
}

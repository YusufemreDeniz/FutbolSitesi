import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="premier-league"
        options={{
          title: 'Premier Ligi',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/Ligler/ingiltereLigi.png')}
              style={{ width: 36, height: 36, resizeMode: 'contain' }}
            />
          ),
        }}
      />
            <Tabs.Screen
        name="team-details"
        options={{
          title: 'Takım Detayları',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="team-squad"
        options={{
          title: 'Kadro',
          tabBarIcon: ({ color }) => <Ionicons name="shirt" size={28} color={color} />,
        }}
      />
<Tabs.Screen
        name="player-details"
        options={{
          title: 'Oyuncu Profili',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export function getDrawerIcon(label: string, color: string = '#232946', size: number = 26) {
  switch (label) {
    case 'Home':
      return <Ionicons name="home" size={size} color={color} />;
    case 'Explore':
      return <Ionicons name="search" size={size} color={color} />;
    case 'Premier Ligi':
      return <Ionicons name="trophy" size={size} color={color} />;
    case 'Puan Durumu':
      return <Ionicons name="list" size={size} color={color} />;
    case 'Takım Detayları':
      return <Ionicons name="people" size={size} color={color} />;
    case 'Kadro':
      return <Ionicons name="grid-outline" size={size} color={color} />;
    case 'Oyuncu Profili':
      return <Ionicons name="person" size={size} color={color} />;
    case 'Şampiyonlar Ligi':
      return <Ionicons name="trophy-outline" size={size} color={color} />;
    default:
      return <Ionicons name="ellipse" size={size} color={color} />;
  }
}

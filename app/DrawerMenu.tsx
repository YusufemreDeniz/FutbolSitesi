import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getDrawerIcon } from './DrawerMenuIcons';

const mainMenu = [
  { label: 'Home', route: '/(tabs)/' },
  { label: 'Explore', route: '/(tabs)/explore' },
  { label: 'Premier Ligi', route: '/(tabs)/PremierLig/premier-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/PremierLig/premier-league' },
      { label: 'Takım Detayları', route: '/(tabs)/PremierLig/team-details' },
      { label: 'Kadro', route: '/(tabs)/PremierLig/team-squad' },
      { label: 'Oyuncu Profili', route: '/(tabs)/PremierLig/player-details' },
    ]
  },
  { label: 'Fransa Ligi', route: '/(tabs)/FransaLig/fransa-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/FransaLig/fransa-league' },
      { label: 'Takım Detayları', route: '/(tabs)/FransaLig/team-details' },
      { label: 'Kadro', route: '/(tabs)/FransaLig/team-squad' },
      { label: 'Oyuncu Profili', route: '/(tabs)/FransaLig/player-details' },
    ]
  },
  { label: 'Almanya Ligi', route: '/(tabs)/AlmanyaLig/germany-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/AlmanyaLig/germany-league' },
      { label: 'Takım Detayları', route: '/(tabs)/AlmanyaLig/team-details' },
      { label: 'Kadro', route: '/(tabs)/AlmanyaLig/team-squad' },
      { label: 'Oyuncu Profili', route: '/(tabs)/AlmanyaLig/player-details' },
    ]
  },
  { label: 'Türkiye Ligi', route: '/(tabs)/TurkiyeLig/turkiye-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/TurkiyeLig/turkiye-league' },
      { label: 'Takım Detayları', route: '/(tabs)/TurkiyeLig/team-details' },
      { label: 'Kadro', route: '/(tabs)/TurkiyeLig/team-squad' },
      { label: 'Oyuncu Profili', route: '/(tabs)/TurkiyeLig/player-details' },
    ]
  },
  { label: 'İtalya Ligi', route: '/(tabs)/ItalyaLig/italy-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/ItalyaLig/italy-league' },
      { label: 'Takım Detayları', route: '/(tabs)/ItalyaLig/team-details' },
      { label: 'Kadro', route: '/(tabs)/ItalyaLig/team-squad' },
      { label: 'Oyuncu Profili', route: '/(tabs)/ItalyaLig/player-details' },
    ]
  },
  { label: 'Şampiyonlar Ligi', route: '/(tabs)/SampiyonlarLigi/champions-league',
    children: [
      { label: 'Puan Durumu', route: '/(tabs)/SampiyonlarLigi/champions-league' },
      { label: 'Fikstürler', route: '/(tabs)/SampiyonlarLigi/group-fixtures' },
    ]
  },
];

export default function DrawerMenu({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [expandedPremier, setExpandedPremier] = useState(false);
  const [expandedFransa, setExpandedFransa] = useState(false);
  const [expandedAlmanya, setExpandedAlmanya] = useState(false);
  const [expandedTurkiye, setExpandedTurkiye] = useState(false);
  const [expandedItalya, setExpandedItalya] = useState(false);
  const [expandedChampions, setExpandedChampions] = useState(false);

  const handlePress = (item: any) => {
    if (item.label === 'Premier Ligi') {
      setExpandedPremier((prev) => !prev);
    } else if (item.label === 'Fransa Ligi') {
      setExpandedFransa((prev) => !prev);
    } else if (item.label === 'Almanya Ligi') {
      setExpandedAlmanya((prev) => !prev);
    } else if (item.label === 'Türkiye Ligi') {
      setExpandedTurkiye((prev) => !prev);
    }
    else if (item.label === 'İtalya Ligi') {
      setExpandedItalya((prev) => !prev);
    } else if (item.label === 'Şampiyonlar Ligi') {
      setExpandedChampions((prev) => !prev);
    } else {
      router.replace(item.route as any);
      if (onClose) onClose();
    }
  };

  return (
    <LinearGradient
      colors={["#f8fafc", "#e0ecff", "#fff"]}
      style={styles.container}
    >
      <View style={styles.menuHeaderBox}>
        <Image
          source={require('../assets/images/giris/grisLogo.png')}
          style={styles.menuLogo}
        />
        <Text style={styles.menuHeaderText}>Futbolum</Text>
      </View>
      {mainMenu.map((item) => (
        <View key={item.label}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.menuRow}>
              <Text style={styles.menuText}>{item.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.label === 'Premier Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedPremier ? '▼' : '▶'}</Text>
                )}
                {item.label === 'Fransa Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedFransa ? '▼' : '▶'}</Text>
                )}
                {item.label === 'Almanya Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedAlmanya ? '▼' : '▶'}</Text>
                )}
                {item.label === 'Türkiye Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedTurkiye ? '▼' : '▶'}</Text>
                )}
                {item.label === 'İtalya Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedItalya ? '▼' : '▶'}</Text>
                )}
                {item.label === 'Şampiyonlar Ligi' && (
                  <Text style={{ marginRight: 6 }}>{expandedChampions ? '▼' : '▶'}</Text>
                )}
                <View style={styles.menuIcon}>{getDrawerIcon(item.label)}</View>
              </View>
            </View>
          </TouchableOpacity>
          {item.children && item.label === 'Premier Ligi' && expandedPremier && (
            <View style={styles.subMenuContainer}>
              {item.children.map((sub) => (
                <TouchableOpacity
                  key={typeof sub.route === 'string' ? sub.route : sub.label}
                  style={styles.subMenuItem}
                  onPress={() => handlePress(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subMenuText}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {item.children && item.label === 'Fransa Ligi' && expandedFransa && (
            <View style={styles.subMenuContainer}>
              {item.children.map((sub) => (
                <TouchableOpacity
                  key={typeof sub.route === 'string' ? sub.route : sub.label}
                  style={styles.subMenuItem}
                  onPress={() => handlePress(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subMenuText}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {item.children && item.label === 'Almanya Ligi' && expandedAlmanya && (
            <View style={styles.subMenuContainer}>
              {item.children.map((sub) => (
                <TouchableOpacity
                  key={typeof sub.route === 'string' ? sub.route : sub.label}
                  style={styles.subMenuItem}
                  onPress={() => handlePress(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subMenuText}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {item.children && item.label === 'Türkiye Ligi' && expandedTurkiye && (
            <View style={styles.subMenuContainer}>
              {item.children.map((sub) => (
                <TouchableOpacity
                  key={typeof sub.route === 'string' ? sub.route : sub.label}
                  style={styles.subMenuItem}
                  onPress={() => handlePress(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subMenuText}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {item.children && item.label === 'İtalya Ligi' && expandedItalya && (
            <View style={styles.subMenuContainer}>
              {item.children.map((sub) => (
                <TouchableOpacity
                  key={typeof sub.route === 'string' ? sub.route : sub.label}
                  style={styles.subMenuItem}
                  onPress={() => handlePress(sub)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subMenuText}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        {item.children && item.label === 'Şampiyonlar Ligi' && expandedChampions && (
          <View style={styles.subMenuContainer}>
            {item.children.map((sub) => (
              <TouchableOpacity
                key={typeof sub.route === 'string' ? sub.route : sub.label}
                style={styles.subMenuItem}
                onPress={() => handlePress(sub)}
                activeOpacity={0.7}
              >
                <Text style={styles.subMenuText}>{sub.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        </View>
      ))}
    </LinearGradient>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: undefined,
    paddingTop: 0,
    paddingHorizontal: 0,
    marginTop: 64, // Header yüksekliği kadar boşluk bırak
  },
  menuHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0ecff',
    borderBottomWidth: 1.5,
    borderColor: '#dbeafe',
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 2,
  },
  menuLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  menuHeaderText: {
    fontSize: 22,
    color: '#232946',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#22223b',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 28,
  },
  menuText: {
    color: '#232946',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subMenuContainer: {
    backgroundColor: '#e0ecff',
    marginLeft: 0,
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 6,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 2,
  },
  subMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  subMenuText: {
    color: '#3d5a80',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
    textAlign: 'center',
    letterSpacing: 0.3,
    width: '100%',
  },
});

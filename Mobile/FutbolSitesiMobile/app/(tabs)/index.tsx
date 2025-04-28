import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#0d1b2a", "#1b263b"]}
      style={styles.container}
    >
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/images/giris/grisLogo.png')}
          style={styles.headerLogo}
        />
        <Text style={styles.headerTitle}>Futbolum</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.header}>Futbol Sitesine Hoş Geldiniz!</Text>
        <Text style={styles.desc}>Burada Premier ligini takip edebilirsiniz.</Text>
        <View style={styles.leagueButtons}>
          <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/premier-league')} activeOpacity={0.1}>
            <Image
              source={{ uri: 'https://w7.pngwing.com/pngs/127/860/png-transparent-premier-league-logo-thumbnail.png' }}
              style={styles.leagueImage}
            />
            <Text style={styles.leagueText}>İngiltere Premier Ligi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36, // status bar için boşluk
    paddingBottom: 12,
    backgroundColor: 'rgba(13,27,42,0.95)',
  },
  headerLogo: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    color: '#ffd700',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    fontSize: 32,
    color: '#ffd700',
    textShadowColor: '#222',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    marginTop: 32,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  desc: {
    textAlign: 'center',
    fontSize: 18,
    color: '#e0e1dd',
    marginVertical: 12,
  },
  leagueButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  leagueButton: {
    width: width * 0.7,
    backgroundColor: '#22223b',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#2ec4b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  leagueImage: {
    width: 180,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  leagueText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#ffd700',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: '#222',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});


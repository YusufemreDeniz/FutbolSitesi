import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#f8fafc", "#e0ecff", "#fff", "#f1f5ff"]}
      style={styles.container}
    >
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/images/giris/grisLogo.png')}
          style={styles.headerLogo}
        />

      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <Text style={styles.header}>Futbol Sitesine Hoş Geldiniz!</Text>
        <Text style={styles.desc}>Burada Ligleri takip edebilirsiniz.</Text>
        <View style={styles.leagueButtons}>
  <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/PremierLig/premier-league')} activeOpacity={0.1}>
    <Image
      source={{ uri: 'https://w7.pngwing.com/pngs/127/860/png-transparent-premier-league-logo-thumbnail.png' }}
      style={styles.leagueImage}
      resizeMode="contain"
    />
    <Text style={styles.leagueText}>Premier Lig</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/FransaLig/fransa-league')} activeOpacity={0.1}>
    <Image
      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Ligue1_Uber_Eats_logo.png' }}
      style={styles.leagueImage}
      resizeMode="contain"
    />
    <Text style={styles.leagueText}>Ligue 1</Text>
  </TouchableOpacity>
    <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/AlmanyaLig/germany-league')} activeOpacity={0.1}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/tr/d/d9/Bundesliga_2017_logo.png' }}
        style={styles.leagueImage}
        resizeMode="contain"
      />
      <Text style={styles.leagueText}>Bundesliga</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/TurkiyeLig/turkiye-league')} activeOpacity={0.1}>
      <Image
        source={{ uri: 'https://cdn1.ntv.com.tr/gorsel/Qs0dISJB0kiYPuprGcNoYw.jpg?width=1060&height=795&mode=crop&scale=both&v=1722462810435&meta=square' }}
        style={styles.leagueImage}
        resizeMode="contain"
      />
      <Text style={styles.leagueText}>Süper Lig</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.leagueButton} onPress={() => router.push('/(tabs)/ItalyaLig/italy-league')} activeOpacity={0.1}>
      <Image
        source={{ uri: 'https://brandlogos.net/wp-content/uploads/2025/02/serie_a-logo_brandlogos.net_kmz4e.png' }}
        style={styles.leagueImage}
        resizeMode="contain"
      />
      <Text style={styles.leagueText}>Serie A</Text>
    </TouchableOpacity>
</View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  homeLogoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0ecff',
    borderRadius: 18,
    marginTop: 28,
    marginBottom: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 2,
  },
  homeLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  homeLogoText: {
    fontSize: 22,
    color: '#232946',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36, // status bar için boşluk
    paddingBottom: 12,
    backgroundColor: 'rgba(232,240,255,0.85)',
    borderBottomWidth: 1.5,
    borderColor: '#e0ecff',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 1,
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
    color: '#232946',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    fontSize: 32,
    color: '#232946',
    textShadowColor: '#b6c6e6',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 7,
    marginTop: 40,
    letterSpacing: 2,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  desc: {
    textAlign: 'center',
    fontSize: 18,
    color: '#5f6c7b',
    marginVertical: 12,
    letterSpacing: 0.5,
  },
  leagueButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 40,
  },
  leagueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f8fc',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.2,
    borderColor: '#e0ecff',
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


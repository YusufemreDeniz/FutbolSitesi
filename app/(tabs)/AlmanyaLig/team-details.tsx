import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamDetailsScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) return;
    const fetchTeam = async () => {
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/teams?id=${teamId}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        setTeam(json.response[0]);
      } catch (e) {
        setError('Takım bilgisi alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  if (loading) return <ActivityIndicator size="large" color="#ffd700" style={{ flex: 1, marginTop: 40 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  if (!team) return null;
  const { team: teamInfo, venue } = team;

  // Takım ana rengi ve logo
  const teamColor = (teamInfo.colors && teamInfo.colors.primary) || '#ffd700';
  return (
    <LinearGradient
      colors={['#e0ecff', '#fff']}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Image
        source={{ uri: teamInfo.logo }}
        style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          width: '100%',
          height: 440,
          opacity: 0.08,
          resizeMode: 'contain',
          zIndex: 0,
          // blur effect için overlay veya başka bir yöntem gerekebilir, basic opacity ile bırakıyoruz.
        }}
      />
      <ScrollView contentContainerStyle={[styles.container, { minHeight: '100%' }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      }}>
        <Text style={styles.backButtonText}>← Geri</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Takım Detayları</Text>
      <Image source={{ uri: teamInfo.logo }} style={styles.logo} />
      <Text style={styles.name}>{teamInfo.name}</Text>
      <Text style={styles.country}>{teamInfo.country}</Text>
      <Text style={styles.founded}>Kuruluş: {teamInfo.founded}</Text>
      <Text style={styles.code}>Kısaltma: {teamInfo.code}</Text>
      {teamInfo.national ? (
        <Text style={[styles.national, { backgroundColor: '#ffd70020', color: '#ffd700', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'center', marginTop: 6, fontWeight: 'bold'}]}>Milli Takım</Text>
      ) : (
        <Text style={[styles.national, styles.badge]}>Kulüp Takımı</Text>
      )}

      {/* Venue Bilgileri */}
      {venue && (
        <View style={styles.venueContainer}>
          <Text style={styles.venueHeader}>Stadyum Bilgileri</Text>
          <Image source={{ uri: venue.image }} style={styles.venueImage} />
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.venueDetail}>Adres: {venue.address}</Text>
          <Text style={styles.venueDetail}>Şehir: {venue.city}</Text>
          <Text style={styles.venueDetail}>Kapasite: {venue.capacity}</Text>
          <Text style={styles.venueDetail}>Zemin: {venue.surface}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modernButton, { borderColor: (teamInfo.colors && teamInfo.colors.primary) || '#5fa8d3' }]}
          onPress={() => router.push({ pathname: '../../(tabs)/PremierLig/team-squad', params: { teamId: teamInfo.id, season: 2024 } })}
        >
          <LinearGradient
            colors={[(teamInfo.colors && teamInfo.colors.primary) || '#5fa8d3', 'rgba(255,255,255,0.7)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, { color: (teamInfo.colors && teamInfo.colors.primaryDark) || '#22223b' }]}>Takım Kadrosu</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modernButton, { borderColor: (teamInfo.colors && teamInfo.colors.primary) || '#5fa8d3' }]}
          onPress={() => router.push({ pathname: '../../(tabs)/PremierLig/team-fixtures', params: { teamId: teamInfo.id } })}
        >
          <LinearGradient
            colors={[(teamInfo.colors && teamInfo.colors.primary) || '#5fa8d3', 'rgba(255,255,255,0.7)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, { color: (teamInfo.colors && teamInfo.colors.primaryDark) || '#22223b' }]}>Fikstür</Text>
          </LinearGradient>
        </TouchableOpacity> 
      </View> 
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 22,
    marginBottom: 14,
    marginTop: 6,
    marginLeft: 2,
    elevation: 2,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  backButtonText: {
    color: '#22223b',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#ffd700',
    color: '#22223b',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'center',
    marginTop: 6,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  pageTitle: {
    fontSize: 36,
    color: '#22223b',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 16,
    letterSpacing: 1,
  },
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
    flexGrow: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain',
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 30,
    color: '#22223b',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  country: {
    fontSize: 20,
    color: '#444',
    marginBottom: 4,
  },
  founded: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
  },
  code: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
  },
  national: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
    gap: 14,
    flexDirection: 'column',
  },
  modernButton: {
    width: '90%',
    borderRadius: 22,
    marginBottom: 0,
    elevation: 4,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.45)',
    // glassmorphism efekti için arka plan şeffaf
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
    // color dinamik olarak atanıyor
  },


  venueContainer: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  venueHeader: {
    fontSize: 22,
    color: '#22223b',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  venueImage: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  venueName: {
    fontSize: 18,
    color: '#22223b',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  venueDetail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
});

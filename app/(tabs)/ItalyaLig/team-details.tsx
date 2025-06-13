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
		          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
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
        <View style={styles.venueContainer}>
          <Text style={styles.venueHeader}>Stadyum Bilgileri</Text>
          {venue ? (
            <>
              {venue.image ? (
                <Image source={{ uri: venue.image }} style={styles.venueImage} />
              ) : null}
              <Text style={styles.venueName}>{venue.name || 'Bilgi yok'}</Text>
              <Text style={styles.venueDetail}>Adres: {venue.address || 'Bilgi yok'}</Text>
              <Text style={styles.venueDetail}>Şehir: {venue.city || 'Bilgi yok'}</Text>
              <Text style={styles.venueDetail}>Kapasite: {venue.capacity || 'Bilgi yok'}</Text>
              <Text style={styles.venueDetail}>Zemin: {venue.surface || 'Bilgi yok'}</Text>
            </>
          ) : (
            <Text style={styles.venueDetail}>Stadyum bilgisi bulunamadı.</Text>
          )}
        </View>
        {/* Takım Kadrosu ve Fikstürler Butonları */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.modernButton, { borderColor: teamColor }]}
            onPress={() => router.push({ pathname: '../../(tabs)/ItalyaLig/team-squad', params: { teamId: teamInfo.id, season: 2024 } })}
          >
            <LinearGradient
              colors={[teamColor, 'rgba(255,255,255,0.7)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, { color: '#22223b' }]}>Takım Kadrosu</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.modernButton, { borderColor: teamColor }]}
            onPress={() => router.push({ pathname: '../../(tabs)/ItalyaLig/team-fixtures', params: { teamId: teamInfo.id } })}
          >
            <LinearGradient
              colors={[teamColor, 'rgba(255,255,255,0.7)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, { color: '#22223b' }]}>Fikstürler</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 22,
    marginBottom: 12,
  },
  backButtonText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 22,
    color: '#232946',
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: 1,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginVertical: 18,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 8,
    textAlign: 'center',
  },
  country: {
    fontSize: 18,
    color: '#007bff',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  founded: {
    fontSize: 16,
    color: '#232946',
    marginBottom: 2,
    textAlign: 'center',
  },
  code: {
    fontSize: 15,
    color: '#232946',
    marginBottom: 2,
    textAlign: 'center',
  },
  national: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#e0ecff',
    color: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'center',
    marginTop: 6,
    fontWeight: 'bold',
  },
  venueContainer: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 2,
    alignItems: 'center',
    width: '100%',
  },
  venueHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 7,
  },
  venueImage: {
    width: 120,
    height: 70,
    borderRadius: 10,
    marginBottom: 7,
    resizeMode: 'cover',
    backgroundColor: '#e0ecff',
  },
  venueName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 3,
    textAlign: 'center',
  },
  venueDetail: {
    fontSize: 15,
    color: '#232946',
    textAlign: 'center',
    marginBottom: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  modernButton: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 7,
    elevation: 2,
  },
  buttonGradient: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232946',
  },
});

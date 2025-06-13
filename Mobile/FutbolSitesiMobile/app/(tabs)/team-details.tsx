import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Takım Detayları</Text>
      <Image source={{ uri: teamInfo.logo }} style={styles.logo} />
      <Text style={styles.name}>{teamInfo.name}</Text>
      <Text style={styles.country}>{teamInfo.country}</Text>
      <Text style={styles.founded}>Kuruluş: {teamInfo.founded}</Text>
      <Text style={styles.code}>Kısaltma: {teamInfo.code}</Text>
      <Text style={styles.national}>{teamInfo.national ? 'Milli Takım' : 'Kulüp Takımı'}</Text>

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
      <View style={{ marginTop: 28, width: '100%', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#ffd700', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}
          onPress={() => router.push({ pathname: '/(tabs)/team-squad', params: { teamId: teamInfo.id, season: 2024 } })}
        >
          <Text style={{ color: '#22223b', fontWeight: 'bold', fontSize: 18 }}>Takım Kadrosu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 32,
    color: '#ffd700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 16,
    letterSpacing: 1,
  },
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0d1b2a',
    flexGrow: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 28,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  country: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  founded: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 4,
  },
  code: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 4,
  },
  national: {
    fontSize: 16,
    color: '#2ec4b6',
    marginBottom: 4,
  },
  venueContainer: {
    marginTop: 32,
    backgroundColor: '#1b263b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  venueHeader: {
    fontSize: 20,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 12,
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
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueDetail: {
    fontSize: 15,
    color: '#aaa',
    marginBottom: 2,
  },
});

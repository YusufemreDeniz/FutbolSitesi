import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FransaTeamFixturesScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    if (!teamId) return;
    const fetchFixtures = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&season=2024`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
          },
        };
        const response = await fetch(url, options);
        const json = await response.json();
        if (!json.response || !Array.isArray(json.response) || json.response.length === 0) {
          console.log('API yanıtı:', json);
        }
        setFixtures(json.response || []);
      } catch (e) {
        setError('Fikstür bilgisi alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [teamId]);

  useEffect(() => {
    if (!teamId) return;
    const fetchTeam = async () => {
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/teams?team=${teamId}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        setTeam(json.response[0] || {});
      } catch (e) {
        // ignore
      }
    };
    fetchTeam();
  }, [teamId]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={{ flex: 1, marginTop: 40 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;

  return (
    <LinearGradient
      colors={['#f8fafc', '#e0ecff', '#fff', '#f1f5ff']}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      {/* Soft büyük logo arka plan için */}
      {team && team.team && team.team.logo && (
        <Image
          source={{ uri: team.team.logo }}
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
      )}
      <TouchableOpacity style={backButtonStyles.backButton} activeOpacity={0.8} onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      }}>
        <Text style={backButtonStyles.backButtonText}>← Geri</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>{team?.team?.name || 'Takım Fikstürü'}</Text>
        {fixtures.length === 0 && <Text style={{ color: '#232946', marginTop: 20 }}>Fikstür bulunamadı.</Text>}
        {fixtures.map((fixture: any) => {
          const home = fixture.teams?.home || fixture.home;
          const away = fixture.teams?.away || fixture.away;
          const dateStr = fixture.fixture?.date ? new Date(fixture.fixture.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
          const timeStr = fixture.fixture?.date ? new Date(fixture.fixture.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-';
          return (
            <LinearGradient
              key={fixture.fixture?.id || fixture.id}
              colors={['#f1f5ff', '#e0ecff']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.fixtureCard}
            >
              <Text style={styles.league}>{fixture.league?.name || '-'} ({fixture.league?.round || '-'})</Text>
              <Text style={styles.date}>{dateStr} {timeStr}</Text>
              <Text style={styles.teams}>{home?.name} <Text style={styles.vs}>vs</Text> {away?.name}</Text>
              <Text style={styles.score}>{fixture.goals?.home ?? '-'} - {fixture.goals?.away ?? '-'}</Text>
              <Text style={styles.status}>{fixture.fixture?.status?.long ?? ''}</Text>
            </LinearGradient>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pageTitle: {
    fontSize: 26,
    color: '#232946',
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
  },
  fixtureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#232946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 7,
    elevation: 2,
    alignItems: 'center',
  },
  league: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    alignSelf: 'center',
  },
  date: {
    color: '#232946',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 2,
    alignSelf: 'center',
  },
  teams: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    alignSelf: 'center',
  },
  vs: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 4,
  },
  score: {
    fontSize: 20,
    color: '#232946',
    fontWeight: 'bold',
    marginVertical: 4,
    alignSelf: 'center',
  },
  status: {
    fontSize: 14,
    color: '#5f6c7b',
    marginTop: 2,
    alignSelf: 'center',
  },
});

const backButtonStyles = StyleSheet.create({
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
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamFixturesScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    if (!teamId) return;
    const fetchFixtures = async () => {
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2024&team=${teamId}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
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
        console.error(e);
      }
    };
    fetchTeam();
  }, [teamId]);

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
      <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/PremierLig/player-details');
        }
      }}>
        <Text style={styles.backButtonText}>← Geri</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        {fixtures.map((fixture: any) => (
          <LinearGradient
            key={fixture.fixture.id}
            colors={['#f1f5ff', '#e0ecff']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.fixtureCard}
          >
            <Text style={styles.league}>{fixture.league.name} ({fixture.league.round})</Text>
            <Text style={styles.date}>{new Date(fixture.fixture.date).toLocaleString('tr-TR')}</Text>
            <Text style={styles.teams}>{fixture.teams.home.name} <Text style={styles.vs}>vs</Text> {fixture.teams.away.name}</Text>
            <Text style={styles.score}>{fixture.goals.home} - {fixture.goals.away}</Text>
            <Text style={styles.status}>{fixture.fixture.status.long}</Text>
          </LinearGradient>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(248,250,252,0.7)', // #f8fafc
    minHeight: '100%',
    alignItems: 'center',
  },
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
  pageTitle: {
    color: '#ffd700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fixtureCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.2,
    borderColor: '#e0ecff',
    flexDirection: 'column',
  },
  vs: {
    color: '#b6c6e6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  league: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  date: {
    color: '#5f6c7b',
    fontSize: 15,
    marginBottom: 4,
  },
  teams: {
    color: '#232946',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  score: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  status: {
    color: '#5f6c7b',
    fontSize: 14,
    fontWeight: '500',
  },
});

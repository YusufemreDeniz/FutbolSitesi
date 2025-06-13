import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamFixturesScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [fixtures, setFixtures] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!teamId) return;
    const fetchFixtures = async () => {
      setLoading(true);
      setError('');
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
        setError('Fikstür bilgileri alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [teamId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#38598b" />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 32 }}>{error}</Text>;

  return (
    <LinearGradient colors={["#f8fafc", "#e0ecff", "#fff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={styles.header}>Fikstürler</Text>
        {fixtures.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#232946', marginTop: 24 }}>Fikstür bulunamadı.</Text>
        )}
        {fixtures.map((fixture: any) => (
          <View key={fixture.fixture.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: fixture.teams.home.logo }} style={styles.logo} />
              <Text style={styles.teamName}>{fixture.teams.home.name}</Text>
              <Text style={styles.score}>{fixture.goals.home ?? '-'} - {fixture.goals.away ?? '-'}</Text>
              <Text style={styles.teamName}>{fixture.teams.away.name}</Text>
              <Image source={{ uri: fixture.teams.away.logo }} style={styles.logo} />
            </View>
            <Text style={styles.date}>{new Date(fixture.fixture.date).toLocaleString('tr-TR')}</Text>
            <Text style={styles.league}>{fixture.league.name}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f4f8ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#7da0c4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  logo: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginHorizontal: 4,
  },
  teamName: {
    fontSize: 15,
    color: '#232946',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38598b',
    minWidth: 44,
    textAlign: 'center',
  },
  date: {
    color: '#38598b',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  league: {
    color: '#7da0c4',
    fontSize: 13,
    marginTop: 1,
    textAlign: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamFixturesScreen() {
  const params = useLocalSearchParams();
  const teamId = params.teamId;
  const leagueId = params.leagueId;
  const router = useRouter();
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    if (!teamId) return;
    const fetchFixtures = async () => {
      try {
        // Serie A için lig ID'si 135'tir.
        let url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2024&team=${teamId}`;
        if (leagueId) {
          url += `&league=${leagueId}`;
        }
        const response = await fetch(
          url,
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
        setTeam(json.response[0] || {});
      } catch (e) {
        console.error(e);
      }
    };
    fetchTeam();
  }, [teamId]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</Text>;

  return (
    <LinearGradient
      colors={['#f8fafc', '#e0ecff', '#fff', '#f1f5ff']}
      style={{ flex: 1 }}
    >
      {team && team.team && team.team.logo && (
        <Image
          source={{ uri: team.team.logo }}
          style={styles.backgroundImage}
        />
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{team?.team?.name} Fikstürü</Text>
        {fixtures.length > 0 ? fixtures.map((fixture: any) => (
          <View key={fixture.fixture.id} style={styles.fixtureCard}>
            <Text style={styles.league}>{fixture.league.name} - {fixture.league.round}</Text>
            <Text style={styles.date}>{new Date(fixture.fixture.date).toLocaleString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
            <View style={styles.teamsContainer}>
                <Image source={{ uri: fixture.teams.home.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{fixture.teams.home.name}</Text>
                <Text style={styles.score}>{fixture.goals.home} - {fixture.goals.away}</Text>
                <Text style={styles.teamName}>{fixture.teams.away.name}</Text>
                <Image source={{ uri: fixture.teams.away.logo }} style={styles.teamLogo} />
            </View>
            <Text style={styles.status}>{fixture.fixture.status.long}</Text>
          </View>
        )) : <Text>Fikstür bulunamadı.</Text>}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 30,
    },
    backgroundImage: {
        position: 'absolute',
        top: '20%',
        width: '100%',
        height: 300,
        opacity: 0.07,
        resizeMode: 'contain',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    backButtonText: {
        color: '#232946',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#232946',
        textAlign: 'center',
        marginBottom: 20,
    },
    fixtureCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    league: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007bff',
        textAlign: 'center',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    teamLogo: {
        width: 40,
        height: 40,
    },
    teamName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#232946',
        textAlign: 'center',
    },
    score: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#232946',
        marginHorizontal: 16,
    },
    status: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
});
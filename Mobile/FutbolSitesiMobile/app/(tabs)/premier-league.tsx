import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function PremierLeagueScreen() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          'https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        setStandings(json.response[0].league.standings[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return (
    <LinearGradient colors={["#0d1b2a", "#1b263b"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.header}>Premier Lig Puan Durumu</Text>
        {loading ? (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Yükleniyor...</Text>
        ) : (
          <View style={{ margin: 16 }}>
            {standings.map((team, idx) => (
  <TouchableOpacity
    key={team.team.id}
    onPress={() => router.push({ pathname: '/(tabs)/team-details', params: { teamId: team.team.id } })}
    activeOpacity={0.7}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: idx % 2 === 0 ? '#22223b' : '#1b263b',
      padding: 8,
      borderRadius: 8,
      marginBottom: 4,
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#ffd700', width: 30 }}>{team.rank}</Text>
    <Text style={{ color: '#fff', flex: 1 }}>{team.team.name}</Text>
    <Text style={{ color: '#2ec4b6', width: 40, textAlign: 'right' }}>{team.points}</Text>
  </TouchableOpacity>
))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
});

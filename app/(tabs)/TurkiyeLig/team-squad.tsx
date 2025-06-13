import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamSquadScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) return;
    const fetchSquad = async () => {
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${teamId}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        if (
          json.response &&
          Array.isArray(json.response) &&
          json.response[0] &&
          Array.isArray(json.response[0].players)
        ) {
          setPlayers(json.response[0].players);
        } else {
          setError('Kadro verisi bulunamadı!');
        }
      } catch (e) {
        setError('Kadro verisi alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchSquad();
  }, [teamId]);

  return (
    <LinearGradient colors={["#f8fafc", "#e0ecff", "#fff", "#f1f5ff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Takım Kadrosu</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : (
          players.length > 0 ? (
            players.map((player: any) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '../../(tabs)/TurkiyeLig/player-details', params: { playerId: player.id } })}
              >
                <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerInfo}>Pozisyon: {player.position}</Text>
                  <Text style={styles.playerInfo}>Forma No: {player.number || '-'}</Text>
                  <Text style={styles.playerInfo}>Yaş: {player.age}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: '#232946', textAlign: 'center', marginTop: 40 }}>Kadroda oyuncu bulunamadı.</Text>
          )
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 22,
    marginBottom: 14,
  },
  backButtonText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    color: '#232946',
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 6,
    letterSpacing: 1,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 2,
  },
  playerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#e0ecff',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 2,
  },
  playerInfo: {
    fontSize: 15,
    color: '#007bff',
    marginBottom: 1,
  },
});

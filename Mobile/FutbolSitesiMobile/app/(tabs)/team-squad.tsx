import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
        let playerList = [];
        if (json.response && Array.isArray(json.response) && json.response[0] && Array.isArray(json.response[0].players)) {
          playerList = json.response[0].players;
        }
        if (playerList.length === 0) {
          setError('Oyuncu bulunamadı. Yanıt: ' + JSON.stringify(json));
        } else {
          setPlayers(playerList);
        }
      } catch (e) {
        setError('Kadroyu alırken hata oluştu!');
      } finally {
        setLoading(false);
      }
    };
    fetchSquad();
  }, [teamId]);

  if (loading) return <ActivityIndicator size="large" color="#ffd700" style={{ flex: 1, marginTop: 40 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Takım Kadrosu</Text>
      {players.length === 0 ? (
        <Text style={{ color: '#fff', marginTop: 20 }}>Kadro bulunamadı.</Text>
      ) : (
        players.map((item, idx) => {
          const name = item.name || item.player || (item.player && item.player.name) || '-';
          const number = item.number || (item.player && item.player.number) || '-';
          return (
            <TouchableOpacity
              key={name + number + idx}
              style={styles.playerCard}
              onPress={() => router.push({ pathname: '/(tabs)/player-details', params: { player: JSON.stringify(item) } })}
            >
              <Text style={[styles.playerName, { flex: 1, textAlign: 'left' }]}>{name}</Text>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{number}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1b2a',
    padding: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 18,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#1b263b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberBox: {
    backgroundColor: '#ffd700',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },
  numberText: {
    color: '#22223b',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  playerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  playerName: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    color: '#fff',
    fontSize: 14,
  },
});

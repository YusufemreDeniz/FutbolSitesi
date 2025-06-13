import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeamSquadScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<any>(null);

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
        if (json.response && Array.isArray(json.response) && json.response[0] && json.response[0].team) {
          setTeam(json.response[0].team);
        }
      } catch (e) {
        // Takım bilgisi alınamadıysa sessiz geç
      }
    };
    fetchTeam();
  }, [teamId]);

  if (loading) return <ActivityIndicator size="large" color="#ffd700" style={{ flex: 1, marginTop: 40 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;

  return (
    <LinearGradient colors={["#f8fafc", "#e0ecff", "#fff", "#f1f5ff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        {team && (
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Image source={{ uri: team.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{team.name}</Text>
          </View>
        )}
        <Text style={styles.header}>Takım Kadrosu</Text>
        {players.length === 0 ? (
          <Text style={{ color: '#232946', textAlign: 'center', marginTop: 20 }}>Kadroyu görüntüleyemedik.</Text>
        ) : (
          players.map((player, idx) => (
            <View key={player.id || idx} style={[styles.playerCard, idx % 2 === 0 ? styles.cardEven : styles.cardOdd]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {player.photo && (
                  <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
                )}
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerInfo}>Pozisyon: <Text style={{ fontWeight: 'bold' }}>{player.position}</Text></Text>
                  <Text style={styles.playerInfo}>Forma No: <Text style={{ fontWeight: 'bold' }}>{player.number || '-'}</Text></Text>
                  <Text style={styles.playerInfo}>Yaş: <Text style={{ fontWeight: 'bold' }}>{player.age || '-'}</Text></Text>
                  <Text style={styles.playerInfo}>Uyruk: <Text style={{ fontWeight: 'bold' }}>{player.nationality || '-'}</Text></Text>
                </View>
              </View>
            </View>
          ))
        )}
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
  teamLogo: {
    width: 70,
    height: 70,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#e0ecff',
  },
  teamName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 8,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    color: '#232946',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 1,
  },
  playerCard: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#232946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  cardEven: {
    backgroundColor: '#f8fafc',
  },
  cardOdd: {
    backgroundColor: '#e0ecff',
  },
  playerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ecff',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 2,
  },
  playerInfo: {
    fontSize: 14,
    color: '#444',
    marginBottom: 1,
  },
});

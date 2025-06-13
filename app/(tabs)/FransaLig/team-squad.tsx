import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FransaTeamSquadScreen() {
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
      colors={['#e0ecff', '#fff']}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Soft büyük logo arka plan için */}
      {team && team.team && team.team.logo && (
        <Image
          source={{ uri: team.team.logo }}
          style={{
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            width: '100%',
            height: 280,
            opacity: 0.09,
            resizeMode: 'contain',
            zIndex: 0,
          }}
        />
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Takım Kadrosu</Text>
        {team && team.team && (
          <View style={styles.teamHeader}>
            <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{team.team.name}</Text>
          </View>
        )}
        {players.map((player: any) => (
          <TouchableOpacity
            key={player.id}
            style={styles.playerCard}
            onPress={() => router.push({ pathname: '../../(tabs)/FransaLig/player-details', params: { playerId: player.id } })}
          >
            <View style={styles.playerInfo}>
              <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
              <View style={styles.playerText}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <Text style={styles.playerAge}>Yaş: {player.age}</Text>
                <Text style={styles.playerNumber}>Forma: {player.number}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#e0ecff',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginBottom: 16,
    marginTop: 10,
  },
  backButtonText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pageTitle: {
    fontSize: 26,
    color: '#232946',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  teamName: {
    fontSize: 21,
    color: '#232946',
    fontWeight: 'bold',
  },
  playerCard: {
    width: '97%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#232946',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    padding: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#f6f6f6',
  },
  playerText: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#232946',
  },
  playerPosition: {
    fontSize: 15,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  playerAge: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  playerNumber: {
    fontSize: 14,
    color: '#606060',
    marginTop: 2,
  },
});

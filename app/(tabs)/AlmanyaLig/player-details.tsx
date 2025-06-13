import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlayerDetailsScreen() {
  const router = useRouter();
  const { playerId } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [playerData, setPlayerData] = React.useState<any>(null);

  React.useEffect(() => {
    if (!playerId) {
      setLoading(false);
      setError('Oyuncu ID bulunamadı! Lütfen tekrar deneyin.');
      return;
    }
    const fetchPlayer = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/players?id=${playerId}&season=2024`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        if (json.response && json.response.length > 0) {
          setPlayerData(json.response[0]);
        } else {
          setError('Oyuncu bulunamadı.');
        }
      } catch (e) {
        setError('Oyuncu bilgisi alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [playerId]);

  if (loading) return <Text style={{ color: '#ffd700', textAlign: 'center', marginTop: 40 }}>Yükleniyor...</Text>;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  if (!playerData) return null;

  const { player, statistics } = playerData;
  const stats = statistics && statistics[0] ? statistics[0] : {};
  const team = stats.team || {};
  const league = stats.league || {};
  const games = stats.games || {};
  const goals = stats.goals || {};
  const assists = goals.assists ?? stats.goals.assists;
  const cards = stats.cards || {};
  const passes = stats.passes || {};

  return (
    <LinearGradient colors={["#f8fafc", "#e0ecff", "#fff", "#f1f5ff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.headerBox}>
          <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerInfo}>{player.nationality} | {player.age} yaş | {player.height} | {player.weight}</Text>
        </View>
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Kulüp Bilgisi</Text>
          <View style={styles.teamRow}>
            <Image source={{ uri: team.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{team.name}</Text>
          </View>
          <Text style={styles.leagueName}>{league.name} ({league.season})</Text>
        </View>
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Maç & İstatistik</Text>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Oynadığı Maç</Text><Text style={styles.statValue}>{games.appearences ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>İlk 11</Text><Text style={styles.statValue}>{games.lineups ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Gol</Text><Text style={styles.statValue}>{goals.total ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Asist</Text><Text style={styles.statValue}>{assists ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Sarı Kart</Text><Text style={styles.statValue}>{cards.yellow ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Kırmızı Kart</Text><Text style={styles.statValue}>{cards.red ?? '-'}</Text></View>
          <View style={styles.statsRow}><Text style={styles.statLabel}>Pas Başarı (%)</Text><Text style={styles.statValue}>{passes.accuracy ?? '-'}</Text></View>
        </View>
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
  headerBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  playerPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ecff',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 2,
    textAlign: 'center',
  },
  playerInfo: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
    textAlign: 'center',
  },
  sectionBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#232946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ecff',
    marginRight: 8,
  },
  teamName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#232946',
  },
  leagueName: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 15,
    color: '#232946',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

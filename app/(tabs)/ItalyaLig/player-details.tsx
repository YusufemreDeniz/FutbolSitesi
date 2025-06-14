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
  let stats: any = {};
  let team: any = {};
  let league: any = {};
  let games: any = {};
  let goals: any = {};
  let assists: any = '-';
  let cards: any = {};
  let passes: any = {};
  let tackles: any = {};
  let duels: any = {};
  let dribbles: any = {};

  if (statistics && Array.isArray(statistics) && statistics.length > 0) {
    const serieAStat = statistics.find(
      (s: any) => (s.league && (s.league.id === 135 || s.league.name === 'Serie A'))
    );
    stats = serieAStat || statistics[0];
    team = stats.team || {};
    league = stats.league || {};
    games = stats.games || {};
    goals = stats.goals || {};
    assists = goals.assists ?? stats.goals?.assists ?? '-';
    cards = stats.cards || {};
    passes = stats.passes || {};
    tackles = stats.tackles || {};
    duels = stats.duels || {};
    dribbles = stats.dribbles || {};
  }

  return (
    <LinearGradient
      colors={['#f8fafc', '#e0ecff', '#fff', '#f1f5ff']}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      {player && player.team && player.team.logo && (
        <Image
          source={{ uri: player.team.logo }}
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
      <ScrollView contentContainerStyle={[viewStyles.container, { flexGrow: 1, paddingBottom: 40 }]}> 
        <TouchableOpacity style={statsTableStyles.backButton} activeOpacity={0.8} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('../../(tabs)');
          }
        }}>
          <Text style={statsTableStyles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <View style={profileCardStyles.profileCard}>
          <View style={profileCardStyles.photoContainer}>
            <Image
              source={{ uri: player.photo }}
              style={profileCardStyles.profilePhoto}
              resizeMode="cover"
            />
          </View>
          <Text style={profileCardStyles.playerName}>{player.name}</Text>
          <View style={profileCardStyles.infoTableBox}>
            {[ 
              { label: 'Yaş', value: player.age ?? '-' },
              { label: 'Doğum Yeri', value: player.birth?.place ?? '-' },
              { label: 'Uyruk', value: player.nationality ?? '-' },
              { label: 'Boy', value: player.height ?? '-' },
              { label: 'Kilo', value: player.weight ?? '-' },
              { label: 'Pozisyon', value: games.position ?? stats.position ?? '-' },
              { label: 'Takım', value: team.name ?? '-' },
              { label: 'Lig', value: league.name ?? '-' },
            ].map((row, idx) => (
              <View key={row.label} style={[profileCardStyles.infoTableRow, idx % 2 === 0 ? profileCardStyles.infoTableRowEven : profileCardStyles.infoTableRowOdd]}>
                <Text style={profileCardStyles.infoTableCellLabel}>{row.label}</Text>
                <Text style={profileCardStyles.infoTableCellValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      {(statistics && Array.isArray(statistics) && statistics.length > 0 && stats && Object.keys(stats).length > 0) ? (
        <>
          <Text style={{fontWeight:'bold', fontSize:18, marginTop:24, marginBottom:10}}>İstatistikler</Text>
          <View style={{
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 32,
            alignSelf: 'center',
            width: '100%',
            maxWidth: 420,
            minWidth: 260,
            backgroundColor: '#f8fbff',
            shadowColor: '#7da0c4',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.13,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <LinearGradient
              colors={['#b6c6e6', '#e0ecff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flexDirection: 'row' }}
            >
              <Text style={{ flex: 1, fontWeight: 'bold', padding: 12, borderRightWidth: 1, borderRightColor: '#e0e0e0', textAlign: 'left', color: '#232946', fontSize: 16 }}>İstatistik</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', padding: 12, textAlign: 'right', color: '#232946', fontSize: 16 }}>Değer</Text>
            </LinearGradient>
            {[
              { label: 'Maç', value: games?.appearences ?? '-' },
              { label: 'İlk 11', value: games?.lineups ?? '-' },
              { label: 'Dakika', value: games?.minutes ?? '-' },
              { label: 'Gol', value: goals?.total ?? '-' },
              { label: 'Asist', value: assists ?? '-' },
              { label: 'Sarı Kart', value: cards?.yellow ?? '-' },
              { label: 'Kırmızı Kart', value: cards?.red ?? '-' },
              { label: 'Şut', value: stats?.shots?.total ?? '-' },
              { label: 'İsabetli Şut', value: stats?.shots?.on ?? '-' },
              { label: 'Pas', value: passes?.total ?? '-' },
              { label: 'Anahtar Pas', value: passes?.key ?? '-' },
              { label: 'Pas İsabeti', value: passes?.accuracy ?? '-' },
              { label: 'Top Çalma', value: tackles?.total ?? '-' },
              { label: 'Blok', value: tackles?.blocks ?? '-' },
            ].map((row, idx, arr) => (
              <View key={row.label} style={{
                flexDirection: 'row',
                backgroundColor: idx % 2 === 0 ? '#f4f8ff' : '#eaf1fb',
                borderBottomWidth: idx !== arr.length - 1 ? 1 : 0,
                borderBottomColor: '#dde6f3',
                alignItems: 'center',
              }}>
                <Text style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRightWidth: 1, borderRightColor: '#e0e0e0', textAlign: 'left', color: '#232946', fontSize: 15 }}>{row.label}</Text>
                <Text style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, textAlign: 'right', color: '#38598b', fontWeight: 'bold', fontSize: 15 }}>{row.value}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const viewStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

const profileCardStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#6a85a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0ecff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  playerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 16,
  },
  infoTableBox: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1e0f0',
  },
  infoTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoTableRowEven: {
    backgroundColor: '#f7faff',
  },
  infoTableRowOdd: {
    backgroundColor: '#ffffff',
  },
  infoTableCellLabel: {
    fontSize: 16,
    color: '#5c6a7e',
    fontWeight: '500',
  },
  infoTableCellValue: {
    fontSize: 16,
    color: '#232946',
    fontWeight: '600',
  },
});

const statsTableStyles = StyleSheet.create({
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
});

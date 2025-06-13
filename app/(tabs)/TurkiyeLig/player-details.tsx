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
  // Süper Lig istatistiğini bul, yoksa ilkini kullan
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
    // Süper Lig id:203 veya adı "Süper Lig"
    const superLigStat = statistics.find(
      (s: any) => (s.league && (s.league.id === 203 || s.league.name === 'Süper Lig'))
    );
    stats = superLigStat || statistics[0];
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
      {/* Soft büyük logo arka plan için */}
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
            {/* Header */}
            <View style={{ flexDirection: 'row', backgroundColor: 'linear-gradient(90deg, #b6c6e6 0%, #e0ecff 100%)', backgroundColor: '#b6c6e6' }}>
              <Text style={{ flex: 1, fontWeight: 'bold', padding: 12, borderRightWidth: 1, borderRightColor: '#e0e0e0', textAlign: 'left', color: '#232946', fontSize: 16 }}>İstatistik</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', padding: 12, textAlign: 'right', color: '#232946', fontSize: 16 }}>Değer</Text>
            </View>
            {/* Rows */}
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
    padding: 18,
    alignItems: 'center',
    paddingBottom: 40,
  },
});

const statsTableStyles = StyleSheet.create({
  statsSectionTitleBox: {
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 7,
    marginTop: 24,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 1,
  },
  statsSectionTitle: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.7,
    textAlign: 'center',
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
  statsTableBox: {
    backgroundColor: '#f9fafc',
    borderRadius: 16,
    padding: 0,
    marginTop: 10,
    marginBottom: 18,
    borderWidth: 1.2,
    borderColor: '#e0ecff',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 1,
    overflow: 'hidden',
  },
  statsTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0ecff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  statsTableHeaderText: {
    flex: 1,
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  statsTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  statsTableRowEven: {
    backgroundColor: '#f9fafc',
  },
  statsTableRowOdd: {
    backgroundColor: '#e7effc',
  },
  statsTableCellLabel: {
    flex: 1,
    color: '#22223b',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  statsTableCellValue: {
    flex: 1,
    color: '#232946',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const profileCardStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#f4f8fc',
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
    marginTop: 2,
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    width: '100%',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: '#e0ecff',
    borderWidth: 2,
    borderColor: '#e0ecff',
    marginBottom: 6,
  },
  playerName: {
    fontSize: 24,
    color: '#232946',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  infoTableBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    marginTop: 2,
    marginBottom: 2,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#e0ecff',
    shadowColor: '#b6c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 1,
  },
  infoTableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  infoTableRowEven: {
    backgroundColor: '#f9fafc',
  },
  infoTableRowOdd: {
    backgroundColor: '#e7effc',
  },
  infoTableCellLabel: {
    flex: 1,
    color: '#22223b',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  infoTableCellValue: {
    flex: 1,
    color: '#232946',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

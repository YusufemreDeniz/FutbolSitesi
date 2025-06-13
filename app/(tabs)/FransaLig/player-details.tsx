import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FransaPlayerDetailsScreen() {
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
    const fetchData = async () => {
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
    fetchData();
  }, [playerId]);

  if (loading) return <Text style={{ color: '#007bff', textAlign: 'center', marginTop: 40 }}>Yükleniyor...</Text>;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  if (!playerData) return null;

  // Profil ve istatistikleri ayıkla
  const player = playerData.player || {};
  const stats = playerData.statistics && playerData.statistics[0] ? playerData.statistics[0] : {};
  const team = stats.team || {};
  const league = stats.league || {};
  const games = stats.games || {};
  const goals = stats.goals || {};
  const assists = goals.assists ?? stats.goals?.assists;
  const cards = stats.cards || {};
  const passes = stats.passes || {};
  const tackles = stats.tackles || {};
  const duels = stats.duels || {};
  const dribbles = stats.dribbles || {};

  return (
    <LinearGradient
      colors={['#f8fafc', '#e0ecff', '#fff', '#f1f5ff']}
      style={{ flex: 1 }}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      {/* Soft büyük logo arka plan için */}
      {team.logo && (
        <Image
          source={{ uri: team.logo }}
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
        <TouchableOpacity style={backButtonStyles.backButton} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }}>
          <Text style={backButtonStyles.backButtonText}>← Geri</Text>
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
        {/* İstatistikler */}
        {stats && (
          <View style={statsTableStyles.statsTableBox}>
            <Text style={statsTableStyles.sectionTitle}>2024 Sezonu İstatistikleri</Text>
            <View style={statsTableStyles.tableHeaderRow}>
              <Text style={statsTableStyles.tableHeaderCell}>İstatistik</Text>
              <Text style={statsTableStyles.tableHeaderCell}>Değer</Text>
            </View>
            {[
              { label: 'Maç', value: games.appearences ?? '-' },
              { label: 'İlk 11', value: games.lineups ?? '-' },
              { label: 'Gol', value: goals.total ?? '-' },
              { label: 'Asist', value: assists ?? '-' },
              { label: 'Sarı Kart', value: cards.yellow ?? '-' },
              { label: 'Kırmızı Kart', value: cards.red ?? '-' },
              { label: 'Pas Başarı', value: passes.accuracy ?? '-' },
              { label: 'Top Çalma', value: tackles.total ?? '-' },
              { label: 'Çalım', value: dribbles.success ?? '-' },
            ].map((row, idx) => (
              <View
                key={row.label}
                style={[
                  statsTableStyles.tableRow,
                  idx % 2 === 0 ? statsTableStyles.tableRowEven : statsTableStyles.tableRowOdd,
                ]}
              >
                <Text style={statsTableStyles.tableCellLabel}>{row.label}</Text>
                <Text style={statsTableStyles.tableCellValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Premier Lig ile aynı stiller kullanılacak
const profileCardStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#232946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 7,
    elevation: 2,
    width: '100%',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    marginBottom: 10,
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
    backgroundColor: '#f8fafc',
  },
  infoTableRowOdd: {
    backgroundColor: '#e7effc',
  },
  infoTableCellLabel: {
    flex: 1,
    color: '#5f6c7b',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  infoTableCellValue: {
    flex: 1,
    color: '#232946',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

const statsTableStyles = StyleSheet.create({
  statsTableBox: {
    backgroundColor: '#f9fafc',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#e0ecff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 14,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e0ecff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableRowOdd: {
    backgroundColor: '#e7effc',
  },
  tableCellLabel: {
    flex: 1,
    color: '#232946',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
    paddingLeft: 2,
  },
  tableCellValue: {
    flex: 1,
    color: '#007bff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 2,
  },
});

const backButtonStyles = StyleSheet.create({
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
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});

const viewStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(248,250,252,0.7)', // #f8fafc
    padding: 20,
  },
});

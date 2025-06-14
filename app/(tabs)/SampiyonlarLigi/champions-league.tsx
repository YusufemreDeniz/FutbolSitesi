import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChampionsLeagueScreen() {
  const [standings, setStandings] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          'https://api-football-v1.p.rapidapi.com/v3/standings?league=2&season=2024',
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
          json.response[0].league &&
          Array.isArray(json.response[0].league.standings)
        ) {
          setStandings(json.response[0].league.standings);
        } else {
          setStandings([]);
          setError('Puan durumu verisi bulunamadı!');
        }
      } catch (error) {
        setError('Puan durumu alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const renderGroup = (group: any[]) => {
    const groupName = group[0]?.group || 'Grup';
    return (
      <View key={groupName} style={styles.groupContainer}>
        <Text style={styles.groupHeader}>{groupName}</Text>
        <View style={styles.tableHeaderBox}>
          <Text style={styles.tableHeaderCell}>#</Text>
          <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Takım</Text>
          <Text style={styles.tableHeaderCell}>O</Text>
          <Text style={styles.tableHeaderCell}>G</Text>
          <Text style={styles.tableHeaderCell}>B</Text>
          <Text style={styles.tableHeaderCell}>M</Text>
          <Text style={styles.tableHeaderCell}>P</Text>
        </View>
        {group.map((team, idx) => (
          <View
            key={team.team.id}
            style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
          >
            <Text style={styles.tableCell}>{idx + 1}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{team.team.name}</Text>
            <Text style={styles.tableCell}>{team.all.played}</Text>
            <Text style={styles.tableCell}>{team.all.win}</Text>
            <Text style={styles.tableCell}>{team.all.draw}</Text>
            <Text style={styles.tableCell}>{team.all.lose}</Text>
            <Text style={styles.tableCell}>{team.points}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapers.com/images/hd/uefa-champions-league-gold-logo-nuy5svc1tjvqkw1q.jpg' }}
      style={styles.backgroundImage}
      resizeMode="contain"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Şampiyonlar Ligi Puan Durumu</Text>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => router.push('/(tabs)/SampiyonlarLigi/group-fixtures')}
        >
          <LinearGradient
            colors={['#304ffe', '#00c6fb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fixturesButtonGradient}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.fixturesButtonIcon}>⚽</Text>
              <Text style={styles.fixturesButtonText}>Fikstürler</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</Text>
        ) : (
          standings.map(group => renderGroup(group))
        )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101828', // fallback for empty space
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,20,40,0.82)', // darker for readability
  },
  fixturesButtonGradient: {
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 38,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 5,
  },
  fixturesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 1,
    marginLeft: 7,
  },
  fixturesButtonIcon: {
    fontSize: 22,
    marginRight: 4,
    color: '#fff',
  },
  container: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 22,
    letterSpacing: 1.2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  groupContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  tableHeaderBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  tableRowEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tableRowOdd: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#f1f5f9',
    textAlign: 'center',
  },
});

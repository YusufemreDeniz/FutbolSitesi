import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function TurkiyeLeagueScreen() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          'https://api-football-v1.p.rapidapi.com/v3/standings?league=135&season=2024',
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
          Array.isArray(json.response[0].league.standings) &&
          json.response[0].league.standings[0]
        ) {
          setStandings(json.response[0].league.standings[0]);
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

  return (
    <LinearGradient colors={["#f8fafc", "#e0ecff", "#fff", "#f1f5ff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Serie A Puan Durumu</Text>   
        <View style={styles.tableHeaderBox}>
          <Text style={styles.tableHeaderCell}>#</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Takım</Text>
          <Text style={styles.tableHeaderCell}>O</Text>
          <Text style={styles.tableHeaderCell}>G</Text>
          <Text style={styles.tableHeaderCell}>B</Text>
          <Text style={styles.tableHeaderCell}>M</Text>
          <Text style={styles.tableHeaderCell}>A</Text>
          <Text style={styles.tableHeaderCell}>Y</Text>
          <Text style={styles.tableHeaderCell}>Av</Text>
          <Text style={styles.tableHeaderCell}>P</Text>
        </View>
        {loading ? (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Yükleniyor...</Text>
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <View style={{ margin: 16 }}>
            {standings.map((team, idx) => (
              <TouchableOpacity
                key={team.team.id}
                onPress={() => router.push({ pathname: '/(tabs)/ItalyaLig/team-details' as const, params: { teamId: team.team.id } })}
                activeOpacity={0.8}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}
              >
                <Text style={styles.tableCell}>{team.rank}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{team.team.name}</Text>
                <Text style={styles.tableCell}>{team.all.played}</Text>
                <Text style={styles.tableCell}>{team.all.win}</Text>
                <Text style={styles.tableCell}>{team.all.draw}</Text>
                <Text style={styles.tableCell}>{team.all.lose}</Text>
                <Text style={styles.tableCell}>{team.all.goals.for}</Text>
                <Text style={styles.tableCell}>{team.all.goals.against}</Text>
                <Text style={styles.tableCell}>{team.goalsDiff}</Text>
                <Text style={styles.tableCell}>{team.points}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
    marginTop: 12,
    letterSpacing: 1,
  },
  tableHeaderBox: {
    flexDirection: 'row',
    backgroundColor: '#e0ecff',
    borderRadius: 8,
    marginBottom: 6,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    marginBottom: 4,
    paddingVertical: 7,
    paddingHorizontal: 2,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableRowOdd: {
    backgroundColor: '#e0ecff',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    margin: 4,
  },
});

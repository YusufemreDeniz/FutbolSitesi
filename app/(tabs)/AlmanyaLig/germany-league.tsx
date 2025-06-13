import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function GermanyLeagueScreen() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          'https://api-football-v1.p.rapidapi.com/v3/standings?league=78&season=2024',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        setStandings(json.response[0].league.standings[0]);
      } catch (error) {
        console.error(error);
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
        <Text style={styles.header}>Almanya Bundesliga Puan Durumu</Text>
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
        ) : (
          <View style={{ margin: 16 }}>
            {standings.map((team, idx) => (
              <TouchableOpacity
                key={team.team.id}
                onPress={() => router.push({ pathname: '/(tabs)/AlmanyaLig/team-details', params: { teamId: team.team.id } })}
                activeOpacity={0.8}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}
              >
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.rank}</Text>
                <Text style={[styles.tableCell, { flex: 2, fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'left', margin: 4 }]}>{team.team.name}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.played}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.win}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.draw}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.lose}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.goals.for}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.all.goals.against}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.goalsDiff}</Text>
                <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', margin: 4 }]}>{team.points}</Text>
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
    fontSize: 28,
    color: '#232946',
    marginTop: 16,
    marginBottom: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  tableHeaderBox: {
    flexDirection: 'row',
    backgroundColor: '#e0ecff',
    borderRadius: 10,
    paddingVertical: 7,
    marginHorizontal: 8,
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  tableHeaderCell: {
    flex: 1,
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginBottom: 3,
    backgroundColor: '#f8fafc',
    elevation: 1,
  },
  tableRowEven: {
    backgroundColor: '#f1f5ff',
  },
  tableRowOdd: {
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    color: '#232946',
    fontSize: 15,
    textAlign: 'center',
  },
});

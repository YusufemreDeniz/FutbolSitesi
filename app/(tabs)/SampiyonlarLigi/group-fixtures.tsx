import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const STAGES = [
  { label: '1. Hafta', type: 'week', value: 1 },
  { label: '2. Hafta', type: 'week', value: 2 },
  { label: '3. Hafta', type: 'week', value: 3 },
  { label: '4. Hafta', type: 'week', value: 4 },
  { label: '5. Hafta', type: 'week', value: 5 },
  { label: '6. Hafta', type: 'week', value: 6 },
  { label: '7. Hafta', type: 'week', value: 7 },
  { label: '8. Hafta', type: 'week', value: 8 },
  { label: 'Eleme Turu', type: 'round', value: 'Play-offs' },
  { label: 'Son 16 Turu', type: 'round', value: 'Round of 16' },
  { label: 'Çeyrek Final', type: 'round', value: 'Quarter-finals' },
  { label: 'Yarı Final', type: 'round', value: 'Semi-finals' },
  { label: 'Final', type: 'round', value: 'Final' },
];
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChampionsLeagueGroupFixtures() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch(
          'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=2&season=2024',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const json = await response.json();
        setFixtures(json.response || []);
      } catch (e) {
        setError('Fikstürler alınamadı!');
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, []);

  // Get fixtures for selected stage (week or knockout round)
  const getStageFixtures = (stageIdx: number) => {
    const stage = STAGES[stageIdx];
    if (!stage) return [];
    if (stage.type === 'week') {
      return fixtures.filter(fix => {
        const round = fix.league.round;
        return round && (round.endsWith(`- ${stage.value}`) || round.endsWith(`- ${stage.value}.`));
      });
    } else if (stage.type === 'round') {
      return fixtures.filter(fix => {
        const round = fix.league.round;
        if (!round) return false;
        const isPlayoff =
          (typeof stage.value === 'string' && round.toLowerCase().includes(stage.value.toLowerCase())) ||
          (typeof stage.label === 'string' && round.toLowerCase().includes(stage.label.toLowerCase()));
        if (stage.value === 'Play-offs') {
          // Only include fixtures in February
          const date = new Date(fix.fixture.date);
          return isPlayoff && date.getMonth() === 1; // 0=Jan, 1=Feb
        }
        return isPlayoff;
      });
    }
    return [];
  };

  return (
    <LinearGradient colors={['#f8fafc', '#e0ecff', '#fff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Şampiyonlar Ligi Grup Maçları Fikstürü</Text>
        <View style={styles.arrowWeekContainer}>
          <TouchableOpacity
            onPress={() => setSelectedStage(selectedStage - 1)}
            disabled={selectedStage === 0}
            style={[styles.arrowButton, selectedStage === 0 && styles.arrowButtonDisabled]}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.weekLabel}>{STAGES[selectedStage].label}</Text>
          <TouchableOpacity
            onPress={() => setSelectedStage(selectedStage + 1)}
            disabled={selectedStage === STAGES.length - 1}
            style={[styles.arrowButton, selectedStage === STAGES.length - 1 && styles.arrowButtonDisabled]}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#232946" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginTop: 30 }}>{error}</Text>
        ) : (
          <ScrollView horizontal pagingEnabled style={{ width: SCREEN_WIDTH }}>
            <View style={{ width: SCREEN_WIDTH }}>
              {getStageFixtures(selectedStage).length > 0 ? getStageFixtures(selectedStage).map(fix => (
                <View key={fix.fixture.id} style={styles.fixtureCard}>
                  <Text style={styles.fixtureDate}>{new Date(fix.fixture.date).toLocaleString('tr-TR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</Text>
                  <View style={styles.teamsRow}>
                    <Text style={styles.teamName}>{fix.teams.home.name}</Text>
                    <Text style={styles.score}>{fix.goals.home} - {fix.goals.away}</Text>
                    <Text style={styles.teamName}>{fix.teams.away.name}</Text>
                  </View>
                  <Text style={styles.status}>{fix.fixture.status.long}</Text>
                </View>
              )) : <Text style={{ marginTop: 20, textAlign: 'center' }}>Bu aşamada maç yok.</Text>}
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 30,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 18,
    textAlign: 'center',
  },
  arrowWeekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  arrowButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#e0ecff',
    marginHorizontal: 16,
    opacity: 1,
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 28,
    color: '#232946',
    fontWeight: 'bold',
  },
  weekLabel: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#232946',
    marginHorizontal: 10,
    minWidth: 90,
    textAlign: 'center',
  },
  fixtureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: Dimensions.get('window').width - 32,
    alignSelf: 'center',
  },
  fixtureDate: {
    fontSize: 15,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    color: '#232946',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#232946',
    marginHorizontal: 12,
  },
  status: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  weekTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  weekTab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#e0ecff',
    marginHorizontal: 6,
    marginBottom: 8,
  },
  weekTabSelected: {
    backgroundColor: '#232946',
  },
  weekTabText: {
    color: '#232946',
    fontWeight: 'bold',
    fontSize: 15,
  },
  weekTabTextSelected: {
    color: '#fff',
  },
});

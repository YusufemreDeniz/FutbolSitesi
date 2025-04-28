import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PlayerDetailsScreen() {
  const { player } = useLocalSearchParams();
  let playerObj = null;
  try {
    playerObj = player ? JSON.parse(player as string) : null;
  } catch (e) {
    playerObj = null;
  }

  if (!playerObj) return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Oyuncu bulunamadı veya veri hatalı.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Oyuncu Bilgileri</Text>
      {playerObj.photo && (
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <Image source={{ uri: playerObj.photo }} style={styles.playerPhoto} />
        </View>
      )}
      <Text style={styles.header}>{playerObj.name || playerObj.player || '-'}</Text>
      <View style={styles.detailRow}><Text style={styles.label}>Yaş:</Text><Text style={styles.value}>{playerObj.age ?? '-'}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Pozisyon:</Text><Text style={styles.value}>{playerObj.position ?? '-'}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Forma No:</Text>
        <View style={styles.numberBox}><Text style={styles.numberText}>{playerObj.number ?? '-'}</Text></View>
      </View>
    </ScrollView>
  );
}


import { Image } from 'react-native';

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 32,
    color: '#ffd700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 16,
    letterSpacing: 1,
  },
  container: {
    backgroundColor: '#0d1b2a',
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 18,
  },
  playerPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  numberBox: {
    backgroundColor: '#ffd700',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
    marginLeft: 8,
  },
  numberText: {
    color: '#22223b',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

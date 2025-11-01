import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Kustom */}
      <LeaderboardHeader />

      {/* Konten Daftar */}
      <View style={styles.content}>
        <LeaderboardList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Latar belakang header
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Latar belakang abu-abu untuk daftar
  },
});
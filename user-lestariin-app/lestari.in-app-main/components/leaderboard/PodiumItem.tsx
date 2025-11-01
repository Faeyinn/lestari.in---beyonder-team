import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  xp?: number;
  points?: number;
  badge: any;
}

interface PodiumItemProps {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
}

const rankColors = {
  1: '#D4F1E3', // Emas/Hijau Muda
  2: '#D6EDF8', // Perak/Biru Muda
  3: '#F5E6D3', // Perunggu/Coklat Muda
};

const textColors = {
  1: '#1E4D3E',
  2: '#1E3A4D',
  3: '#4D3E1E',
};

export const PodiumItem: React.FC<PodiumItemProps> = ({ entry, rank }) => {
  const value = entry.points ?? entry.xp ?? 0;
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: rankColors[rank] },
        rank === 1 && styles.firstPlace,
        rank === 3 && styles.thirdPlace,
      ]}
    >
      <View style={styles.rankInfo}>
        <Text style={[styles.rank, { color: textColors[rank] }]}>
          {entry.rank}.
        </Text>
        <Text style={[styles.name, { color: textColors[rank] }]}>
          {entry.name}
        </Text>
      </View>
      <View style={styles.xpInfo}>
        <Text style={[styles.xp, { color: textColors[rank] }]}>
          {value} XP
        </Text>
        {entry.badge ? (
          <Image source={entry.badge} style={styles.badge} resizeMode="contain" />
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  firstPlace: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  thirdPlace: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  xpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
    width: 28,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    flexShrink: 1,
    paddingRight: 8,
  },
  xp: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  badge: {
    width: 32,
    height: 32,
  },
});
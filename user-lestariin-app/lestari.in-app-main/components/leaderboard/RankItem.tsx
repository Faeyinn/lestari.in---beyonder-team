import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  xp?: number;
  points?: number;
  badge: any;
}

interface RankItemProps {
  entry: LeaderboardEntry;
  index: number;
}

export const RankItem: React.FC<RankItemProps> = ({ entry, index }) => {
  const value = entry.points ?? entry.xp ?? 0;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400)}
      style={styles.container}
    >
      <View style={styles.rankInfo}>
        <Text style={styles.rank}>{entry.rank}.</Text>
        <Text style={styles.name}>{entry.name}</Text>
      </View>
      <View style={styles.xpInfo}>
        <Text style={styles.xp}>{value} XP</Text>
        {entry.badge ? <Image source={entry.badge} style={styles.badge} resizeMode="contain" /> : null}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
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
    fontWeight: '600',
    color: '#374151',
    width: 28,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flexShrink: 1,
    paddingRight: 8,
  },
  xp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  badge: {
    width: 32,
    height: 32,
  },
});
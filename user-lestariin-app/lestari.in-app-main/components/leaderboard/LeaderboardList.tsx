import { apiService } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PodiumItem } from './PodiumItem';
import { RankItem } from './RankItem';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number; // Assuming points instead of xp
  badge?: string; // Optional, if API provides
}

export const LeaderboardList = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalPoints, setTotalPoints] = useState<number>(0);

  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getLeaderboard();
      console.log('Leaderboard data:', response.data);

      // Support various response shapes: array, { results: [] }, { data: [] }
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : raw.results ?? raw.data ?? [];

      // Heuristic: if items already represent users (have points/xp at top level or user.points), keep them.
      // Otherwise, assume items are per-report entries and aggregate points per user.
      const first = list[0];
      let data: LeaderboardEntry[] = [];

      const looksLikeUserLevel = !!(first && (first.points !== undefined || first.xp !== undefined || first.user?.points !== undefined || first.rank !== undefined));

      if (!looksLikeUserLevel) {
        // Aggregate per user
        const map = new Map<string, { id: string; name: string; points: number; badge?: string }>();
        (list as any[]).forEach((item: any) => {
          const user = item.user ?? item.reporter ?? item.owner ?? null;
          const uid = user?.id?.toString() || user?.user_id?.toString() || user?.uuid?.toString();
          const name = user?.name || user?.username || user?.full_name || 'Unknown';
          const pts = Number(item.points ?? item.xp ?? user?.points ?? 0) || 0;
          if (!uid) return; // skip items without user identifier
          const prev = map.get(uid) ?? { id: uid, name, points: 0, badge: user?.badge };
          prev.points = (prev.points || 0) + pts;
          map.set(uid, prev);
        });

        data = Array.from(map.values()).map((v) => ({ id: v.id, rank: 0, name: v.name, points: v.points, badge: v.badge }));
        // sort by points desc and assign ranks
        data.sort((a, b) => b.points - a.points);
        data = data.map((d, i) => ({ ...d, rank: i + 1 }));
      } else {
        // Already user-level entries
        data = (list as any[]).map((item: any, index: number) => ({
          id: item.id?.toString() || item.user?.id?.toString() || index.toString(),
          rank: item.rank || item.position || index + 1,
          name: item.name || item.user?.name || 'Unknown',
          points: item.points ?? item.xp ?? item.user?.points ?? 0,
          badge: item.badge || item.user?.badge,
        }));
      }

      setLeaderboardData(data);
      // compute total points across leaderboard entries
      const total = data.reduce((acc, cur) => acc + (cur.points || 0), 0);
      setTotalPoints(total);
    } catch (error: any) {
      console.error('Leaderboard fetch error:', error);
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5F4F" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchLeaderboard();
          }}
          tintColor="#2D5F4F"
        />
      }
    >
      {/* Total points summary */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Poin</Text>
        <Text style={styles.totalValue}>{totalPoints}</Text>
      </View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.listContainer}>
        {leaderboardData.map((item, index) => {
          // Untuk rank 1-3 gunakan PodiumItem agar tampil beda, sisanya RankItem
          if (item.rank === 1 || item.rank === 2 || item.rank === 3) {
            return <PodiumItem key={item.id} entry={item as any} rank={item.rank as 1 | 2 | 3} />;
          }
          return <RankItem key={item.id} entry={item as any} index={index} />;
        })}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  listContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  totalContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D5F4F',
  },
});

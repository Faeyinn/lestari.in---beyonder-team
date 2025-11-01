import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LeaderboardHeader = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 12) }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Leaderboard</Text>
      <View style={styles.placeholder} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2D5F4F', // diubah jadi hijau
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF', // teks putih untuk kontras
  },
  placeholder: {
    width: 40,
  },
});
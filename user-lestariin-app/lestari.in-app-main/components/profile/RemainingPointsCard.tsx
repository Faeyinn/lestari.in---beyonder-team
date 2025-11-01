import { apiService } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface RemainingPointsCardProps {
  points: number;
  onExchangePress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const RemainingPointsCard: React.FC<RemainingPointsCardProps> = ({
  points,
  onExchangePress,
}) => {
  const scale = useSharedValue(1);

  const [localPoints, setLocalPoints] = useState<number | null>(
    typeof points === 'number' ? points : null
  );
  const [loading, setLoading] = useState<boolean>(false);

  // If parent doesn't provide points, fetch from backend
  useEffect(() => {
    let mounted = true;
    const loadPoints = async () => {
      if (typeof points === 'number') return; // parent provided
      setLoading(true);
      try {
        const p = await apiService.getPoints();
        if (mounted) setLocalPoints(p);
      } catch (err) {
        console.warn('Failed to load points in RemainingPointsCard', err);
        if (mounted) setLocalPoints(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadPoints();
    return () => {
      mounted = false;
    };
  }, [points]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Poin Tersisa</Text>

        <View style={styles.pointsContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#2D5F4F" />
          ) : (
            <>
              <Text style={styles.pointsValue}>{typeof points === 'number' ? points : localPoints ?? 0}</Text>
              <Text style={styles.pointsLabel}>XP</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.exchangeButton}
          activeOpacity={0.8}
          onPress={onExchangePress}
        >
          <Text style={styles.exchangeButtonText}>Tukar Poin</Text>
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    height: 130, // sama tinggi dengan summary card
    width: '100%',
  },
  content: {
    padding: 12,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 30,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: -2,
  },
  exchangeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D5F4F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exchangeButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D5F4F',
  },
});
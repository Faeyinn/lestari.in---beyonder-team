import { useRouter } from 'expo-router'; // added import
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PointsCardProps {
  points: number;
  maxPoints: number;
  onExchangePress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PointsCard: React.FC<PointsCardProps> = ({ points, maxPoints, onExchangePress }) => {
  const scale = useSharedValue(1);
  const router = useRouter(); // use router

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // navigate to /tukar-poin when pressing Tukar Poin
  const handleExchange = () => {
    if (onExchangePress) {
      try { onExchangePress(); } catch {}
    }
    router.push('/tukar-poin');
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
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>XP</Text>
        </View>
        
        <TouchableOpacity style={styles.exchangeButton} activeOpacity={0.8} onPress={handleExchange}>
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
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  content: {
    padding: 14,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 34,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: -2,
  },
  maxPointsContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  maxPoints: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
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
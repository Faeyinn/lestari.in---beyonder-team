import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const badges = [
  { id: 1, image: require('@/assets/images/badge-1.png') },
  { id: 2, image: require('@/assets/images/badge-2.png') },
  { id: 3, image: require('@/assets/images/badge-3.png') },
  { id: 4, image: require('@/assets/images/badge-4.png') },
];

interface BadgeItemProps {
  badge: { id: number; image: any };
  index: number;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, index }) => {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(index * 100, withSpring(1));
  }, []);

  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * pressScale.value }],
    };
  });

  const handlePressIn = () => {
    pressScale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.badgeItem}>
          <Image
            source={badge.image}
            style={styles.badgeIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const BadgeAchievements: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Badge Achievements</Text>
      <View style={styles.badgesContainer}>
        {badges.map((badge, index) => (
          <BadgeItem key={badge.id} badge={badge} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    alignItems: 'center',
  },
  badgeItem: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 52,
    height: 52,
  },
});
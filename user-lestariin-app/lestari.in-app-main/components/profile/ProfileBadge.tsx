import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const ProfileBadge: React.FC = () => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Animasi mengambang
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>

      {/* Lingkaran Badge */}
      <View style={styles.badgeCircle}>
        <Animated.View style={[styles.badgeInner, animatedStyle]}>
          <Image
            source={require('@/assets/images/badge-4.png')}
            style={styles.badgeImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -50,
    zIndex: 50,
  },
  tag: {
    backgroundColor: '#9DE0A5', // Warna hijau muda
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: -22, // Tumpang tindih dengan badge
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  badgeCircle: {
    width: 140, // Sedikit lebih besar
    height: 140,
    borderRadius: 70,
    backgroundColor: '#D4F1E3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  badgeInner: {
    width: 120, // Lebih besar
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: 110, // Lebih besar
    height: 110,
  },
});

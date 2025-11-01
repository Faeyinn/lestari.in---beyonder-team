import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SaveButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  animationDelay?: number;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  title,
  onPress,
  loading = false,
  animationDelay = 0,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay).duration(600)}>
      <AnimatedTouchable
        style={[styles.button, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </AnimatedTouchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52, // Sedikit lebih pendek sesuai desain
    borderRadius: 12, // Kurang bulat dibanding login button
    backgroundColor: '#2D5F4F', // Warna hijau tua
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D5F4F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginHorizontal: 32, // Memberi margin horizontal
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
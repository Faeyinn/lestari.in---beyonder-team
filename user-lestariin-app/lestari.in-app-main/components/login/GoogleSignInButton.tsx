import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface GoogleSignInButtonProps {
  onPress: () => void;
  signUp?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ubah path jika file ikon ditempatkan di lokasi lain
const googleIcon = require('@/assets/images/google-icon.png');

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onPress, signUp = false }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        <Image source={googleIcon} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.buttonText}>
        {signUp ? 'Sign Up with Google' : 'Sign In with Google'}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
  },
  googleIconTextFallback: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
});
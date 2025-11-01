import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';

interface FormInputProps extends TextInputProps {
  label: string;
  animationDelay?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  animationDelay = 0,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Animasi border saat fokus
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused ? '#2D5F4F' : '#D1D5DB', {
      duration: 200,
    }),
    borderWidth: withTiming(isFocused ? 1.5 : 1, {
      duration: 200,
    }),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).duration(600)}
      style={styles.container}
    >
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '400',
  },
});
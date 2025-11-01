import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface LestarChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const LestarChatInput: React.FC<LestarChatInputProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Ketik Sesuatu"
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
      </View>

      <AnimatedTouchable
        style={[styles.sendButton, animatedStyle]}
        onPress={handleSend}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={!value.trim()}
      >
        <View
          style={[
            styles.sendButtonInner,
            !value.trim() && styles.sendButtonDisabled,
          ]}
        >
          <Ionicons
            name="send"
            size={22}
            color="#FFFFFF"
            style={styles.sendIcon}
          />
        </View>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  sendButton: {
    marginBottom: 0,
  },
  sendButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D5F4F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  sendIcon: {
    marginLeft: 2,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FormPickerProps {
  label: string;
  value: string;
  onPress: () => void;
  animationDelay?: number;
}

export const FormPicker: React.FC<FormPickerProps> = ({
  label,
  value,
  onPress,
  animationDelay = 0,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).duration(600)}
      style={styles.container}
    >
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.pickerValue}>{value}</Text>
        <Ionicons name="chevron-down" size={22} color="#4B5563" />
      </TouchableOpacity>
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
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pickerValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '400',
  },
});
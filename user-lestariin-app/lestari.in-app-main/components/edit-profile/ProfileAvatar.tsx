import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AVATAR_SIZE = 140;

export const ProfileAvatar = () => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600)}
      style={styles.container}
    >
      {/* Lingkaran Avatar */}
      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={80} color="#9CA3AF" />
      </View>

      {/* Tombol Edit */}
      <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
        <Ionicons name="pencil" size={24} color="#4B5563" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -AVATAR_SIZE / 2, // Tumpang tindih dengan header
    marginBottom: 32,
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E5E7EB', // Latar belakang placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F3F4F6', // Border untuk memisahkan dari background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: (Platform.OS === 'ios' ? '30%' : '28%'), // Posisi di kanan bawah avatar
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
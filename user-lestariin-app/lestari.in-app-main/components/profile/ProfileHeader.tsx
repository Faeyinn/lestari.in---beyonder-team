import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

interface ProfileHeaderProps {
  name: string;
  city: string;
  email: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  city,
  email,
  avatarUrl,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">{email}</Text>
      </View>

      {/* Avatar Ikon */}
      <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Animated.Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={26} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingTop: Platform.OS === 'ios' ? 36 : 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // keep vertical centering
  },
  infoContainer: {
    flexShrink: 1,
    paddingRight: 8,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    lineHeight: 20, // beri lebih banyak line-height agar tidak terkompres
  },
  city: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  avatarContainer: {
    marginLeft: 8,
  },
  avatar: {
    width: 48, // kecilkan sedikit agar memberi ruang lebih ke teks
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Tinggi header mirip dengan ProfileScreen untuk konsistensi
const HEADER_HEIGHT = 240;

export const EditProfileHeader = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(600)}
      style={styles.header}
    >
      {/* Latar belakang gradient melengkung */}
      <LinearGradient
        colors={['#4A9D6F', '#2D5F4F']}
        style={styles.gradient}
      />

      {/* Konten Header (Tombol kembali & Judul) */}
      <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <View style={styles.placeholder} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    position: 'relative',
    backgroundColor: '#F3F4F6', // Warna latar belakang utama
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 6,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    transform: [{ scaleX: 1.3 }], // Efek lengkung seperti di profile.tsx
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
});
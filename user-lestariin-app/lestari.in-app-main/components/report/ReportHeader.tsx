import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ReportHeaderProps {
  onBackPress: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#73A997', '#4A9D6F']} // Gradien dari atas ke bawah
        style={styles.gradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Laporkan Kondisi Lingkungan</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>
      {/* Elemen ini menciptakan lekukan */}
      <View style={styles.curve} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F7FBF8', // Warna latar belakang halaman di bawahnya
  },
  gradient: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 30, // Memberi ruang untuk lekukan
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40, // Untuk menyeimbangkan judul di tengah
  },
  curve: {
    height: 20,
    backgroundColor: '#4A9D6F', // Warna solid di bawah gradien
    // Lekukan dibuat dengan radius besar
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -2, // Sedikit tumpang tindih untuk menghindari celah
  },
});
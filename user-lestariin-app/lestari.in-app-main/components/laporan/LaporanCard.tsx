import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Tipe Status untuk pewarnaan
type ReportStatus = 'Diverifikasi' | 'Menunggu Verifikasi' | 'Selesai' | 'Ditolak';

export interface Report {
  id: string;
  category: string;
  labels: string[];
  location: string;
  description: string;
  author: string;
  date: string;
  image: string;
  status: ReportStatus; // Menambahkan status
}

interface LaporanCardProps {
  report: Report;
  onPress?: () => void;
}

// Fungsi untuk mendapatkan warna berdasarkan status
const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case 'Diverifikasi':
      return '#22C55E'; // Hijau
    case 'Menunggu Verifikasi':
      return '#F59E0B'; // Kuning/Orange
    case 'Selesai':
      return '#3B82F6'; // Biru (atau bisa diganti hijau)
    case 'Ditolak':
      return '#EF4444'; // Merah
    default:
      return '#6B7280'; // Abu-abu
  }
};

// Fungsi untuk mendapatkan warna label
const getLabelColor = (label: string) => {
  if (label.includes('Kebakaran') || label.includes('Ilegal') || label.includes('Banyak')) {
    return { bg: '#FEE2E2', text: '#DC2626' }; // Merah
  }
  if (label.includes('Anorganik') || label.includes('Air Keruh')) {
    return { bg: '#FEF3C7', text: '#D97706' }; // Kuning
  }
  return { bg: '#E0E7FF', text: '#4F46E5' }; // Default
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const LaporanCard: React.FC<LaporanCardProps> = ({ report, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
    >
      <View style={styles.card}>
        {/* Gambar di Kiri */}
        <Image
          source={{ uri: report.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Konten di Kanan */}
        <View style={styles.content}>
          {/* Baris Atas: Status, Author, Date */}
          <View style={styles.headerRow}>
            {report.status && (
              <View style={[styles.statusContainer]}>
                <Text style={styles.fieldLabel}>Status</Text>
                <Text style={styles.colon}>:</Text>
                <Text
                  style={[styles.statusText, { color: getStatusColor(report.status) }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {report.status}
                </Text>
              </View>
            )}
            <View style={styles.authorDateContainer}>
              <Text style={styles.authorText}>{report.author}</Text>
              <Text style={styles.dateText}>{report.date}</Text>
            </View>
          </View>

          {/* Kategori */}
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Kategori</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.categoryText}>{report.category}</Text>
          </View>

          {/* Label */}
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Label</Text>
            <Text style={styles.colon}>:</Text>
            <View style={styles.labelsContainer}>
              {report.labels.map((label, index) => {
                const colors = getLabelColor(label);
                return (
                  <View
                    key={index}
                    style={[
                      styles.labelBadge,
                      { backgroundColor: colors.bg },
                    ]}
                  >
                    <Text style={[styles.labelText, { color: colors.text }]}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Lokasi */}
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Lokasi</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.locationText}>{report.location}</Text>
          </View>

          {/* Deskripsi */}
          <View style={styles.descriptionRow}>
            <Text style={styles.fieldLabel}>Deskripsi</Text>
          </View>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {report.description}
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: 110,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 14,
  },
  authorDateContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    flexShrink: 0,
  },
  authorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateText: {
    fontSize: 9,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  descriptionRow: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    width: 60, // Lebar tetap untuk perataan
  },
  colon: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706', // Warna orange untuk kategori
    flexShrink: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  labelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
    flexShrink: 1,
  },
  descriptionText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 16,
  },
});

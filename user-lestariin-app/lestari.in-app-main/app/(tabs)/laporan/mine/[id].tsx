import { BottomNav } from '@/components/navigation/BottomNav';
import { apiService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

// reuse same fallback
const FALLBACK_MY_REPORT = {
  id: '1',
  category: 'Kebakaran Hutan',
  labels: ['Kebakaran Besar'],
  location: 'Lembah Harau',
  description: 'Banyaknya sampah di area ini yang membuat warga resah',
  author: 'Budi Herman',
  date: 'October 25, 2025',
  image: 'https://images.unsplash.com/photo-1554188248-986adbb73c24?w=1200',
  status: 'Diverifikasi',
  latitude: -0.9465,
  longitude: 100.4180,
};

export default function MyReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const resp = await apiService.getUserReports();
        const data = resp.data || [];
        const found = data.find((r: any) => String(r.id) === String(id));
        if (found && mounted) {
          setReport({
            id: String(found.id),
            category:
              found.forest_classification ? 'Kebakaran Hutan' :
              found.trash_classification ? 'Sampah' :
              found.water_classification ? 'Kualitas Air' :
              found.illegal_logging_classification ? 'Penebangan Hutan' : 'Laporan Umum',
            labels: [
              found.forest_classification,
              found.trash_classification,
              found.water_classification,
              found.illegal_logging_classification,
              found.public_fire_classification
            ].filter(Boolean),
            location: found.latitude && found.longitude ? `Lat: ${found.latitude.toFixed(4)}, Lng: ${found.longitude.toFixed(4)}` : (found.location || 'Lokasi tidak tersedia'),
            description: found.description || '',
            author: found.user?.name || 'Anda',
            date: found.created_at ? new Date(found.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
            image: found.image_url || '',
            status: found.verified ? 'Diverifikasi' : 'Menunggu Verifikasi',
            latitude: found.latitude,
            longitude: found.longitude,
          });
        } else {
          setReport(FALLBACK_MY_REPORT);
        }
      } catch (e) {
        setReport(FALLBACK_MY_REPORT);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2D5F4F" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#4A9D6F', '#2D5F4F']} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Laporan Saya</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: report.image }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Kategori</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.infoValue}>{report.category}</Text>
            <View style={styles.spacer} />
            <View style={styles.authorBlock}>
              <Text style={styles.authorName}>{report.author}</Text>
              <Text style={styles.dateText}>{report.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Label</Text>
            <View style={styles.labels}>
              {Array.isArray(report.labels) && report.labels.map((l: string, i: number) => (
                <View key={i} style={styles.badge}>
                  <Text style={styles.badgeText}>{l}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lokasi</Text>
            <Text style={styles.infoValue}>{report.location}</Text>
          </View>

          <View style={styles.mapContainer}>
            {(report.latitude && report.longitude) ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker coordinate={{ latitude: report.latitude, longitude: report.longitude }} />
              </MapView>
            ) : (
              <View style={styles.noMap}><Text>Lokasi tidak tersedia</Text></View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.infoLabel}>Deskripsi</Text>
            <Text style={styles.description}>{report.description}</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav activeRoute="laporan" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7FBF8' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FBF8' },

  // rectangular header with soft rounded edges to match new style
  header: {
    height: 100, // sedikit diperkecil
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  headerInner: {
    height: 56,
    paddingHorizontal: 14,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    top: 28,
  },

  scrollContent: { paddingBottom: 120, paddingHorizontal: 16, paddingTop: 8 },

  imageWrapper: {
    marginTop: 12, // foto di bawah header
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '94%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#fff',
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  fieldLabel: { fontWeight: '700', color: '#111827', width: 80 },
  colon: { fontWeight: '700', marginRight: 6, color: '#111827' },
  spacer: { flex: 1 },
  authorBlock: { alignItems: 'flex-end' },
  authorName: { fontSize: 12, fontWeight: '600', color: '#374151' },
  dateText: { fontSize: 11, color: '#9CA3AF' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoLabel: { width: 80, fontWeight: '700', color: '#111827' },
  infoValue: { flex: 1, color: '#374151' },

  labels: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  badge: { backgroundColor: '#FFECE6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 6 },
  badgeText: { fontSize: 12, color: '#9A3412', fontWeight: '600' },

  mapContainer: { marginTop: 8, borderRadius: 12, overflow: 'hidden', height: 140, backgroundColor: '#E6F5ED' },
  map: { flex: 1 },
  noMap: { height: 140, justifyContent: 'center', alignItems: 'center' },

  section: { marginTop: 12 },
  description: { marginTop: 6, color: '#4B5563', lineHeight: 20 },
});
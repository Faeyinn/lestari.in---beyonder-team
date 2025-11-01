import { LaporanCard, Report } from '@/components/laporan/LaporanCard';
import { LaporanSegmentedControl } from '@/components/laporan/LaporanSegmentedControl';
import { ReportSearchBar } from '@/components/laporan/ReportSearchBar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { apiService } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Data Laporan (Semua Laporan) ---
const allReportsData: Report[] = [
  {
    id: '1',
    category: 'Kebakaran Hutan',
    labels: ['Kebakaran Besar'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73c24?w=500',
    status: 'Diverifikasi', // Status ditambahkan
  },
  {
    id: '2',
    category: 'Sampah',
    labels: ['Banyak Sampah', 'Sampah Anorganik'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500',
    status: 'Menunggu Verifikasi', // Status ditambahkan
  },
  {
    id: '3',
    category: 'Kualitas Air',
    labels: ['Air Keruh'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1530080913386-c5140c5ac476?w=500',
    status: 'Menunggu Verifikasi', // Status ditambahkan
  },
  {
    id: '4',
    category: 'Penebangan Hutan',
    labels: ['Penebangan Ilegal'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1542365287-3e1b6b3609b2?w=500',
    status: 'Selesai', // Status ditambahkan
  },
  {
    id: '5',
    category: 'Sampah',
    labels: ['Banyak Sampah', 'Sampah Anorganik'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500',
    status: 'Ditolak', // Status ditambahkan
  },
];

// --- Data Laporan (Laporan Saya) ---
const myReportsData: Report[] = [
  // Data dari 09-laporan-saya.jpg
  {
    id: '1',
    category: 'Kebakaran Hutan',
    labels: ['Kebakaran Besar'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73c24?w=500',
    status: 'Diverifikasi',
  },
  {
    id: '2',
    category: 'Sampah',
    labels: ['Banyak Sampah', 'Sampah Anorganik'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500',
    status: 'Menunggu Verifikasi',
  },
  {
    id: '3',
    category: 'Kualitas Air',
    labels: ['Air Keruh'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1530080913386-c5140c5ac476?w=500',
    status: 'Menunggu Verifikasi',
  },
  {
    id: '4',
    category: 'Penebangan Hutan',
    labels: ['Penebangan Ilegal'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1542365287-3e1b6b3609b2?w=500',
    status: 'Selesai',
  },
  {
    id: '5',
    category: 'Sampah',
    labels: ['Banyak Sampah', 'Sampah Anorganik'],
    location: 'Lembah Harau',
    description: 'Banyaknya sampah di area ini yang membuat warga resah',
    author: 'Budi Herman',
    date: 'October 25, 2025',
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500',
    status: 'Ditolak',
  },
];

type ActiveTab = 'Semua Laporan' | 'Laporan Saya';

export default function LaporanScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Semua Laporan');
  const [apiReports, setApiReports] = useState<{ all: Report[]; user: Report[] }>({
    all: [],
    user: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [allReportsResponse, userReportsResponse] = await Promise.all([
        apiService.getAllReports(),
        apiService.getUserReports(),
      ]);

      // Transform API data to match Report interface
      const transformReport = (apiReport: any): Report => ({
        id: apiReport.id.toString(),
        category: getCategoryFromClassifications(apiReport),
        labels: getLabelsFromClassifications(apiReport),
        location: `Lat: ${apiReport.latitude.toFixed(4)}, Lng: ${apiReport.longitude.toFixed(4)}`,
        description: apiReport.description,
        author: apiReport.user.name, // Use user's name from API
        date: new Date(apiReport.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        image: apiReport.image_url,
        status: apiReport.verified ? 'Diverifikasi' : 'Menunggu Verifikasi',
      });

      setApiReports({
        all: allReportsResponse.data.map(transformReport),
        user: userReportsResponse.data.map(transformReport),
      });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Keep dummy data as fallback
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromClassifications = (report: any): string => {
    if (report.forest_classification) return 'Kebakaran Hutan';
    if (report.trash_classification) return 'Sampah';
    if (report.water_classification) return 'Kualitas Air';
    if (report.illegal_logging_classification) return 'Penebangan Hutan';
    if (report.public_fire_classification) return 'Kebakaran Umum';
    return 'Laporan Umum';
  };

  const getLabelsFromClassifications = (report: any): string[] => {
    const labels: string[] = [];
    if (report.forest_classification) labels.push(report.forest_classification);
    if (report.trash_classification) labels.push(report.trash_classification);
    if (report.water_classification) labels.push(report.water_classification);
    if (report.illegal_logging_classification) labels.push(report.illegal_logging_classification);
    if (report.public_fire_classification) labels.push(report.public_fire_classification);
    return labels.length > 0 ? labels : ['Laporan'];
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, []);

  // Use API data if available, otherwise fall back to dummy data with 2 dummy entries appended
  const getDataToShow = () => {
    if (activeTab === 'Semua Laporan') {
      const apiData = apiReports.all.length > 0 ? apiReports.all : allReportsData;
      const appendedDummies = allReportsData.slice(0, 2).map((item, index) => ({
        ...item,
        id: `appended-${index}-${item.id}`, // Ensure unique IDs
      }));
      return [...apiData, ...appendedDummies]; // Append 2 dummy entries
    } else {
      const apiData = apiReports.user.length > 0 ? apiReports.user : myReportsData;
      const appendedDummies = myReportsData.slice(0, 2).map((item, index) => ({
        ...item,
        id: `appended-${index}-${item.id}`, // Ensure unique IDs
      }));
      return [...apiData, ...appendedDummies]; // Append 2 dummy entries
    }
  };

  const dataToShow = getDataToShow();

  // Filter data berdasarkan searchQuery
  const filteredReports = dataToShow.filter((report) =>
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePressReport = (item: Report) => {
    // If this item is an appended dummy we try to extract original id
    const rawId = String(item.id);
    const realId = rawId.startsWith('appended-') ? rawId.split('-').slice(-1)[0] : rawId;
    if (activeTab === 'Laporan Saya') {
      router.push(`/laporan/mine/${realId}`);
    } else {
      router.push(`/laporan/${realId}`);
    }
  };

  const renderItem: ListRenderItem<Report> = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(500)
        .springify()}
    >
      <LaporanCard report={item} onPress={() => handlePressReport(item)} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header: Search Bar + Filter Button */}
        <View style={styles.header}>
          <ReportSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Telusuri Laporan"
          />
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          <LaporanSegmentedControl
            activeTab={activeTab}
            onTabPress={(tab) => setActiveTab(tab)}
          />
        </View>
      </SafeAreaView>

      {/* Daftar Laporan */}
      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A9D6F"
            colors={['#4A9D6F']}
          />
        }
      />

      <BottomNav activeRoute="laporan" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBF8', // Latar belakang putih kehijauan
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Padding untuk bottom nav
  },
});

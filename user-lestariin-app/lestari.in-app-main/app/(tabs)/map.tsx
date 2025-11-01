import { FilterModal } from '@/components/map/FilterModal';
import { HeatmapMarker } from '@/components/map/HeatmapMarker';
import { PointsCard } from '@/components/map/PointsCard';
import { SearchBar } from '@/components/map/SearchBar';
import { UserCard } from '@/components/map/UserCard';
import { WasteCard } from '@/components/map/WasteCard';
import { BottomNav } from '@/components/navigation/BottomNav';
import { apiService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_REGION = {
  latitude: -0.9471,
  longitude: 100.4172,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Sample waste locations with heatmap intensity
const wasteLocations = [
  {
    id: '1',
    coordinate: { latitude: -0.9471, longitude: 100.4172 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400',
    type: 'waste' as const,
    intensity: 'high' as const,
  },
  {
    id: '2',
    coordinate: { latitude: -0.9520, longitude: 100.4100 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    type: 'waste' as const,
    intensity: 'medium' as const,
  },
  {
    id: '3',
    coordinate: { latitude: -0.9400, longitude: 100.4250 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400',
    type: 'waste' as const,
    intensity: 'low' as const,
  },
  {
    id: '4',
    coordinate: { latitude: -0.9550, longitude: 100.4200 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    type: 'fire' as const,
    intensity: 'high' as const,
  },
  {
    id: '5',
    coordinate: { latitude: -0.9350, longitude: 100.4080 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    type: 'recycle' as const,
    intensity: 'high' as const,
  },
  {
    id: '6',
    coordinate: { latitude: -0.9480, longitude: 100.4050 },
    title: 'Sampah',
    category: 'Belum ditindaklanjuti',
    date: '01 Nov 2025',
    location: 'Lokasi',
    image: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=400',
    type: 'waste' as const,
    intensity: 'medium' as const,
  },
];

export default function MapScreen() {
  const [selectedWaste, setSelectedWaste] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<{ order?: 'Terbaru' | 'Terlama' | null; categories: string[]; labels: string[] }>({
    order: null,
    categories: [],
    labels: [],
  });
  const [apiReports, setApiReports] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; points: number } | null>(null);

  useEffect(() => {
    fetchReports();
    getUserLocation();
    fetchUserProfile();
  }, []);

  // refresh profile (dipanggil juga dari PointsCard.onExchangePress)
  const handleRefreshProfile = async () => {
    try {
      const response = await apiService.getProfile();
      const apiData = response.data;
      setUserProfile({
        name: apiData.user?.name || 'User',
        points: apiData.points || apiData.user?.points || 0,
      });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await apiService.getAllReports();
      const transformedReports = response.data.map((report: any) => {
        const ts = report.created_at ? new Date(report.created_at).getTime() : Date.now();
        return {
          id: `api-${report.id}`,
          coordinate: { latitude: report.latitude, longitude: report.longitude },
          title: getCategoryFromReport(report),
          category: report.verified ? 'Diverifikasi' : 'Belum ditindaklanjuti',
          date: new Date(report.created_at).toLocaleDateString('id-ID'),
          timestamp: ts,
          location: `Lat: ${report.latitude.toFixed(4)}, Lng: ${report.longitude.toFixed(4)}`,
          image: report.image_url,
          type: getTypeFromReport(report) as 'waste' | 'fire' | 'recycle',
          intensity: 'medium' as const,
          labels: report.labels || [], // optional
        };
      });
      setApiReports(transformedReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show your location on the map.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Failed to get user location:', error);
    }
  };

  const getCategoryFromReport = (report: any): string => {
    if (report.trash_classification) return 'Sampah';
    if (report.forest_classification) return 'Kebakaran Hutan';
    if (report.water_classification) return 'Kualitas Air';
    if (report.illegal_logging_classification) return 'Penebangan Hutan';
    if (report.public_fire_classification) return 'Kebakaran Umum';
    return 'Laporan';
  };

  const getTypeFromReport = (report: any): string => {
    if (report.trash_classification) return 'waste';
    if (report.forest_classification || report.public_fire_classification) return 'fire';
    if (report.illegal_logging_classification) return 'recycle';
    return 'waste';
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getProfile();
      const apiData = response.data;
      setUserProfile({
        name: apiData.user?.name || 'User',
        points: apiData.points || apiData.user?.points || 0,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile({
        name: 'User',
        points: 0,
      });
    }
  };

  const handleMarkerPress = (waste: any) => {
    setSelectedWaste(waste);
  };

  const handleApplyFilters = useCallback((filtersParam: any) => {
    setFilters({
      order: filtersParam.order || null,
      categories: filtersParam.categories || [],
      labels: filtersParam.labels || [],
    });
    setFilterVisible(false);
    console.log('Applied filters:', filtersParam);
  }, []);

  // ensure dummy items have timestamp (recent) and optional labels
  const dummyWithTs = wasteLocations.slice(0, 3).map((w, i) => ({
    ...w,
    timestamp: Date.now() - i * 86400000, // spacing by 1 day
    labels: w.labels || [],
    // normalize category for filtering if needed
    category:
      w.category && ['Sampah', 'Kualitas Air', 'Penebangan Hutan', 'Kebakaran Hutan'].includes(w.category)
        ? w.category
        : w.type === 'waste'
        ? 'Sampah'
        : w.type === 'fire'
        ? 'Kebakaran Hutan'
        : w.type === 'recycle'
        ? 'Penebangan Hutan'
        : w.category || 'Laporan',
  }));

  const allWasteLocations = [...dummyWithTs, ...apiReports];

  // helper: check marker category (normalized)
  const markerCategory = (m: any) => {
    if (m.category) return m.category;
    if (m.type === 'waste') return 'Sampah';
    if (m.type === 'fire') return 'Kebakaran Hutan';
    if (m.type === 'recycle') return 'Penebangan Hutan';
    return 'Laporan';
  };

  const applyFiltersToLocations = (locations: any[], f: typeof filters) => {
    let out = locations.slice();

    // Category filter
    if (f.categories && f.categories.length > 0) {
      out = out.filter((loc) => f.categories.includes(markerCategory(loc)));
    }

    // Labels filter (if markers have labels property)
    if (f.labels && f.labels.length > 0) {
      out = out.filter((loc) => {
        if (!loc.labels || !Array.isArray(loc.labels)) return false;
        return f.labels.some((L) => loc.labels.includes(L));
      });
    }

    // Search query filter (basic, checks title/location)
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      out = out.filter(
        (loc) =>
          String(loc.title || '').toLowerCase().includes(q) ||
          String(loc.location || '').toLowerCase().includes(q)
      );
    }

    // Order sorting by timestamp if available
    out.sort((a, b) => {
      const ta = a.timestamp || 0;
      const tb = b.timestamp || 0;
      if (f.order === 'Terbaru') return tb - ta;
      if (f.order === 'Terlama') return ta - tb;
      return tb - ta; // default newest first
    });

    return out;
  };

  // Terapkan filter hanya pada dummy markers
  const filteredDummy = useMemo(
    () => applyFiltersToLocations(dummyWithTs, filters),
    [dummyWithTs, filters, searchQuery]
  );

  // Gabungkan dummy yang sudah difilter dengan semua laporan API (API tetap tampil tanpa filter)
  const combinedFilteredLocations = useMemo(
    () => [...filteredDummy, ...apiReports],
    [filteredDummy, apiReports]
  );

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        customMapStyle={mapStyle}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
          >
            <View style={styles.userMarker}>
              <Ionicons name="person" size={20} color="#4A9D6F" />
            </View>
          </Marker>
        )}

        {/* Waste Location Markers with Heatmap */}
        {combinedFilteredLocations.map((waste) => (
          <HeatmapMarker
            key={waste.id}
            coordinate={waste.coordinate}
            type={waste.type}
            intensity={waste.intensity}
            onPress={() => handleMarkerPress(waste)}
          />
        ))}
      </MapView>

      <SafeAreaView style={styles.overlay} edges={['top']}>
        {/* Cards Container */}
        <View style={styles.cardsRow}>
          {/* User Card */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={styles.userCardContainer}
          >
          <UserCard
              name={userProfile?.name || "User"}
              points={userProfile?.points || 0}
              contribution={userProfile ? "Kontribusi Anda" : "Login untuk melihat poin"}
            />
          </Animated.View>

          {/* Points Card */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={styles.pointsCardContainer}
          >
            <PointsCard
              points={userProfile?.points ?? 0}
              maxPoints={500}
              onExchangePress={async () => {
                // contoh: refresh profile dari backend saat tombol ditekan
                await handleRefreshProfile();
              }}
            />
          </Animated.View>
        </View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={styles.searchContainer}
        >
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Telusuri Lokasi"
            onFilterPress={() => setFilterVisible(true)}
          />
        </Animated.View>

       {/* Filter Modal */}
       <FilterModal
         visible={filterVisible}
         onClose={() => setFilterVisible(false)}
         onApply={handleApplyFilters}
       />

        {/* Waste Card */}
        {selectedWaste && (
          <Animated.View
            entering={FadeInUp.duration(400).springify()}
            style={styles.wasteCardContainer}
          >
            <WasteCard
              title={selectedWaste.title}
              category={selectedWaste.category}
              date={selectedWaste.date}
              location={selectedWaste.location}
              image={selectedWaste.image}
              onClose={() => setSelectedWaste(null)}
            />
          </Animated.View>
        )}
      </SafeAreaView>

      {/* Bottom Navigation */}
      <BottomNav activeRoute="map" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  userCardContainer: {
    flex: 1,
  },
  pointsCardContainer: {
    width: 120,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  userMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A9D6F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wasteCardContainer: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    pointerEvents: 'box-none',
  },
});

// Custom map style for mint/light green appearance
const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#C7F0DB' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#A8DCD1' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#B8E6D5' }],
  },
];
import { ReportDescriptionInput } from '@/components/report/ReportDescriptionInput';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportSubmitButton } from '@/components/report/ReportSubmitButton';
import { apiService } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- added
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Menggunakan gambar placeholder sampah yang telah Anda sediakan
const fallbackTrashImage = require('@/assets/images/placeholder-waste.png');

export default function ReportDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUri } = params;

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Dapatkan sumber gambar, gunakan fallback jika URI tidak ada
  const imageSource = imageUri ? { uri: imageUri as string } : fallbackTrashImage;

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to submit reports.');
          return;
        }

        console.log('Getting current position...');
        let locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000,
        });

        console.log('Location obtained:', locationResult.coords);
        setLocation({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        });
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your location. Please check your GPS settings and try again.');
      }
    };
    getLocation();
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Deskripsi Kosong', 'Mohon masukkan deskripsi kondisi lingkungan.');
      return;
    }
    if (!location) {
      Alert.alert('Location Error', 'Unable to get your location. Please try again.');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting report with location:', location);
      const response = await apiService.submitReport({
        image: imageUri as string,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      console.log('Report submitted successfully:', response);

      // Refresh profile from backend to get updated points
      try {
        const profileRes = await apiService.getProfile();
        // optional: cache profile so other screens can read immediately
        await AsyncStorage.setItem('profile_cache', JSON.stringify(profileRes.data));
      } catch (err) {
        console.warn('Failed to refresh profile after submit:', err);
      }

      Alert.alert('Laporan Terkirim', 'Terima kasih! Laporan Anda berhasil dikirim.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Submit error:', error);

      // Handle specific Gemini API errors
      if (error.message?.includes('Failed to analyze image with Gemini')) {
        Alert.alert(
          'Laporan Terkirim',
          'Laporan berhasil dikirim, namun analisis gambar sementara tidak tersedia. Terima kasih atas kontribusi Anda.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to submit report');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Kustom */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <ReportHeader onBackPress={() => router.back()} />
        </Animated.View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gambar Laporan */}
          <Animated.View entering={FadeInUp.delay(100).duration(500)}>
            <View style={styles.imageWrapper}>
              <Image source={imageSource} style={styles.image} />
            </View>
          </Animated.View>

          {/* Input Deskripsi */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <ReportDescriptionInput
              value={description}
              onChangeText={setDescription}
            />
          </Animated.View>
        </ScrollView>

        {/* Tombol Kirim */}
        <Animated.View
          style={styles.buttonContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <ReportSubmitButton
            title="Laporkan"
            onPress={handleSubmit}
            loading={loading}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#73A997', // Warna hijau dari header
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F7FBF8', // Latar belakang putih kehijauan
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    height: 400, // Tinggi gambar disesuaikan
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
    backgroundColor: '#F7FBF8', // Senada dengan scrollview
  },
});
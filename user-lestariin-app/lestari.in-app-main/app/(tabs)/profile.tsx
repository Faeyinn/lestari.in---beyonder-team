import { BottomNav } from '@/components/navigation/BottomNav';
import { BadgeAchievements } from '@/components/profile/BadgeAchievements';
import { MenuButton } from '@/components/profile/MenuButton';
import { ProfileBadge } from '@/components/profile/ProfileBadge';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { RemainingPointsCard } from '@/components/profile/RemainingPointsCard';
import { StatsCard } from '@/components/profile/StatsCard';
import { apiService } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileData {
  name: string;
  email: string;
  city?: string;
  points?: number;
  reports_sent?: number;
  reports_verified?: number;
  rank?: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  // Data dummy yang sesuai dengan desain
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Beyonder',
    email: 'beyonder@gmail.com',
    city: 'Mahasiswa',
    points: 450,
    reports_sent: 15,
    reports_verified: 10,
    rank: 4,
  });
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile + user reports from backend
  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    try {
      const profileResponse = await apiService.getProfile();
      const reportsResponse = await apiService.getUserReports();
      // Map API response to expected format
      const apiData = profileResponse.data;
      const reportsData = reportsResponse.data;

      // Calculate reports sent and verified from user reports
      const reportsSent = Array.isArray(reportsData) ? reportsData.length : 0;
      const reportsVerified = Array.isArray(reportsData)
        ? reportsData.filter((report: any) => report.status === 'verified').length
        : 0;

      setProfileData({
        name: apiData.user?.name || 'User',
        email: apiData.user?.email || '',
        city: apiData.city || 'Mahasiswa',
        points: apiData.points ?? apiData.user?.points ?? 0,
        reports_sent: reportsSent,
        reports_verified: reportsVerified,
        rank: apiData.rank || 0,
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      Alert.alert('Error', 'Failed to load profile data');
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Re-fetch when the screen regains focus (useful after navigating to /tukar-poin or submitting a report)
  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleLeaderboard = () => {
    router.push('/leaderboard');
  };

  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setLogoutLoading(true);
            // call service to clear token / backend if necessary
            await apiService.logout();
            // navigate to login (replace so user cannot go back)
            router.replace('/login');
          } catch (err) {
            console.warn('Logout failed', err);
            Alert.alert('Error', 'Gagal logout. Coba lagi.');
          } finally {
            setLogoutLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5F4F" />
      </View>
    );
  }

  if (!profileData) {
    return null;
  }
  const MAX_POINTS = 500;
  const points = profileData.points || 0;
  const progress = Math.min(100, Math.round((points / MAX_POINTS) * 100));
  const remainingPoints = Math.max(0, MAX_POINTS - points);
  const progressText = `${remainingPoints} XP lagi menuju level selanjutnya`;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header dengan gradient dan lengkungan */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#4A9D6F', '#2D5F4F']} // stronger gradient as design
            style={styles.gradient}
          >
            <SafeAreaView edges={['top']}>
              <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <ProfileHeader
                  name={profileData.name}
                  city={profileData.city || 'Mahasiswa'}
                  email={profileData.email}
                />
              </Animated.View>
            </SafeAreaView>
          </LinearGradient>

          {/* Badge di tengah, overlap lebih besar */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.badgeContainer}
          >
            <ProfileBadge />
          </Animated.View>
        </View>

        {/* Konten Utama */}
        <View style={styles.content}>
          {/* Kartu Poin */}
          <View style={styles.pointsRow}>
            {/* Kartu Poin Utama (Besar) */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(600)}
              style={styles.summaryCardContainer}
            >
              <ProfileSummaryCard
                name={profileData.name}
                points={profileData.points || 0}
                progress={progress}
                progressText={progressText}
                maxPoints={MAX_POINTS}
              />
            </Animated.View>

            {/* Kartu Poin Tersisa (Kecil) */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.remainingPointsContainer}
            >
              <RemainingPointsCard
                points={remainingPoints}
                onExchangePress={() => router.push('/tukar-poin')}
              />
            </Animated.View>
          </View>

          {/* Kartu Statistik */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            style={styles.statsContainer}
          >
            <StatsCard
              title="Laporan Dikirim"
              value={profileData.reports_sent?.toString() || '0'}
            />
            <StatsCard
              title="Laporan Terverifikasi"
              value={profileData.reports_verified?.toString() || '0'}
            />
            <StatsCard
              title="Peringkat Kontribusi"
              value={profileData.rank?.toString() || '0'}
              gradient
            />
          </Animated.View>

          {/* Badge Achievements */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <BadgeAchievements />
          </Animated.View>

          {/* Tombol Menu */}
          <Animated.View entering={FadeInDown.delay(700).duration(600)}>
            <MenuButton
              title="Edit Profil"
              onPress={handleEditProfile}
              icon="person-outline"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).duration(600)}>
            <MenuButton
              title="Leaderboard"
              onPress={handleLeaderboard}
              icon="trophy-outline"
            />
          </Animated.View>

          {/* Logout Button */}
          <Animated.View entering={FadeInDown.delay(900).duration(600)}>
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.logoutContent}>
                  <View />
                  <View>
                    <MenuButton title="Logout" onPress={handleLogout} icon="log-out-outline" />
                  </View>
                  <View />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Navigasi Bawah */}
      <BottomNav activeRoute="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FBF8',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    position: 'relative',
    paddingBottom: 90, // ruang untuk badge overlap lebih besar
    backgroundColor: '#F7FBF8',
  },
  gradient: {
    height: 240, // lebih tinggi agar lengkung lebih besar seperti desain
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    transform: [{ scaleX: 1.1 }],
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 20, // tumpang tindih lebih besar sehingga badge menonjol
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  pointsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  summaryCardContainer: {
    flex: 1,
  },
  remainingPointsContainer: {
    width: 120, // sedikit lebih lebar agar proporsi sesuai desain
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
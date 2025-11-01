import { BottomNav } from '@/components/navigation/BottomNav';
import { apiService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Voucher {
  id: string;
  title: string;
  cost: number;
  image?: any;
}

// local asset imports
const TRANS_PADANG = require('@/assets/images/transpadang.png');
const MUSEUM_ADIT = require('@/assets/images/museum-adit.png');
const PULAU_ANGSO = require('@/assets/images/pulauangsoduo.jpg');

const VOUCHERS: Voucher[] = [
  { id: 'v1', title: 'Voucher 1x Perjalanan Trans Padang', cost: 100, image: TRANS_PADANG },
  { id: 'v2', title: 'Voucher 1 Tiket Masuk Museum Adityawarman', cost: 200, image: MUSEUM_ADIT },
  { id: 'v3', title: 'Voucher 1 Tiket Masuk Pulau Angso Duo', cost: 2000, image: PULAU_ANGSO },
];

export default function TukarPoinScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<number>(0);
  const MAX_POINTS = 500;
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Prefer helper that returns points number
        const apiPoints = await apiService.getPoints();
        if (mounted) setPoints(apiPoints);
      } catch (e: any) {
        console.warn('Failed to load profile points', e);
        // fallback to 0
        if (mounted) setPoints(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleRedeem = async (v: Voucher) => {
    if (points < v.cost) {
      Alert.alert('Poin tidak cukup', 'Anda tidak memiliki cukup poin untuk menukar voucher ini.');
      return;
    }

    Alert.alert('Konfirmasi', `Tukar ${v.cost} XP untuk "${v.title}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Tukar',
        onPress: async () => {
          setRedeemLoading(v.id);
          try {
            // Try calling backend redeem endpoint
            const resp = await apiService.redeemVoucher(v.id);
            console.log('Redeem response:', resp.data);
            // After successful redeem, refresh points from backend
            const newPoints = await apiService.getPoints();
            setPoints(newPoints);
            Alert.alert('Berhasil', resp.data?.message || `Berhasil menukar ${v.cost} XP untuk "${v.title}"`);
          } catch (err: any) {
            console.error('Redeem failed', err);
            // If API not available or failed, show friendly message
            Alert.alert('Gagal menukar', err?.message || 'Redeem gagal. Silakan coba lagi.');
          } finally {
            setRedeemLoading(null);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#4A9D6F', '#2D5F4F']} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tukar Poin</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pointsRow}>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsLabel}>Poin Didapat</Text>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.pointsValue}>{points} XP</Text>
                <Text style={styles.pointsSmall}>{Math.max(0, MAX_POINTS - points)} XP lagi menuju level selanjutnya</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.list}>
          {VOUCHERS.map((v) => (
            <View key={v.id} style={styles.card}>
              {/* Image area - occupies top half of card */}
              <ImageBackground source={v.image} style={styles.cardImage} imageStyle={styles.cardImageInner}>
                {/* gradient overlay: green on left -> transparent to the right */}
                <LinearGradient
                  colors={['rgba(45,95,79,0.95)', 'rgba(45,95,79,0.35)', 'rgba(45,95,79,0.0)']}
                  start={{ x: 0, y: 0.2 }}
                  end={{ x: 1, y: 0.2 }}
                  style={styles.imageOverlay}
                >
                  <View style={styles.overlayLeft}>
                    <Ionicons name="pricetag" size={20} color="#fff" />
                    <Text style={styles.overlayTitle} numberOfLines={2}>{v.title}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>

              {/* Footer area */}
              <View style={styles.cardFooter}>
                <Text style={styles.costText}>{v.cost} XP</Text>
                <TouchableOpacity style={styles.redeemButton} onPress={() => handleRedeem(v)} disabled={!!redeemLoading}>
                  {redeemLoading === v.id ? (
                    <ActivityIndicator color="#2D5F4F" />
                  ) : (
                    <Text style={styles.redeemButtonText}>Tukar Sekarang</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav activeRoute="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7FBF8' },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },

  pointsRow: {
    marginBottom: 12,
  },
  pointsBox: {
    backgroundColor: '#2D5F4F',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pointsLabel: { color: '#D1FAE5', fontSize: 12, fontWeight: '700' },
  pointsValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 6 },
  pointsSmall: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 6 },

  list: {
    marginTop: 16,
    // spacing handled by marginBottom on card
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    // card height gives image ~half card; adjust if you want larger image
    height: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },

  // image area (top half)
  cardImage: {
    width: '100%',
    height: '58%', // top ~58% of card height
    justifyContent: 'flex-start',
  },
  cardImageInner: {
    // softly rounded corners for top edges
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // gradient overlay sits in front of image
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  overlayLeft: {
    width: '55%', // overlay covers left portion of image
    paddingTop: 8,
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },

  cardFooter: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  redeemButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D5F4F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  redeemButtonText: { color: '#2D5F4F', fontWeight: '700' },
});
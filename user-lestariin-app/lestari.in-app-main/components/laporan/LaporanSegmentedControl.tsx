import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

type ActiveTab = 'Semua Laporan' | 'Laporan Saya';

interface LaporanSegmentedControlProps {
  activeTab: ActiveTab;
  onTabPress: (tab: ActiveTab) => void;
}

interface TabButtonProps {
  title: ActiveTab;
  isActive: boolean;
  onPress: () => void;
}

// Komponen Tombol Tab Internal
const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => {
  // Animasi untuk latar belakang
  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isActive ? '#4A9D6F' : '#FFFFFF', {
        duration: 300,
        easing: Easing.out(Easing.quad),
      }),
      borderColor: withTiming(isActive ? '#4A9D6F' : '#E5E7EB', {
        duration: 300,
        easing: Easing.out(Easing.quad),
      }),
    };
  });

  // Animasi untuk warna teks
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isActive ? '#FFFFFF' : '#6B7280', {
        duration: 300,
        easing: Easing.out(Easing.quad),
      }),
    };
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButtonWrapper} activeOpacity={0.9}>
      <Animated.View style={[styles.tabButton, animatedBgStyle]}>
        <Animated.Text style={[styles.tabText, animatedTextStyle]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Komponen Utama
export const LaporanSegmentedControl: React.FC<LaporanSegmentedControlProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <TabButton
        title="Semua Laporan"
        isActive={activeTab === 'Semua Laporan'}
        onPress={() => onTabPress('Semua Laporan')}
      />
      <TabButton
        title="Laporan Saya"
        isActive={activeTab === 'Laporan Saya'}
        onPress={() => onTabPress('Laporan Saya')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
  },
  tabButtonWrapper: {
    flex: 1,
    paddingHorizontal: 6,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 28,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

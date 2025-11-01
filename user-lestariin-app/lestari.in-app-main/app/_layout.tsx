import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Reanimated default config in Expo is fine; keep file imported.
    }
  }, []);

  return <Slot />;
}
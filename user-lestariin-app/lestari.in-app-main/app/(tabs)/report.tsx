import { ReportCameraView } from '@/components/report/ReportCameraView';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Dapatkan referensi ke gambar placeholder
const trashImage = require('@/assets/images/placeholder-waste.png');

export default function ReportScreen() {
  const router = useRouter();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleTakePhoto = (imageUri: string) => {
    router.replace({
      pathname: '/report-detail',
      params: { imageUri: imageUri }
    });
  };

  return (
    <View style={styles.container}>
      <ReportCameraView onTakePhoto={handleTakePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '100%',
  },
});
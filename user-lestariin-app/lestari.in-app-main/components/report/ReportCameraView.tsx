import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReportCameraViewProps {
  onTakePhoto: (uri: string) => void;
}

export const ReportCameraView: React.FC<ReportCameraViewProps> = ({
  onTakePhoto,
}) => {
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <TouchableOpacity onPress={requestPermission}>
          <Ionicons name="camera" size={50} color="#4A9D6F" />
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    console.log('Take photo button pressed');
    if (cameraRef.current) {
      try {
        console.log('Taking photo...');
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
        });
        console.log('Photo taken:', photo.uri);
        onTakePhoto(photo.uri);
      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    } else {
      console.log('Camera ref not ready');
      Alert.alert('Error', 'Camera not ready');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onTakePhoto(result.assets[0].uri);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Rounded gradient panel that holds the camera preview (matches design) */}
      <LinearGradient
        colors={['#CFEBD9', '#D9F3E3']}
        style={styles.previewWrapper}
      >
        <View style={styles.previewInner}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mode="picture"
            ratio="4:3"
          />
        </View>
      </LinearGradient>

      {/* Controls Overlay (center camera button + side controls) */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={pickImage}
        >
          <Ionicons name="images" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraButtonWrapper}
          onPress={() => {
            console.log('Camera button pressed');
            takePhoto();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FCF9A', '#2D5F4F']}
            style={styles.cameraButton}
          >
            <View style={styles.cameraIconCircle}>
              <Ionicons name="camera" size={28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sideButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },

  // Outer rounded preview wrapper (green-ish frame)
  previewWrapper: {
    width: '92%',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    // subtle shadow
    shadowColor: '#2D5F4F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  // inner white panel that contains actual camera preview with rounded corners
  previewInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 4 / 3, // keep photo preview ratio
    width: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },

  // Controls (bottom)
  controlsContainer: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(45,95,79,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  cameraButtonWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  cameraButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // fallback styles (unused but kept)
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  cameraButtonFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});

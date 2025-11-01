import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeatmapMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'waste' | 'fire' | 'recycle';
  intensity: 'low' | 'medium' | 'high';
  onPress?: () => void;
}

const getIconName = (type: string) => {
  switch (type) {
    case 'fire':
      return 'flame' as const;
    case 'recycle':
      return 'leaf' as const;
    default:
      return 'trash' as const;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'fire':
      return '#FFFFFF';
    case 'recycle':
      return '#FFFFFF';
    default:
      return '#FFFFFF';
  }
};

const getHeatmapColors = (type: string, intensity: string) => {
  if (type === 'fire') {
    switch (intensity) {
      case 'high':
        return ['rgba(239, 68, 68, 0.7)', 'rgba(239, 68, 68, 0)'];
      case 'medium':
        return ['rgba(251, 146, 60, 0.6)', 'rgba(251, 146, 60, 0)'];
      default:
        return ['rgba(252, 211, 77, 0.5)', 'rgba(252, 211, 77, 0)'];
    }
  } else if (type === 'recycle') {
    switch (intensity) {
      case 'high':
        return ['rgba(34, 197, 94, 0.7)', 'rgba(34, 197, 94, 0)'];
      case 'medium':
        return ['rgba(74, 222, 128, 0.6)', 'rgba(74, 222, 128, 0)'];
      default:
        return ['rgba(134, 239, 172, 0.5)', 'rgba(134, 239, 172, 0)'];
    }
  } else {
    switch (intensity) {
      case 'high':
        return ['rgba(107, 114, 128, 0.7)', 'rgba(107, 114, 128, 0)'];
      case 'medium':
        return ['rgba(156, 163, 175, 0.6)', 'rgba(156, 163, 175, 0)'];
      default:
        return ['rgba(209, 213, 219, 0.5)', 'rgba(209, 213, 219, 0)'];
    }
  }
};

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'fire':
      return '#EF4444';
    case 'recycle':
      return '#22C55E';
    default:
      return '#6B7280';
  }
};

const getHeatmapSize = (intensity: string) => {
  switch (intensity) {
    case 'high':
      return 120;
    case 'medium':
      return 100;
    default:
      return 80;
  }
};

export const HeatmapMarker: React.FC<HeatmapMarkerProps> = ({
  coordinate,
  type,
  intensity,
  onPress,
}) => {
  const colors = getHeatmapColors(type, intensity);
  const size = getHeatmapSize(intensity);
  const markerColor = getMarkerColor(type);

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.container}>
        {/* Heatmap Circle */}
        <View style={[styles.heatmapContainer, { width: size, height: size }]}>
          <LinearGradient
            colors={colors}
            style={styles.heatmap}
          />
        </View>

        {/* Icon Marker */}
        <View style={[styles.iconContainer, { backgroundColor: markerColor }]}>
          <Ionicons
            name={getIconName(type)}
            size={20}
            color={getIconColor(type)}
          />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmap: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
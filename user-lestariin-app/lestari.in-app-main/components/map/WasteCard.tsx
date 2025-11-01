import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface WasteCardProps {
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  onClose?: () => void;
}

export const WasteCard: React.FC<WasteCardProps> = ({
  title,
  category,
  date,
  location,
  image,
  onClose,
}) => {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: image }}
        style={styles.image}
        defaultSource={require('@/assets/images/placeholder-waste.png')}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#6B7280" />
            <Text style={styles.location}>{location}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      {/* Check Icon */}
      <View style={styles.checkIconContainer}>
        <Ionicons name="checkmark" size={20} color="#22C55E" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 10,
    fontWeight: '400',
    color: '#6B7280',
  },
  date: {
    fontSize: 10,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});
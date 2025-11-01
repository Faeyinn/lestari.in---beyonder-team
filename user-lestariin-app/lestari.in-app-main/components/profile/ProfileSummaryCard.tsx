import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileSummaryCardProps {
  name: string;
  points: number;
  progress: number;
  maxPoints: number;
  progressText: string;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  name,
  points,
  progress,
  maxPoints,
  progressText,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7CB97D', '#4A9D6F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pointsCard}
      >
        <View style={styles.pointsContent}>
          <View style={styles.pointsLeft}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.pointsLabel}>Total Poin Kontribusi</Text>
            <Text style={styles.contribution}>{progressText}</Text>
          </View>

          <View style={styles.pointsRight}>
            <Text style={styles.pointsValue}>{points}</Text>
            <Text style={styles.pointsUnit}>XP</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {points} XP <Text style={styles.progressMax}>dari {maxPoints} XP</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  pointsCard: {
    padding: 16,
    minHeight: 130, // lebih tinggi agar proporsi sesuai desain
  },
  pointsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pointsLeft: {
    flex: 1,
    paddingRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contribution: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  pointsRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  pointsUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: -2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  progressMax: {
    fontWeight: '400',
    opacity: 0.9,
  },
});
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function JudgeCard({ judge, onPlayVideo }) {
  if (!judge) return null;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Avatar Image */}
        <Image
          source={{ uri: judge.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' }}
          style={styles.avatar}
        />

        {/* Judge Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.judgeLabel}>Judge</Text>
          <Text style={styles.judgeName}>{judge.name}</Text>
          <Text style={styles.judgeTitle}>{judge.title}</Text>
          <Text style={styles.judgeExp}>{judge.experience}</Text>
        </View>

        {/* Intro Video Button */}
        <TouchableOpacity
          style={styles.videoButton}
          activeOpacity={0.7}
          onPress={() => onPlayVideo(judge.videoUrl, `${judge.name} - Intro Video`)}
        >
          <View style={styles.playCircle}>
            <Ionicons name="play" size={18} color={colors.primary} style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.videoText}>Intro Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  judgeLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 1,
  },
  judgeTitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  judgeExp: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  videoButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
});

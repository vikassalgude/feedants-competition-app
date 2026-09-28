import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PreviousWinners({ winners, onPlayVideo }) {
  if (!winners || winners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Winners</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {winners.map((winner, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onPlayVideo(winner.videoUrl, `${winner.name} - Performance`)}
          >
            <View style={styles.imageWrapper}>
              <Image source={{ uri: winner.avatarUrl }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={26} color={colors.white} />
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.winnerRank}>{winner.rank}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 120,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    position: 'relative',
    backgroundColor: '#CBD5E1',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 14,
  },
  infoContainer: {
    padding: 8,
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  winnerRank: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
});

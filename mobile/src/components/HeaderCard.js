import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function HeaderCard({ competition, isRegistered }) {
  if (!competition) return null;

  const spotsLeft = competition.totalSpots - competition.spotsBooked;
  const progressRatio = Math.min(1, competition.spotsBooked / competition.totalSpots);

  return (
    <View style={styles.card}>
      {/* Title and Top Badge Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{competition.title}</Text>
          <View style={styles.chipsRow}>
            {competition.tags && competition.tags.map((tag, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>

      {/* Certificate Callout */}
      {competition.certificateIncluded && (
        <View style={styles.certificateRow}>
          <Ionicons name="trophy-outline" size={16} color={colors.primary} />
          <Text style={styles.certificateText}>Winners get certificate</Text>
        </View>
      )}

      {/* Prize, Fee, and Spots Container */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>₹ {competition.prizePool.toLocaleString()}</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>₹ {competition.entryFee}</Text>
        </View>

        <View style={styles.spotsContainer}>
          <View style={styles.spotsHeader}>
            <MaterialCommunityIcons name="account-group-outline" size={16} color={colors.primaryText} />
            <Text style={styles.spotsLeftText}>Only {spotsLeft} spots left</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, progressRatio * 100)}%` }]} />
          </View>
          <Text style={styles.spotsBookedText}>
            {competition.spotsBooked} / {competition.totalSpots} Booked
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryText,
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  certificateText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    paddingTop: 10,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  prizeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  feeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  spotsContainer: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryText,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  spotsBookedText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
});

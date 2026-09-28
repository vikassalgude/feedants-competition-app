import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const renderRewardIcon = (position) => {
  if (position.includes('1st')) {
    return <FontAwesome5 name="trophy" size={16} color="#EAB308" />;
  }
  if (position.includes('2nd')) {
    return <FontAwesome5 name="medal" size={16} color="#94A3B8" />;
  }
  if (position.includes('3rd')) {
    return <FontAwesome5 name="medal" size={16} color="#D97706" />;
  }
  return <Ionicons name="star-outline" size={16} color={colors.primary} />;
};

export default function RewardsTable({ rewards }) {
  if (!rewards || rewards.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        Rewards <Text style={styles.subTitle}>(All Positions)</Text>
      </Text>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View
            key={index}
            style={[
              styles.rewardRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}
          >
            <View style={styles.leftCol}>
              <View style={styles.iconContainer}>
                {renderRewardIcon(reward.position)}
              </View>
              <Text style={styles.positionText}>{reward.position}</Text>
            </View>

            <Text style={styles.amountText}>₹ {reward.amount}</Text>
          </View>
        ))}
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
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  list: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  evenRow: {
    backgroundColor: '#F8FAFC',
  },
  oddRow: {
    backgroundColor: colors.cardBg,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
});

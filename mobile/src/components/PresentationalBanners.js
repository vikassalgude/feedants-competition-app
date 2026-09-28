import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons, Feather, ShieldCheck } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PresentationalBanners({ referralCode = 'referral123', onPlayVideo }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://feedants.com/r/${referralCode}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* 1. Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.disclaimerText}>
          <Text style={styles.boldText}>Disclaimer: </Text>
          Only contributions from paid participants will be considered for judging.
        </Text>
      </View>

      {/* 2. Prize Money & Razorpay Security Card */}
      <View style={styles.card}>
        <View style={styles.prizeMoneyRow}>
          <TouchableOpacity 
            style={styles.prizeLeft}
            activeOpacity={0.8}
            onPress={() => onPlayVideo('https://www.w3schools.com/html/mov_bbb.mp4', 'How to receive prize money')}
          >
            <View style={styles.playIconBox}>
              <Ionicons name="play" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.prizeTitle}>How will you receive prize money?</Text>
              <Text style={styles.prizeSub}>Watch video to know more</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.prizeRight}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.textDark} />
              <Text style={styles.trustText}>Refund policy</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.textDark} />
              <Text style={styles.trustText}>
                Secure payments powered by <Text style={styles.razorText}>Razorpay</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Refer & Earn Card */}
      <View style={styles.referCard}>
        <View style={styles.referHeader}>
          <Ionicons name="megaphone-outline" size={24} color={colors.primary} />
          <Text style={styles.referTitle}>Refer & Earn more discount</Text>
        </View>

        <View style={styles.referActionRow}>
          <View style={styles.linkBox}>
            <TextInput
              value={referralLink}
              editable={false}
              style={styles.linkInput}
            />
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.referNowBtn}>
            <Text style={styles.referNowText}>Refer Now</Text>
            <Text style={styles.earnText}>You earn ₹10 for every signup</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Hear From Our Users */}
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.hearRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textDark} />
          <View style={styles.hearTextContainer}>
            <Text style={styles.hearTitle}>Hear From Our Users</Text>
            <Text style={styles.hearSub}>See what participants say about Feedants</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textDark} />
        </View>
      </TouchableOpacity>

      {/* 5. Ad Banner Placeholder */}
      <View style={styles.adBox}>
        <Ionicons name="megaphone-outline" size={16} color={colors.primary} />
        <Text style={styles.adText}>Ad Here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  disclaimerBanner: {
    backgroundColor: '#EBF6F6',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textDark,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  prizeMoneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  playIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prizeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  prizeSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  prizeRight: {
    gap: 4,
    alignItems: 'flex-start',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    color: colors.textDark,
    fontWeight: '500',
  },
  razorText: {
    fontWeight: '800',
    color: '#002970',
  },
  referCard: {
    backgroundColor: '#E6F4F3',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CDEAE7',
  },
  referHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  referTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  referActionRow: {
    gap: 10,
  },
  linkBox: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0E3E1',
    overflow: 'hidden',
  },
  linkInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  copyBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#D0E3E1',
  },
  copyText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  referNowBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  referNowText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  earnText: {
    fontSize: 10,
    color: '#D0E3E1',
    marginTop: 2,
  },
  hearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hearTextContainer: {
    flex: 1,
  },
  hearTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  hearSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  adBox: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  adText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
});

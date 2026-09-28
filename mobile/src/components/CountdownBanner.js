import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CountdownBanner({ targetDate, phase }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  let bannerText = 'Registration closes in';
  if (phase === 'SUBMISSION_OPEN') {
    bannerText = 'Submission closes in';
  } else if (phase === 'REGISTRATION_CLOSED') {
    bannerText = 'Submission starts in';
  }

  if (timeLeft.isExpired) {
    return (
      <View style={styles.banner}>
        <MaterialCommunityIcons name="timer-off-outline" size={18} color={colors.textMuted} />
        <Text style={styles.closedText}>Registration for this competition has ended</Text>
      </View>
    );
  }

  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <Ionicons name="hourglass-outline" size={18} color={colors.primary} />
        <Text style={styles.label}>{bannerText}</Text>
      </View>

      <Text style={styles.timerText}>
        {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
      </Text>

      <View style={styles.rightRow}>
        <Ionicons name="timer-outline" size={16} color={colors.primary} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EBF6F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  closedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginLeft: 6,
  },
});

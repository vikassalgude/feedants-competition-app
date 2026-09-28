import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const formatDate = (dateStr) => {
  if (!dateStr) return { date: '--', time: '--' };
  const d = new Date(dateStr);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const year = String(d.getFullYear()).slice(2);
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return {
    date: `${day} ${month} ${year}`,
    time: `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  };
};

export default function ImportantDatesGrid({ competition }) {
  if (!competition) return null;

  const regBefore = formatDate(competition.registrationDeadline);
  const subStart = formatDate(competition.submissionStartsAt);
  const subEnd = formatDate(competition.submissionEndsAt);
  const resultDate = formatDate(competition.resultDate);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Important Dates</Text>

      <View style={styles.gridContainer}>
        {/* Top-Left: Register Before */}
        <View style={[styles.gridCell, styles.borderRight, styles.borderBottom]}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <View style={styles.cellContent}>
            <Text style={styles.label}>Register Before</Text>
            <Text style={styles.dateText}>{regBefore.date}</Text>
            <Text style={styles.timeText}>{regBefore.time}</Text>
          </View>
        </View>

        {/* Top-Right: Submission Starts */}
        <View style={[styles.gridCell, styles.borderBottom]}>
          <Feather name="send" size={22} color={colors.primary} />
          <View style={styles.cellContent}>
            <Text style={styles.label}>Submission Starts</Text>
            <Text style={styles.dateText}>{subStart.date}</Text>
            <Text style={styles.timeText}>{subStart.time}</Text>
          </View>
        </View>

        {/* Bottom-Left: Submission Ends */}
        <View style={[styles.gridCell, styles.borderRight]}>
          <Feather name="upload" size={22} color={colors.primary} />
          <View style={styles.cellContent}>
            <Text style={styles.label}>Submission Ends</Text>
            <Text style={styles.dateText}>{subEnd.date}</Text>
            <Text style={styles.timeText}>{subEnd.time}</Text>
          </View>
        </View>

        {/* Bottom-Right: Result Date */}
        <View style={styles.gridCell}>
          <Ionicons name="trophy-outline" size={24} color={colors.primary} />
          <View style={styles.cellContent}>
            <Text style={styles.label}>Result Date</Text>
            <Text style={styles.dateText}>{resultDate.date}</Text>
            <Text style={styles.timeText}>{resultDate.time}</Text>
          </View>
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
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridCell: {
    width: '50%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardBg,
  },
  cellContent: {
    flex: 1,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#EDF2F7',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 1,
  },
});

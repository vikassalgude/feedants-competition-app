import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function HeaderBar({ lang, onToggleLang, selectedUser, onSelectUser }) {
  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={colors.textDark} />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>

        <View style={styles.langToggle}>
          <TouchableOpacity 
            style={[styles.langPill, lang === 'ENG' && styles.langPillActive]} 
            onPress={() => onToggleLang('ENG')}
          >
            <Text style={[styles.langText, lang === 'ENG' && styles.langTextActive]}>ENG</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langPill, lang === 'HINDI' && styles.langPillActive]} 
            onPress={() => onToggleLang('HINDI')}
          >
            <Text style={[styles.langText, lang === 'HINDI' && styles.langTextActive]}>हिंदी</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Switcher Toolbar for Evaluation / Testing */}
      <View style={styles.testerBar}>
        <Text style={styles.testerLabel}>Test User:</Text>
        {['user_demo_1', 'user_demo_2', 'user_demo_3'].map((uid, index) => (
          <TouchableOpacity
            key={uid}
            style={[styles.userChip, selectedUser === uid && styles.userChipActive]}
            onPress={() => onSelectUser(uid)}
          >
            <Text style={[styles.userChipText, selectedUser === uid && styles.userChipTextActive]}>
              User {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: '#EAEFF2',
    borderRadius: 20,
    padding: 2,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langPillActive: {
    backgroundColor: colors.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  langTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  testerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  testerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  userChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F0F3F5',
  },
  userChipActive: {
    backgroundColor: colors.primary,
  },
  userChipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  userChipTextActive: {
    color: colors.white,
  }
});

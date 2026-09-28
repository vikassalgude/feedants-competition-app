import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TabbedContent({ competition }) {
  const [activeTab, setActiveTab] = useState('ABOUT');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!competition) return null;

  return (
    <View style={styles.card}>
      {/* Tab Navigation Header */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ABOUT' && styles.tabButtonActive]}
          onPress={() => setActiveTab('ABOUT')}
        >
          <Text style={[styles.tabText, activeTab === 'ABOUT' && styles.tabTextActive]}>
            About Competition
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'JUDGING' && styles.tabButtonActive]}
          onPress={() => setActiveTab('JUDGING')}
        >
          <Text style={[styles.tabText, activeTab === 'JUDGING' && styles.tabTextActive]}>
            Judging Parameters
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'RULES' && styles.tabButtonActive]}
          onPress={() => setActiveTab('RULES')}
        >
          <Text style={[styles.tabText, activeTab === 'RULES' && styles.tabTextActive]}>
            Rules & Eligibility
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Body Content */}
      <View style={styles.contentBody}>
        {activeTab === 'ABOUT' && (
          <View>
            <Text style={styles.paragraphText}>
              {competition.aboutText}
            </Text>
            {isExpanded && (
              <Text style={[styles.paragraphText, { marginTop: 8 }]}>
                Submit your recorded video link in high resolution. Make sure your footwork and posture are clearly visible. All classical formats (Kathak, Bharatanatyam, Odissi, Kuchipudi, etc.) are welcome!
              </Text>
            )}
          </View>
        )}

        {activeTab === 'JUDGING' && (
          <View style={styles.parametersList}>
            {competition.judgingParameters && competition.judgingParameters.map((param, index) => (
              <View key={index} style={styles.paramItem}>
                <View style={styles.paramHeader}>
                  <Text style={styles.paramTitle}>{param.title}</Text>
                  <View style={styles.weightBadge}>
                    <Text style={styles.weightText}>{param.weightage}% Weight</Text>
                  </View>
                </View>
                <Text style={styles.paramDesc}>{param.description}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'RULES' && (
          <View style={styles.rulesList}>
            {competition.rulesAndEligibility && competition.rulesAndEligibility.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}

        {/* View More / View Less Toggle */}
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.viewMoreText}>{isExpanded ? 'View less' : 'View more'}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  contentBody: {
    padding: 16,
  },
  paragraphText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  parametersList: {
    gap: 10,
  },
  paramItem: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
  },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paramTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  weightBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  weightText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryText,
  },
  paramDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
  rulesList: {
    gap: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 14,
    paddingTop: 8,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function PhaseControlPanel({
  currentPhase,
  simulatedNow,
  onSetPhaseOffset,
  onResetDemoData,
  onSetOneSpotLeft
}) {
  const options = [
    { label: '1. Registration Open', phaseKey: 'OPEN_FOR_REGISTRATION', offsetDays: 0 },
    { label: '2. Registration Closed', phaseKey: 'REGISTRATION_CLOSED', offsetDays: 5.5 },
    { label: '3. Submission Open', phaseKey: 'SUBMISSION_OPEN', offsetDays: 7 },
    { label: '4. Submission Closed', phaseKey: 'SUBMISSION_CLOSED', offsetDays: 12 },
    { label: '5. Results Declared', phaseKey: 'RESULTS_DECLARED', offsetDays: 16 }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Evaluator Controls (Demo Only): <Text style={styles.phaseHighlight}>{currentPhase || 'Loading...'}</Text>
        </Text>
      </View>

      {/* Preset Phase Selector Buttons */}
      <View style={styles.optionsRow}>
        {options.map((opt, idx) => {
          const isServerMatched = currentPhase === opt.phaseKey;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.btn, isServerMatched && styles.btnActive]}
              onPress={() => onSetPhaseOffset(opt.offsetDays)}
            >
              <Text style={[styles.btnText, isServerMatched && styles.btnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Helper Action Buttons: Reset Demo Data & 1 Spot Remaining */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetDemoData}>
          <Text style={styles.actionBtnText}>🔄 Reset Demo Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.spotRaceBtn} onPress={onSetOneSpotLeft}>
          <Text style={styles.actionBtnText}>⚡ 1 Spot Remaining (Race Demo)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  phaseHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  btn: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  btnTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  resetBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spotRaceBtn: {
    backgroundColor: '#B45309',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

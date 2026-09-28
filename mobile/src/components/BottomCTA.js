import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function BottomCTA({ ctaState, isLoading, onPressAction }) {
  if (!ctaState) return null;

  const { label, enabled, action, subtext } = ctaState;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          enabled ? styles.buttonActive : styles.buttonDisabled
        ]}
        disabled={!enabled || isLoading}
        activeOpacity={0.8}
        onPress={() => onPressAction(action)}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <View style={styles.content}>
            <Text style={[styles.label, enabled ? styles.labelActive : styles.labelDisabled]}>
              {label}
            </Text>
            {subtext ? (
              <Text style={[styles.subtext, enabled ? styles.subtextActive : styles.subtextDisabled]}>
                {subtext}
              </Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary, // Vibrant deep teal (#007A78) when active
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',     // Muted slate gray when disabled/inactive
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
  labelActive: {
    color: colors.white,
  },
  labelDisabled: {
    color: '#F8FAFC',
  },
  subtext: {
    fontSize: 11,
    marginTop: 1,
  },
  subtextActive: {
    color: '#D0E3E1',
  },
  subtextDisabled: {
    color: '#E2E8F0',
  },
});

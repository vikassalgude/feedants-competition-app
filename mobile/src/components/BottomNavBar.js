import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function BottomNavBar({ activeTab = 'Competitions' }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="home-outline" size={20} color={colors.textMuted} />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <Text style={styles.tabLabel}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.plusButton}>
        <Ionicons name="add-circle" size={42} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="trophy" size={20} color={colors.primary} />
        <Text style={[styles.tabLabel, styles.activeLabel]}>Competitions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="person-outline" size={20} color={colors.textMuted} />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  plusButton: {
    marginTop: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});

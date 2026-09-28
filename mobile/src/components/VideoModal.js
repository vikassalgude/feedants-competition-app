import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function VideoModal({ visible, videoTitle, videoUrl, onClose }) {
  if (!visible) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{videoTitle || 'Video Player'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.playerPlaceholder}>
            <Ionicons name="play-circle-outline" size={60} color={colors.primary} />
            <Text style={styles.playerText}>Playing Video Stream</Text>
            <Text style={styles.urlText}>{videoUrl}</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    flex: 1,
  },
  playerPlaceholder: {
    height: 200,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  playerText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 8,
  },
  urlText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

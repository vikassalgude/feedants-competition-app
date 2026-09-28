import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SubmissionModal({ visible, isSubmitting, onSubmit, onClose }) {
  const [fileUrl, setFileUrl] = useState('https://drive.google.com/file/d/sample_dance_submission.mp4');
  const [notes, setNotes] = useState('Performed Kathak Teentaal composition.');
  const [errorMsg, setErrorMsg] = useState('');

  if (!visible) return null;

  const handleSubmit = () => {
    if (!fileUrl.trim()) {
      setErrorMsg('Please enter a valid video link or file URL');
      return;
    }
    setErrorMsg('');
    onSubmit(fileUrl.trim(), notes.trim());
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Competition Entry</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Submission Video Link / URL *</Text>
          <TextInput
            style={styles.input}
            value={fileUrl}
            onChangeText={setFileUrl}
            placeholder="e.g. https://youtube.com/watch?v=... or Drive link"
          />

          <Text style={styles.label}>Notes / Performance Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholder="Add details about your classical dance performance..."
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitText}>Submit Entry</Text>
              )}
            </TouchableOpacity>
          </View>
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
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textDark,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 8,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  submitText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});

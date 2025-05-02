import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {lightTheme, darkTheme} from '@/types/theme';
import useStore from '@/store/useStore';
import {useTranslation} from 'react-i18next';

interface MessagePopupProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
}

function MessagePopup({
  visible,
  title,
  message,
  onConfirm,
  confirmText,
  onCancel,
  cancelText,
}: MessagePopupProps): React.JSX.Element {
  const {theme} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}>
      <View style={styles.container}>
        <View
          style={[
            styles.popup,
            {backgroundColor: currentTheme.colors.background},
          ]}>
          <Text style={[styles.title, {color: currentTheme.colors.text}]}>
            {title}
          </Text>
          <Text style={[styles.message, {color: currentTheme.colors.text}]}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {backgroundColor: currentTheme.colors.secondary},
                ]}
                onPress={onCancel}>
                <Text style={styles.buttonText}>
                  {cancelText || t('common.cancel')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: currentTheme.colors.primary},
              ]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>
                {confirmText || t('common.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MessagePopup;

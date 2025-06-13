import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { darkTheme, lightTheme } from '@/types';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { checkUrl, generateLookupUrl } from '@/api';

interface SettingApiLookupModalProps {
  visible: boolean;
  isDark: boolean;
  onSubmit: (url: string) => void;
  onClose: () => void;
}


function SettingApiLookupModal({
  visible,
  isDark,
  onSubmit,
  onClose,
}: SettingApiLookupModalProps) {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);
  const { t } = useTranslation();
  const [isLookup, setIsLookup] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [validUrls, setValidUrls] = useState<string[]>([]);

  const [currentLookupUrl, setCurrentLookupUrl] = useState('');
  const isLookupRef = useRef(false);
  const currentLookupUrlRef = useRef('');

  useEffect(() => {
    if (currentLookupUrlRef.current !== currentLookupUrl) {
      currentLookupUrlRef.current = currentLookupUrl;
    }
  }, [currentLookupUrl]);

  const stopLookup = useCallback(() => {
    setIsLookup(false);
    isLookupRef.current = false;
  }, []);

  const startLookup = useCallback(async () => {
    setIsLookup(true);
    isLookupRef.current = true;
    setCurrentLookupUrl('');
    setValidUrls([]);

    let idx = 0;
    const maxAttempts = 1000;

    while (isLookupRef.current && idx < maxAttempts) {
      const url = generateLookupUrl(baseUrl, idx);
      currentLookupUrlRef.current = url;
      setCurrentLookupUrl(url);
      const returnUrl = await checkUrl(url);
      if (returnUrl !== '') {
        setValidUrls(prev => [...prev, returnUrl]);
      }
      idx++;
    }

    setIsLookup(false);
    isLookupRef.current = false;
  }, [baseUrl]);

  const handleClose = useCallback(() => {
    if (isLookup) {
      stopLookup();
    }
    setBaseUrl('');
    setValidUrls([]);
    onClose();
  }, [onClose, isLookup, stopLookup]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}>
      <Pressable
        style={[styles.overlay, { backgroundColor: currentTheme.cardOverlay }]}
        onPress={handleClose}>
        <View style={[styles.container, { backgroundColor: currentTheme.card }]}>
          <Text style={[styles.title, { color: currentTheme.text }]}>
            {t('settings.lookupApiUrl')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.text,
                borderColor: currentTheme.border,
                backgroundColor: currentTheme.background,
              },
            ]}
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder={t('settings.apiUrlPlaceholder')}
            placeholderTextColor={currentTheme.textSecondary}
            editable={!isLookup}
          />
          <Text style={[styles.instruction, { color: currentTheme.text }]}>
            {t('settings.lookupApiUrlInstruction')}
          </Text>
          {!isLookup && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.primary }]}
              onPress={startLookup}>
              <Text
                style={[styles.buttonText, { color: currentTheme.textPrimary }]}>
                {t('settings.lookupApiUrl')}
              </Text>
            </TouchableOpacity>
          )}
          {isLookup && (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: currentTheme.primary }]}
                onPress={stopLookup}>
                <Text
                  style={[
                    styles.buttonText,
                    { color: currentTheme.textPrimary },
                  ]}>
                  {t('settings.stopLookup')}
                </Text>
              </TouchableOpacity>
              <View style={styles.indicatorContainer}>
                <ActivityIndicator color={currentTheme.primary} />
                <Text
                  style={[styles.indicatorText, { color: currentTheme.text }]}>
                  {t('settings.searching')} {currentLookupUrl}
                </Text>
              </View>
            </>
          )}
          {validUrls.length > 0 && (
            <ScrollView style={styles.listContainer}>
              <Text style={styles.listTitle}>{t('settings.validUrls')}</Text>
              {validUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.listItem,
                    { borderBottomColor: currentTheme.border },
                  ]}
                  onPress={() => {
                    onSubmit(url);
                    handleClose();
                  }}>
                  <Text style={styles.listItemText}>{url}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {validUrls.length === 0 && (
            <Text style={styles.noValidUrls}>{t('settings.noValidUrls')}</Text>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    gap: 10,
    height: '65%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indicatorText: {
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    minHeight: 100,
    maxHeight: 300,
  },
  listTitle: {
    fontSize: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  listItemText: {
    fontSize: 14,
  },
  noValidUrls: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SettingApiLookupModal;

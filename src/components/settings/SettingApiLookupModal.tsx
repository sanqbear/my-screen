import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {darkTheme, lightTheme} from '@/types';
import {useTranslation} from 'react-i18next';
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
import ReactNativeBlobUtil from 'react-native-blob-util';

interface SettingApiLookupModalProps {
  visible: boolean;
  isDark: boolean;
  onSubmit: (url: string) => void;
  onClose: () => void;
}

const generateLookupUrl = (url: string, index: number) => {
  try {
    // URL에서 프로토콜과 도메인을 분리
    const protocolMatch = url.match(/^(https?:\/\/)/);
    const protocol = protocolMatch ? protocolMatch[0] : 'https://';
    const domainAndPath = url.replace(/^(https?:\/\/)/, '');

    // 도메인과 경로를 분리
    const [domain, ...pathParts] = domainAndPath.split('/');
    const path = pathParts.length > 0 ? '/' + pathParts.join('/') : '';

    // 도메인을 부분으로 분리
    const domainParts = domain.split('.');

    // 도메인 이름의 첫 부분에 번호를 삽입
    if (domainParts.length >= 2) {
      domainParts[0] = `${domainParts[0]}${index}`;
    }

    // URL을 재구성
    return `${protocol}${domainParts.join('.')}${path}`;
  } catch (e) {
    console.error('URL generation error:', e);
    return url;
  }
};

const removeAllNumbers = (url: string) => {
  return url.replace(/\d/g, '');
};

const checkUrl = async (url: string): Promise<string> => {
  try {
    const response = await ReactNativeBlobUtil.config({
      followRedirect: false,
      timeout: 3000,
    }).fetch('GET', url);

    const info = response.info();
    const serverHeader = info.headers.server;
    const cfrayHeader = info.headers['cf-ray'];
    const pragmaHeader = info.headers.pragma;
    const isOk = info.status === 200;

    const locationHeader = info.headers.location;
    const isRedirect = info.status === 301 || info.status === 302;

    console.log(url, isOk, serverHeader, cfrayHeader, isRedirect, pragmaHeader);

    if (isOk && serverHeader === 'cloudflare' && cfrayHeader && pragmaHeader) {
      return url;
    } else if (
      isRedirect &&
      locationHeader &&
      removeAllNumbers(locationHeader) === removeAllNumbers(url)
    ) {
      if ((await checkUrl(locationHeader)) !== '') {
        return locationHeader;
      }
    }

    return '';
  } catch {
    return '';
  }
};

function SettingApiLookupModal({
  visible,
  isDark,
  onSubmit,
  onClose,
}: SettingApiLookupModalProps) {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);
  const {t} = useTranslation();
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
      const isOk = await checkUrl(url);
      if (isOk) {
        setValidUrls(prev => [...prev, url]);
      }
      idx++;
    }

    setIsLookup(false);
    isLookupRef.current = false;
  }, [baseUrl]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[styles.overlay, {backgroundColor: currentTheme.cardOverlay}]}
        onPress={onClose}>
        <View style={[styles.container, {backgroundColor: currentTheme.card}]}>
          <Text style={[styles.title, {color: currentTheme.text}]}>
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
          <Text style={[styles.instruction, {color: currentTheme.text}]}>
            {t('settings.lookupApiUrlInstruction')}
          </Text>
          {!isLookup && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: currentTheme.primary}]}
              onPress={startLookup}>
              <Text
                style={[styles.buttonText, {color: currentTheme.textPrimary}]}>
                {t('settings.lookupApiUrl')}
              </Text>
            </TouchableOpacity>
          )}
          {isLookup && (
            <>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: currentTheme.primary}]}
                onPress={stopLookup}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: currentTheme.textPrimary},
                  ]}>
                  {t('settings.stopLookup')}
                </Text>
              </TouchableOpacity>
              <View style={styles.indicatorContainer}>
                <ActivityIndicator color={currentTheme.primary} />
                <Text
                  style={[styles.indicatorText, {color: currentTheme.text}]}>
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
                    {borderBottomColor: currentTheme.border},
                  ]}
                  onPress={() => {
                    onSubmit(url);
                  }}>
                  <Text style={styles.listItemText}>{url}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    maxHeight: '80%',
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
});

export default SettingApiLookupModal;

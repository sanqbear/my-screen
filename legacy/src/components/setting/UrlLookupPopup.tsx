import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import api from '@/services/api';

interface UrlLookupPopupProps {
  visible: boolean;
  onClose: () => void;
}

const UrlLookupPopup: React.FC<UrlLookupPopupProps> = ({visible, onClose}) => {
  const {theme, setApiUrl} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const [baseUrl, setBaseUrl] = useState('');
  const [currentCheckUrl, setCurrentCheckUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundUrls, setFoundUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isSearchingRef = useRef(false);
  const currentCheckUrlRef = useRef('');

  useEffect(() => {
    if (currentCheckUrlRef.current !== currentCheckUrl) {
      currentCheckUrlRef.current = currentCheckUrl;
    }
  }, [currentCheckUrl]);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    setBaseUrl('');
    setCurrentCheckUrl('');
    setIsSearching(false);
    setFoundUrls([]);
    setError(null);
  };

  const checkUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await api.head(url, {
        timeout: 3000,
        validateStatus: status => status === 200,
        maxRedirects: 0,
      });

      // Cloudflare 관련 헤더 확인
      const serverHeader = response.headers.server;
      const cfRayHeader = response.headers['cf-ray'];

      // 서버가 Cloudflare이고 Cf-Ray 헤더가 있는 경우에만 true 반환
      return (
        response.status === 200 &&
        serverHeader?.toLowerCase() === 'cloudflare' &&
        cfRayHeader !== undefined
      );
    } catch {
      return false;
    }
  };

  const generateUrl = (url: string, number: number): string => {
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
        domainParts[0] = `${domainParts[0]}${number}`;
      }

      // URL을 재구성
      return `${protocol}${domainParts.join('.')}${path}`;
    } catch (e) {
      console.error('URL generation error:', e);
      return url;
    }
  };

  const startSearch = async () => {
    if (!baseUrl) {
      setError('Please enter a base URL');
      return;
    }

    setIsSearching(true);
    isSearchingRef.current = true;
    setError(null);
    setCurrentCheckUrl('');
    setFoundUrls([]);

    let number = 0;
    const maxAttempts = 1000;

    while (isSearchingRef.current && number < maxAttempts) {
      const url = generateUrl(baseUrl, number);
      currentCheckUrlRef.current = url;
      setCurrentCheckUrl(url);

      const isValid = await checkUrl(url);

      if (isValid) {
        setFoundUrls(prev => [...prev, url]);
      }

      number++;
    }

    setIsSearching(false);
    isSearchingRef.current = false;
  };

  const stopSearch = () => {
    setIsSearching(false);
    isSearchingRef.current = false;
  };

  const handleUrlSelect = (url: string) => {
    setApiUrl(url);
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.popup,
          {backgroundColor: currentTheme.colors.background},
        ]}>
        <Text style={[styles.title, {color: currentTheme.colors.text}]}>
          {t('urlLookup.title')}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border,
            },
          ]}
          placeholder={t('urlLookup.enterBaseUrl')}
          placeholderTextColor={currentTheme.colors.secondary}
          value={baseUrl}
          onChangeText={setBaseUrl}
          editable={!isSearching}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          {isSearching ? (
            <TouchableOpacity style={[styles.stopButton]} onPress={stopSearch}>
              <Text style={styles.buttonText}>{t('urlLookup.stop')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: currentTheme.colors.primary},
              ]}
              onPress={startSearch}>
              <Text style={styles.buttonText}>
                {t('urlLookup.startSearch')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching && (
          <View style={styles.progressContainer}>
            <ActivityIndicator color={currentTheme.colors.primary} />
            <Text
              style={[styles.progressText, {color: currentTheme.colors.text}]}>
              {t('urlLookup.checking')} {currentCheckUrl}
            </Text>
          </View>
        )}

        {foundUrls.length > 0 && (
          <ScrollView style={styles.resultsContainer}>
            <Text
              style={[styles.resultsTitle, {color: currentTheme.colors.text}]}>
              {t('urlLookup.foundUrls')}
            </Text>
            {foundUrls.map((url, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleUrlSelect(url)}
                style={[
                  styles.resultItem,
                  {backgroundColor: currentTheme.colors.card},
                ]}>
                <Text
                  style={[
                    styles.resultText,
                    {color: currentTheme.colors.text},
                  ]}>
                  {url}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={[
            styles.closeButton,
            {backgroundColor: currentTheme.colors.primary},
          ]}
          onPress={onClose}>
          <Text style={styles.buttonText}>{t('urlLookup.close')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    maxHeight: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
  },
  resultsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 14,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  stopButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#FF4444',
  },
});

export default UrlLookupPopup;

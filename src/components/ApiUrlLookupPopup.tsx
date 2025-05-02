import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import useStore from '../store/useStore';
import {lightTheme, darkTheme} from '../types/theme';
import {useTranslation} from 'react-i18next';

interface ApiUrlLookupPopupProps {
  visible: boolean;
  onClose: () => void;
}

const ApiUrlLookupPopup: React.FC<ApiUrlLookupPopupProps> = ({
  visible,
  onClose,
}) => {
  const {theme} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const [baseUrl, setBaseUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [foundUrls, setFoundUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    setBaseUrl('');
    setIsSearching(false);
    setCurrentNumber(0);
    setFoundUrls([]);
    setError(null);
  };

  const checkUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {method: 'HEAD'});
      return response.ok;
    } catch {
      return false;
    }
  };

  const startSearch = async () => {
    if (!baseUrl) {
      setError('Please enter a base URL');
      return;
    }

    setIsSearching(true);
    setError(null);
    setFoundUrls([]);
    setCurrentNumber(0);

    let number = 0;
    const maxAttempts = 1000; // 최대 시도 횟수 제한

    while (isSearching && number < maxAttempts) {
      const url = baseUrl.replace('{number}', number.toString());
      const isValid = await checkUrl(url);

      if (isValid) {
        setFoundUrls(prev => [...prev, url]);
      }

      setCurrentNumber(number);
      number++;
    }

    setIsSearching(false);
  };

  const stopSearch = () => {
    setIsSearching(false);
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
          {t('apiUrlLookup.title')}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border,
            },
          ]}
          placeholder={t('apiUrlLookup.enterBaseUrl')}
          placeholderTextColor={currentTheme.colors.secondary}
          value={baseUrl}
          onChangeText={setBaseUrl}
          editable={!isSearching}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          {isSearching ? (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'red'}]}
              onPress={stopSearch}>
              <Text style={styles.buttonText}>{t('apiUrlLookup.stop')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: currentTheme.colors.primary},
              ]}
              onPress={startSearch}>
              <Text style={styles.buttonText}>
                {t('apiUrlLookup.startSearch')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching && (
          <View style={styles.progressContainer}>
            <ActivityIndicator color={currentTheme.colors.primary} />
            <Text
              style={[styles.progressText, {color: currentTheme.colors.text}]}>
              {t('apiUrlLookup.checking', {
                url: baseUrl.replace('{number}', currentNumber.toString()),
              })}
            </Text>
          </View>
        )}

        {foundUrls.length > 0 && (
          <ScrollView style={styles.resultsContainer}>
            <Text
              style={[styles.resultsTitle, {color: currentTheme.colors.text}]}>
              {t('apiUrlLookup.foundUrls')}
            </Text>
            {foundUrls.map((url, index) => (
              <Text
                key={index}
                style={[styles.resultItem, {color: currentTheme.colors.text}]}>
                {url}
              </Text>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={[
            styles.closeButton,
            {backgroundColor: currentTheme.colors.primary},
          ]}
          onPress={onClose}>
          <Text style={styles.buttonText}>{t('apiUrlLookup.close')}</Text>
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
    marginBottom: 5,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ApiUrlLookupPopup;

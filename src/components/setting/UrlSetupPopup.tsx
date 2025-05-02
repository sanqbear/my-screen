import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

interface UrlSetupPopupProps {
  visible: boolean;
  onClose: () => void;
}

const UrlSetupPopup: React.FC<UrlSetupPopupProps> = ({visible, onClose}) => {
  const {theme, apiUrl, setApiUrl} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (visible) {
      setInputUrl(apiUrl);
      setError(null);
    }
  }, [visible, apiUrl]);

  const validateUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await axios.head(url, {
        timeout: 5000,
        validateStatus: status => status === 200,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!inputUrl) {
      setError(t('urlSetup.errorEmpty'));
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const isValid = await validateUrl(inputUrl);
      if (isValid) {
        setApiUrl(inputUrl);
        onClose();
      } else {
        setError(t('urlSetup.errorInvalid'));
      }
    } catch {
      setError(t('urlSetup.errorInvalid'));
    } finally {
      setIsValidating(false);
    }
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
          {t('urlSetup.title')}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border,
            },
          ]}
          placeholder={t('urlSetup.enterUrl')}
          placeholderTextColor={currentTheme.colors.secondary}
          value={inputUrl}
          onChangeText={text => {
            setInputUrl(text);
            setError(null);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isValidating}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          {isValidating ? (
            <ActivityIndicator color={currentTheme.colors.primary} />
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: currentTheme.colors.primary},
              ]}
              onPress={handleSave}>
              <Text style={styles.buttonText}>{t('urlSetup.save')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.closeButton,
            {backgroundColor: currentTheme.colors.primary},
          ]}
          onPress={onClose}
          disabled={isValidating}>
          <Text style={styles.buttonText}>{t('urlSetup.close')}</Text>
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
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default UrlSetupPopup;

import {Theme} from '@/types';
import {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-gesture-handler';

interface SettingApiSetupModalProps {
  visible: boolean;
  theme: Theme;
  value: string;
  onSubmit: (url: string) => void;
  onPressLookup: () => void;
  onClose: () => void;
}

function SettingApiSetupModal({
  visible,
  theme,
  value,
  onSubmit,
  onPressLookup,
  onClose,
}: SettingApiSetupModalProps) {
  const {t} = useTranslation();
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    setInputUrl(value);
  }, [value]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[styles.overlay, {backgroundColor: theme.cardOverlay}]}
        onPress={onClose}>
        <View style={[styles.container, {backgroundColor: theme.card}]}>
          <Text numberOfLines={1} style={[styles.title, {color: theme.text}]}>
            {t('settings.setupApiUrl')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.background,
              },
            ]}
            value={inputUrl}
            placeholder={t('settings.apiUrlPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            onChangeText={setInputUrl}
          />
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.primary}]}
            onPress={() => onSubmit(inputUrl)}>
            <Text style={[styles.buttonText, {color: theme.textPrimary}]}>
              {t('settings.setupApiUrl')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.primary}]}
            onPress={onPressLookup}>
            <Text style={[styles.buttonText, {color: theme.textPrimary}]}>
              {t('settings.lookupApiUrl')}
            </Text>
          </TouchableOpacity>
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
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default SettingApiSetupModal;
